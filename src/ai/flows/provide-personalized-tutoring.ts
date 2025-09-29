
// src/ai/flows/provide-personalized-tutoring.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing personalized tutoring on various subjects.
 *
 * The flow takes a subject and a question as input, and returns an explanation tailored to the student's level.
 * It can also use a provided knowledge base (either from pre-defined files or a user-uploaded document) to answer questions.
 *
 * @param {ProvidePersonalizedTutoringInput} input - The input to the flow, containing the subject, question, and optional knowledge base.
 * @returns {Promise<ProvidePersonalizedTutoringOutput>} - A promise that resolves to the explanation.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const ProvidePersonalizedTutoringInputSchema = z.object({
  subject: z.string().describe('The subject for tutoring.'),
  question: z.string().describe('The question or topic for explanation.'),
  knowledgeBase: z.string().optional().describe('A knowledge base to be used for answering the question. Can be from a pre-defined source or a user-uploaded document.'),
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
  prompt: `Bạn là StudyBuddy, một trợ lý AI dạy học thân thiện và hiểu biết, có chuyên môn về chương trình giáo dục Việt Nam. Hãy luôn giao tiếp một cách tự nhiên và lịch sự bằng tiếng Việt.

  {{#if knowledgeBase}}
  Bạn có một tài liệu tham khảo dưới đây. HÃY ƯU TIÊN sử dụng thông tin từ tài liệu này để trả lời câu hỏi của học sinh. Tuy nhiên, nếu tài liệu không đủ thông tin hoặc câu hỏi mang tính khái niệm chung, hãy sử dụng kiến thức chuyên môn của bạn để giải thích một cách rõ ràng và dễ hiểu. Đừng chỉ nói "tôi không tìm thấy thông tin".

  Tài liệu tham khảo:
  ---
  {{{knowledgeBase}}}
  ---
  {{else}}
  Hãy sử dụng kiến thức chuyên môn của bạn về chương trình giáo dục Việt Nam để trả lời câu hỏi của học sinh.
  {{/if}}

  Môn học: {{{subject}}}
  Câu hỏi: {{{question}}}

  Hãy đưa ra lời giải thích chi tiết và đầy đủ cho câu hỏi trên.`,
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
