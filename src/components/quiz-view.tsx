'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle } from 'lucide-react';
import type { QuizData, Subject } from '@/lib/types';
import Flashcard from './flashcard';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface QuizViewProps {
  quizData: QuizData | null;
  subject: Subject;
}

export default function QuizView({ quizData, subject }: QuizViewProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setSelectedAnswers(prev => ({ ...prev, [questionIndex]: answer }));
  };

  const handleCheckAnswers = () => {
    setSubmitted(true);
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  }
  
  useEffect(() => {
    resetQuiz();
  }, [quizData]);

  if (!quizData) {
    return (
      <Card className="h-full">
        <CardContent className="h-full flex items-center justify-center">
            <p className="text-muted-foreground">Không có dữ liệu ôn tập cho chủ đề này.</p>
        </CardContent>
      </Card>
    );
  }

  const topic = subject.label;

  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="flashcards" className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                <subject.icon className="h-6 w-6 text-primary" />
                Ôn tập: {topic}
            </h2>
            <TabsList>
              <TabsTrigger value="flashcards">Thẻ học tập</TabsTrigger>
              <TabsTrigger value="multiple-choice">Trắc nghiệm</TabsTrigger>
            </TabsList>
        </div>
        <TabsContent value="flashcards" className="flex-1 overflow-y-auto p-1">
           <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 py-4">
                {quizData.flashcards.map((card, index) => (
                    <Flashcard key={index} question={card.question} answer={card.answer} />
                ))}
           </div>
           {quizData.flashcards.length === 0 && <p className="text-muted-foreground text-center py-8">Không có thẻ học tập nào.</p>}
        </TabsContent>
        <TabsContent value="multiple-choice" className="flex-1 overflow-y-auto p-1">
            <div className="space-y-6 py-4">
                {quizData.multipleChoice.map((mcq, index) => (
                    <Card key={index}>
                        <CardContent className="p-6">
                            <p className="font-semibold mb-4">{index + 1}. {mcq.question}</p>
                            <RadioGroup
                                value={selectedAnswers[index]}
                                onValueChange={(value) => handleAnswerChange(index, value)}
                                disabled={submitted}
                            >
                                {mcq.options.map((option, i) => {
                                    const isCorrect = option === mcq.correctAnswer;
                                    const isSelected = selectedAnswers[index] === option;
                                    return (
                                        <div key={i} className={cn(
                                            "flex items-center space-x-2 p-3 rounded-md transition-colors border",
                                            submitted && isCorrect && "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-800",
                                            submitted && isSelected && !isCorrect && "bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-800",
                                        )}>
                                            <RadioGroupItem value={option} id={`q${index}-o${i}`} />
                                            <Label htmlFor={`q${index}-o${i}`} className="flex-1 cursor-pointer">{option}</Label>
                                            {submitted && isCorrect && <CheckCircle className="h-5 w-5 text-green-600" />}
                                            {submitted && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-red-600" />}
                                        </div>
                                    );
                                })}
                            </RadioGroup>
                        </CardContent>
                    </Card>
                ))}
                {quizData.multipleChoice.length === 0 && <p className="text-muted-foreground text-center py-8">Không có câu hỏi trắc nghiệm nào.</p>}
                
                {quizData.multipleChoice.length > 0 && (
                  <div className="flex justify-end gap-2 mt-6">
                      {submitted ? (
                          <Button onClick={resetQuiz}>Làm lại</Button>
                      ) : (
                          <Button onClick={handleCheckAnswers} disabled={Object.keys(selectedAnswers).length === 0}>Kiểm tra đáp án</Button>
                      )}
                  </div>
                )}
                {submitted && (
                    <Alert className="mt-6">
                        <AlertTitle>Đã nộp bài!</AlertTitle>
                        <AlertDescription>
                            Xem lại kết quả của bạn ở trên. Nhấn "Làm lại" để thử lại lần nữa.
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}