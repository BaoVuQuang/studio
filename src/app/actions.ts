
'use server';

import { providePersonalizedTutoring } from '@/ai/flows/provide-personalized-tutoring';
import { suggestLearningResources } from '@/ai/flows/suggest-learning-resources';
import { getKnowledgeBase } from '@/lib/knowledge-base';

export async function getTutorResponse(subject: string, question: string) {
  try {
    const knowledgeBase = getKnowledgeBase(subject);
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
