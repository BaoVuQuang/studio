// src/ai/flows/generate-quiz.ts
'use server';

/**
 * @fileOverview Generates study materials like flashcards and multiple-choice questions.
 *
 * - generateQuiz - A function that generates a quiz for a given topic and context.
 * - GenerateQuizInput - The input type for the generateQuiz function.
 * - GenerateQuizOutput - The return type for the generateQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FlashcardSchema = z.object({
  question: z.string().describe('The front of the flashcard (a question or a term).'),
  answer: z.string().describe('The back of the flashcard (the answer or definition).'),
});

const MultipleChoiceQuestionSchema = z.object({
  question: z.string().describe('The multiple-choice question.'),
  options: z.array(z.string()).describe('An array of 4 possible answers.'),
  correctAnswer: z.string().describe('The correct answer from the options array.'),
});

const GenerateQuizInputSchema = z.object({
  topic: z.string().describe('The topic to generate a quiz for.'),
  context: z.string().describe('The knowledge base context for the topic.'),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const GenerateQuizOutputSchema = z.object({
  flashcards: z
    .array(FlashcardSchema)
    .describe('An array of 3-5 flashcards.'),
  multipleChoice: z
    .array(MultipleChoiceQuestionSchema)
    .describe('An array of 2-3 multiple-choice questions.'),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;

export async function generateQuiz(
  input: GenerateQuizInput
): Promise<GenerateQuizOutput> {
  return generateQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: {schema: GenerateQuizInputSchema},
  output: {schema: GenerateQuizOutputSchema},
  prompt: `Bạn là một giáo viên chuyên nghiệp, nhiệm vụ của bạn là tạo ra các tài liệu học tập dựa trên một chủ đề và bối cảnh kiến thức cho trước.

Hãy tạo ra một bộ tài liệu ôn tập bao gồm:
1.  Khoảng 3-5 thẻ học tập (flashcards) với câu hỏi/thuật ngữ ở mặt trước và câu trả lời/định nghĩa ở mặt sau.
2.  Khoảng 2-3 câu hỏi trắc nghiệm, mỗi câu có 4 lựa chọn và chỉ một câu trả lời đúng.

Các câu hỏi và câu trả lời phải rõ ràng, chính xác và CHỈ DỰA VÀO BỐI CẢNH KIẾN THỨC được cung cấp dưới đây.

Bối cảnh kiến thức:
---
{{{context}}}
---

Chủ đề chính cần tập trung: {{{topic}}}

Hãy tạo ra bộ tài liệu ôn tập.`,
});

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
