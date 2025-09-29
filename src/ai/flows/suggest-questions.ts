'use server';

/**
 * @fileOverview Provides suggestions for relevant follow-up questions.
 *
 * - suggestQuestions - A function that suggests questions.
 * - SuggestQuestionsInput - The input type for the suggestQuestions function.
 * - SuggestQuestionsOutput - The return type for the suggestQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestQuestionsInputSchema = z.object({
  topic: z.string().describe('The topic the student is studying.'),
  question: z.string().describe('The last question the student asked.'),
});
export type SuggestQuestionsInput = z.infer<typeof SuggestQuestionsInputSchema>;

const SuggestQuestionsOutputSchema = z.object({
  questions: z
    .array(z.string())
    .describe('A list of 3 suggested follow-up questions.'),
});
export type SuggestQuestionsOutput = z.infer<typeof SuggestQuestionsOutputSchema>;

export async function suggestQuestions(
  input: SuggestQuestionsInput
): Promise<SuggestQuestionsOutput> {
  return suggestQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestQuestionsPrompt',
  input: {schema: SuggestQuestionsInputSchema},
  output: {schema: SuggestQuestionsOutputSchema},
  prompt: `You are an AI tutoring assistant. A student is asking about a topic. Based on their last question, suggest 3 concise and relevant follow-up questions to help them explore the topic further. The questions should be in Vietnamese.

  Topic: {{{topic}}}
  Student's Last Question: {{{question}}}

  Suggested Questions:`,
});

const suggestQuestionsFlow = ai.defineFlow(
  {
    name: 'suggestQuestionsFlow',
    inputSchema: SuggestQuestionsInputSchema,
    outputSchema: SuggestQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
