
'use server';

import { providePersonalizedTutoring } from '@/ai/flows/provide-personalized-tutoring';
import { suggestQuestions } from '@/ai/flows/suggest-questions';
import { generateQuiz, type GenerateQuizOutput } from '@/ai/flows/generate-quiz';
import { getKnowledgeBase } from '@/lib/knowledge-base';
import type { EducationLevel } from '@/lib/types';

export async function getTutorResponse(level: EducationLevel, grade: string | undefined, subject: string, question: string, documentContent: string | null) {
  try {
    // If document content is provided, use it as the knowledge base.
    // Otherwise, get knowledge base from pre-defined files.
    const knowledgeBase = documentContent ?? getKnowledgeBase(level, subject, grade);
    const response = await providePersonalizedTutoring({ subject, question, knowledgeBase });
    
    // Use the detailed explanation if it exists and has content, otherwise use the general answer.
    // This correctly handles greetings and simple conversations where only 'answer' is returned.
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

export async function getQuiz(level: EducationLevel, grade: string | undefined, subject: string, topic: string): Promise<{ success: boolean; data?: GenerateQuizOutput; error?: string }> {
    try {
      const context = getKnowledgeBase(level, subject, grade);
      if (!context) {
        return { success: false, error: 'Không tìm thấy cơ sở kiến thức cho môn học này.' };
      }
      const response = await generateQuiz({ topic, context });
      return { success: true, data: response };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: 'Đã có lỗi xảy ra khi tạo câu hỏi ôn tập. Vui lòng thử lại.',
      };
    }
}
