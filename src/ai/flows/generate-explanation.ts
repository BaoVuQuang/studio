'use server';

/**
 * @fileOverview Generates explanations for student questions.
 *
 * - generateExplanation - A function that generates an explanation for a given question and subject.
 * - GenerateExplanationInput - The input type for the generateExplanation function.
 * - GenerateExplanationOutput - The return type for the generateExplanation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateExplanationInputSchema = z.object({
  subject: z.string().describe('The subject of the question.'),
  question: z.string().describe('The question to be answered.'),
});
export type GenerateExplanationInput = z.infer<typeof GenerateExplanationInputSchema>;

const GenerateExplanationOutputSchema = z.object({
  explanation: z.string().describe('The explanation for the question.'),
});
export type GenerateExplanationOutput = z.infer<typeof GenerateExplanationOutputSchema>;

export async function generateExplanation(input: GenerateExplanationInput): Promise<GenerateExplanationOutput> {
  return generateExplanationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateExplanationPrompt',
  input: {schema: GenerateExplanationInputSchema},
  output: {schema: GenerateExplanationOutputSchema},
  prompt: `You are a helpful AI tutoring assistant. A student is asking a question about a specific subject. Generate a clear, concise, and easy-to-understand explanation for the question, tailored to the student's level of understanding.\n\nSubject: {{{subject}}}\nQuestion: {{{question}}}\nExplanation:`,
});

const generateExplanationFlow = ai.defineFlow(
  {
    name: 'generateExplanationFlow',
    inputSchema: GenerateExplanationInputSchema,
    outputSchema: GenerateExplanationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
