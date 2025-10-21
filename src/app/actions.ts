'use server';

import { providePersonalizedTutoring, type ProvidePersonalizedTutoringInput } from '@/ai/flows/provide-personalized-tutoring';
import { suggestQuestions } from '@/ai/flows/suggest-questions';
import { generateQuiz } from '@/ai/flows/generate-quiz';
import { getKnowledgeBase } from '@/lib/knowledge-base';
import type { EducationLevel, QuizData } from '@/lib/types';

// Updated to await the lazy knowledge base loader so the server action always sees fresh subject data.
export async function getTutorResponse(level: EducationLevel, grade: string | undefined, subject: string, question: string, documentContent: string | null) {
  try {
    // If user uploaded a document, use its content as knowledge base.
    // Otherwise, find the knowledge base for the selected subject.
    const knowledgeBase = documentContent ?? await getKnowledgeBase(level, subject, grade);

    const input: ProvidePersonalizedTutoringInput = { subject, question };
    // Only add knowledgeBase to input if it exists, to avoid errors with undefined values
    if (knowledgeBase) {
      input.knowledgeBase = knowledgeBase;
    }

    const response = await providePersonalizedTutoring(input);

    const content = (response.explanation && response.explanation.trim() !== '') ? response.explanation : response.answer;

    return { success: true, content: content };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: 'Đã có lỗi xảy ra khi nhận phản hồi. Vui lòng thử lại.',
    };
  }
}

export async function getQuestionSuggestions(topic: string, question: string) {
  try {
    const response = await suggestQuestions({ topic, question });
    return { success: true, questions: response.questions };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: 'Đã có lỗi xảy ra khi gợi ý câu hỏi. Vui lòng thử lại.',
    };
  }
}

// Updated to fetch contextual knowledge lazily so quiz generation follows the new JSON data pipeline.
export async function getQuiz(level: EducationLevel, subject: string, grade: string | undefined): Promise<{ success: boolean; data?: QuizData; error?: string }> {
  try {
    const context = await getKnowledgeBase(level, subject, grade);
    if (!context) {
      return {
        success: false,
        error: 'Không tìm thấy kiến thức nền cho chủ đề này.',
      };
    }

    const topic = `${subject} - ${grade ? `Lớp ${grade}` : level}`;
    const response = await generateQuiz({ topic, context });
    return { success: true, data: response };
  } catch (error) {
    console.error('Error generating quiz:', error);
    return {
      success: false,
      error: 'Đã có lỗi xảy ra khi tạo câu hỏi ôn tập.',
    };
  }
}
