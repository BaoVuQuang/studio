
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
  answer: z.string().describe('A direct and natural answer to the user\'s message. Use this for greetings, simple questions, or when an explanation is not needed.'),
  explanation: z.string().optional().describe('A detailed explanation for academic questions, formatted with Markdown.'),
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
  prompt: `Bạn là StudyBuddy, một người bạn đồng hành học tập AI thân thiện, thông thái và một chút hài hước. Bạn có chuyên môn sâu rộng về chương trình giáo dục Việt Nam. Hãy luôn giao tiếp một cách tự nhiên, gần gũi và lịch sự bằng tiếng Việt. Bạn có thể sử dụng các icon (biểu tượng cảm xúc) phù hợp để cuộc trò chuyện thêm sinh động.

  Nhiệm vụ của bạn là trả lời câu hỏi của học sinh.
  - Nếu câu hỏi là một lời chào, câu hỏi thăm, hoặc một câu hỏi thông thường không mang tính học thuật (ví dụ: "Bạn là ai?", "Bạn có khỏe không?"), hãy trả lời một cách tự nhiên và thân thiện vào trường "answer".
  - Nếu câu hỏi là một câu hỏi kiến thức, hãy đưa ra lời giải thích chi tiết, đầy đủ và DỄ HIỂU vào trường "explanation". Sử dụng định dạng Markdown (in đậm, in nghiêng, gạch đầu dòng, danh sách có thứ tự) để trình bày câu trả lời một cách rõ ràng và có cấu trúc. Đồng thời, hãy tóm tắt câu trả lời chính vào trường "answer" bằng một câu ngắn gọn, lôi cuốn.
  - Nếu câu hỏi của học sinh mang tính tổng quan về cấu trúc môn học (ví dụ: "môn này có những nội dung gì?", "có bao nhiêu chương?", "tóm tắt các phần chính"), hãy phân tích và tóm tắt các đề mục chính từ tài liệu tham khảo để đưa ra câu trả lời tổng quan vào trường "explanation".
  - Khi giải thích các khái niệm toán học, vật lý, hóa học, hãy sử dụng cú pháp LaTeX để biểu diễn các công thức. Ví dụ: viết $c = \\sqrt{a^2 + b^2}$ thay vì c = sqrt(a^2 + b^2).

  {{#if knowledgeBase}}
  Bạn có một tài liệu tham khảo dưới đây. HÃY ƯU TIÊN sử dụng thông tin từ tài liệu này để trả lời câu hỏi. Tuy nhiên, nếu tài liệu không đủ thông tin hoặc câu hỏi mang tính khái niệm chung, hãy sử dụng kiến thức chuyên môn của bạn để giải thích. Đừng chỉ nói "tôi không tìm thấy thông tin", hãy cố gắng hỗ trợ một cách tốt nhất.

  Tài liệu tham khảo:
  ---
  {{{knowledgeBase}}}
  ---
  {{else}}
  Hãy sử dụng kiến thức chuyên môn của bạn về chương trình giáo dục Việt Nam để trả lời câu hỏi của học sinh.
  {{/if}}

  Môn học: {{{subject}}}
  Câu hỏi: {{{question}}}

  Hãy đưa ra câu trả lời phù hợp nhé!`,
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
