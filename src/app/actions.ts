
'use server';

import { providePersonalizedTutoring } from '@/ai/flows/provide-personalized-tutoring';
import { suggestLearningResources } from '@/ai/flows/suggest-learning-resources';
import { generateQuiz, type GenerateQuizOutput } from '@/ai/flows/generate-quiz';
import { getKnowledgeBase } from '@/lib/knowledge-base';
import type { EducationLevel } from '@/lib/types';

export async function getTutorResponse(level: EducationLevel, subject: string, question: string, documentContent: string | null) {
  try {
    // If document content is provided, use it as the knowledge base.
    // Otherwise, get knowledge base from pre-defined files.
    const knowledgeBase = documentContent ?? getKnowledgeBase(level, subject);
    const response = await providePersonalizedTutoring({ subject, question, knowledgeBase });
    return { success: true, explanation: response.explanation };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: 'Đã có lỗi xảy ra khi nhận phản hồi. Vui lòng thử lại.',
    };
  }
}

export async function getResourceSuggestions(topic: string, needs: string) {
  try {
    const response = await suggestLearningResources({ topic, needs });
    return { success: true, resources: response.resources };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: 'Đã có lỗi xảy ra khi gợi ý tài nguyên. Vui lòng thử lại.',
    };
  }
}

export async function getQuiz(level: EducationLevel, subject: string, topic: string): Promise<{ success: boolean; data?: GenerateQuizOutput; error?: string }> {
    try {
      const context = getKnowledgeBase(level, subject);
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
