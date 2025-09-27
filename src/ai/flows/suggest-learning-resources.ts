'use server';

/**
 * @fileOverview Provides suggestions for relevant learning resources based on the student's needs and the topic they're studying.
 *
 * - suggestLearningResources - A function that suggests learning resources.
 * - SuggestLearningResourcesInput - The input type for the suggestLearningResources function.
 * - SuggestLearningResourcesOutput - The return type for the suggestLearningResources function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestLearningResourcesInputSchema = z.object({
  topic: z.string().describe('The topic the student is studying.'),
  needs: z.string().describe('The specific needs or questions of the student.'),
});
export type SuggestLearningResourcesInput = z.infer<typeof SuggestLearningResourcesInputSchema>;

const SuggestLearningResourcesOutputSchema = z.object({
  resources: z
    .array(z.string())
    .describe('A list of suggested learning resources (e.g., links to websites, books, articles).'),
});
export type SuggestLearningResourcesOutput = z.infer<typeof SuggestLearningResourcesOutputSchema>;

export async function suggestLearningResources(
  input: SuggestLearningResourcesInput
): Promise<SuggestLearningResourcesOutput> {
  return suggestLearningResourcesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestLearningResourcesPrompt',
  input: {schema: SuggestLearningResourcesInputSchema},
  output: {schema: SuggestLearningResourcesOutputSchema},
  prompt: `You are an AI assistant designed to suggest learning resources to students.

  Based on the topic and the student's needs, suggest a list of relevant learning resources.
  These resources can include websites, books, articles, or any other helpful materials.

  Topic: {{{topic}}}
  Student Needs: {{{needs}}}

  Suggestions:`, 
});

const suggestLearningResourcesFlow = ai.defineFlow(
  {
    name: 'suggestLearningResourcesFlow',
    inputSchema: SuggestLearningResourcesInputSchema,
    outputSchema: SuggestLearningResourcesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
