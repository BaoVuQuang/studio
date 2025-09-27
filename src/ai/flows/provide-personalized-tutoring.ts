
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
  prompt: `Bạn là một trợ lý AI, chỉ trả lời bằng tiếng Việt.
  
  {{#if knowledgeBase}}
  DỰA VÀO VÀ CHỈ DỰA VÀO CƠ SỞ KIẾN THỨC DƯỚI ĐÂY ĐỂ TRẢ LỜI CÂU HỎI. KHÔNG ĐƯỢC SỬ DỤNG BẤT KỲ THÔNG TIN NÀO BÊN NGOÀI.
  Nếu câu hỏi không liên quan đến nội dung trong cơ sở kiến thức, hãy trả lời: "Tôi không thể tìm thấy thông tin này trong tài liệu được cung cấp."
  
  Cơ sở kiến thức:
  ---
  {{{knowledgeBase}}}
  ---
  {{else}}
  Bạn là một gia sư AI. Mục tiêu của bạn là cung cấp các giải thích rõ ràng, ngắn gọn và dễ hiểu, bám sát chương trình giáo dục Việt Nam.
  {{/if}}

  Môn học: {{{subject}}}
  Câu hỏi: {{{question}}}

  Giải thích:`,
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
