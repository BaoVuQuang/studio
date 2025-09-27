// src/ai/flows/provide-personalized-tutoring.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing personalized tutoring on various subjects.
 *
 * The flow takes a subject and a question as input, and returns an explanation tailored to the student's level.
 *
 * @param {ProvidePersonalizedTutoringInput} input - The input to the flow, containing the subject and question.
 * @returns {Promise<ProvidePersonalizedTutoringOutput>} - A promise that resolves to the explanation.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const ProvidePersonalizedTutoringInputSchema = z.object({
  subject: z.string().describe('The subject for tutoring.'),
  question: z.string().describe('The question or topic for explanation.'),
  knowledgeBase: z.string().optional().describe('Relevant knowledge base information to provide accurate and relevant information.'),
});

export type ProvidePersonalizedTutoringInput = z.infer<
  typeof ProvidePersonalizedTutoringInputSchema
>;

// Define the output schema
const ProvidePersonalizedTutoringOutputSchema = z.object({
  explanation: z.string().describe('The explanation tailored to the student.'),
});

export type ProvidePersonalizedTutoringOutput = z.infer<
  typeof ProvidePersonalizedTutoringOutputSchema
>;

// Exported function to provide personalized tutoring
export async function providePersonalizedTutoring(
  input: ProvidePersonalizedTutoringInput
): Promise<ProvidePersonalizedTutoringOutput> {
  return providePersonalizedTutoringFlow(input);
}

// Define the prompt
const tutoringPrompt = ai.definePrompt({
  name: 'tutoringPrompt',
  input: {schema: ProvidePersonalizedTutoringInputSchema},
  output: {schema: ProvidePersonalizedTutoringOutputSchema},
  prompt: `You are a personalized tutor. Your goal is to provide clear and concise explanations tailored to the student's level.

  Subject: {{{subject}}}
  Question: {{{question}}}

  {{#if knowledgeBase}}
  Knowledge Base:
  {{knowledgeBase}}
  {{/if}}

  Explanation:`, // Handlebars syntax
});

// Define the flow
const providePersonalizedTutoringFlow = ai.defineFlow(
  {
    name: 'providePersonalizedTutoringFlow',
    inputSchema: ProvidePersonalizedTutoringInputSchema,
    outputSchema: ProvidePersonalizedTutoringOutputSchema,
  },
  async input => {
    const {output} = await tutoringPrompt(input);
    return output!;
  }
);
