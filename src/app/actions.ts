'use server';

import { providePersonalizedTutoring, type ProvidePersonalizedTutoringInput } from '@/ai/flows/provide-personalized-tutoring';
import { suggestQuestions } from '@/ai/flows/suggest-questions';
import { generateQuiz } from '@/ai/flows/generate-quiz';
import { getKnowledgeBase, getKnowledgeSections } from '@/lib/knowledge-base';
import type { KnowledgeSection } from '@/lib/knowledge-base';
import type { EducationLevel, QuizData } from '@/lib/types';
import { classifyError, logStructured, runWithResilience, CircuitOpenError } from '@/lib/server-resilience';

// Updated to await the lazy knowledge base loader so the server action always sees fresh subject data.
export async function getTutorResponse(
  level: EducationLevel,
  grade: string | undefined,
  subject: string,
  question: string,
  documentContent: string | null
) {
  // Align server action behaviour with backend resilience helpers so repeated AI failures do not spam Genkit.
  const isCustomDocument = subject === 'custom';
  const hasDocumentContext = typeof documentContent === 'string' && documentContent.length > 0;

  if (isCustomDocument && !hasDocumentContext) {
    return {
      success: false,
      error: 'Phiên tài liệu đã hết hạn trong bộ nhớ. Vui lòng tải lại tệp để tiếp tục.',
    };
  }

  try {
    const knowledgeBase = hasDocumentContext ? documentContent : await getKnowledgeBase(level, subject, grade);

    if (!knowledgeBase) {
      logStructured('warn', 'Knowledge base missing for tutor response', {
        level,
        grade: grade ?? null,
        subject,
      });
    }

    const input: ProvidePersonalizedTutoringInput = {
      subject: isCustomDocument && hasDocumentContext ? 'custom-document' : subject,
      question,
    };
    if (knowledgeBase) {
      input.knowledgeBase = knowledgeBase;
    }

    const response = await runWithResilience('providePersonalizedTutoring', () => providePersonalizedTutoring(input));
    const content = response.explanation && response.explanation.trim() !== '' ? response.explanation : response.answer;

    return { success: true, content };
  } catch (error) {
    if (error instanceof CircuitOpenError) {
      logStructured('warn', 'Tutor response circuit open', { subject, level, grade: grade ?? null });
      return {
        success: false,
        error: 'Dịch vụ AI đang tạm thời quá tải. Vui lòng thử lại sau ít phút.',
      };
    }

    const classification = classifyError(error);
    logStructured('error', 'Tutor response failed', {
      subject,
      level,
      grade: grade ?? null,
      classification: classification.type,
    });

    return {
      success: false,
      error: mapClassificationToMessage(classification.type, 'Đã có lỗi xảy ra khi nhận phản hồi. Vui lòng thử lại.'),
    };
  }
}

export async function getQuestionSuggestions(topic: string, question: string) {
  // Mirror structured logging so suggestion failures can be triaged alongside tutor responses.
  try {
    const response = await runWithResilience('suggestQuestions', () => suggestQuestions({ topic, question }));
    return { success: true, questions: response.questions };
  } catch (error) {
    if (error instanceof CircuitOpenError) {
      logStructured('warn', 'Suggestion circuit open', { topic });
      return {
        success: false,
        error: 'Tính năng gợi ý câu hỏi đang được tạm ngắt để ổn định hệ thống. Hãy thử lại sau.',
      };
    }

    const classification = classifyError(error);
    logStructured('error', 'Suggestion failed', {
      topic,
      classification: classification.type,
    });

    return {
      success: false,
      error: mapClassificationToMessage(classification.type, 'Đã có lỗi xảy ra khi gợi ý câu hỏi. Vui lòng thử lại.'),
    };
  }
}

// Updated to fetch contextual knowledge lazily so quiz generation follows the new JSON data pipeline.
export async function getQuiz(level: EducationLevel, subject: string, grade: string | undefined): Promise<{ success: boolean; data?: QuizData; error?: string }> {
  // Apply the same resilience helpers to quiz generation so repeated failures do not spam Genkit.
  try {
    const context = await getKnowledgeBase(level, subject, grade);
    if (!context) {
      logStructured('warn', 'Quiz context missing', { level, subject, grade: grade ?? null });
      return {
        success: false,
        error: 'Không tìm thấy kiến thức nền cho chủ đề này.',
      };
    }

    const topic = `${subject} - ${grade ? `Lớp ${grade}` : level}`;
    const response = await runWithResilience('generateQuiz', () => generateQuiz({ topic, context }));
    return { success: true, data: response };
  } catch (error) {
    if (error instanceof CircuitOpenError) {
      logStructured('warn', 'Quiz circuit open', { level, subject, grade: grade ?? null });
      return {
        success: false,
        error: 'Hệ thống đang tạm dừng tạo bài ôn tập do lỗi liên tiếp. Thử lại sau ít phút.',
      };
    }

    const classification = classifyError(error);
    logStructured('error', 'Quiz generation failed', {
      level,
      subject,
      grade: grade ?? null,
      classification: classification.type,
    });

    return {
      success: false,
      error: mapClassificationToMessage(classification.type, 'Đã có lỗi xảy ra khi tạo câu hỏi ôn tập.'),
    };
  }
}

/**
 * Maps error categories to localized user-facing messages while preserving a sensible fallback.
 */
function mapClassificationToMessage(type: ReturnType<typeof classifyError>['type'], fallback: string) {
  switch (type) {
    case 'TimeoutError':
      return 'Dịch vụ phản hồi chậm. Vui lòng thử lại trong giây lát.';
    case 'QuotaError':
      return 'Hệ thống tạm hết hạn mức sử dụng. Thử lại sau ít phút nhé.';
    case 'ValidationError':
      return 'Yêu cầu chưa hợp lệ. Vui lòng kiểm tra lại nội dung và thử lại.';
    default:
      return fallback;
  }
}

/**
 * Fetches the structured knowledge sections so the client can render them without parsing markdown manually.
 */
export async function getKnowledgeSectionsOverview(
  level: EducationLevel,
  subject: string,
  grade?: string
): Promise<{ success: boolean; sections?: KnowledgeSection[]; error?: string }> {
  try {
    const sections = await getKnowledgeSections(level, subject, grade);
    if (!sections || sections.length === 0) {
      logStructured('warn', 'Knowledge sections unavailable', { level, subject, grade: grade ?? null });
      return { success: true, sections: [] };
    }

    return { success: true, sections };
  } catch (error) {
    const classification = classifyError(error);
    logStructured('error', 'Knowledge sections retrieval failed', {
      level,
      subject,
      grade: grade ?? null,
      classification: classification.type,
    });
    return {
      success: false,
      error: 'Không thể tải nội dung kiến thức nền cho môn học này.',
    };
  }
}
