
'use server';

import { providePersonalizedTutoring } from '@/ai/flows/provide-personalized-tutoring';
import { suggestLearningResources } from '@/ai/flows/suggest-learning-resources';

export async function getTutorResponse(subject: string, question: string) {
  try {
    const response = await providePersonalizedTutoring({ subject, question });
    return { success: true, explanation: response.explanation };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: 'An error occurred while getting a response. Please try again.',
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
      error: 'An error occurred while suggesting resources. Please try again.',
    };
  }
}
