'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <subject.icon className="h-6 w-6" />
              Ôn tập: {subject.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Không có dữ liệu ôn tập cho môn học này.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const topic = subject.label;

  return (
    <div className="p-6">
      <Tabs defaultValue="flashcards" className="w-full">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold tracking-tight">Ôn tập: {topic}</h2>
            <TabsList>
              <TabsTrigger value="flashcards">Thẻ học tập</TabsTrigger>
              <TabsTrigger value="multiple-choice">Trắc nghiệm</TabsTrigger>
            </TabsList>
        </div>
        <TabsContent value="flashcards">
           <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 py-4">
                {quizData.flashcards.map((card, index) => (
                    <Flashcard key={index} question={card.question} answer={card.answer} />
                ))}
           </div>
           {quizData.flashcards.length === 0 && <p className="text-muted-foreground text-center py-8">Không có thẻ học tập nào.</p>}
        </TabsContent>
        <TabsContent value="multiple-choice">
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
                  <div className="flex justify-end gap-2">
                      {submitted ? (
                          <Button onClick={resetQuiz}>Làm lại</Button>
                      ) : (
                          <Button onClick={handleCheckAnswers} disabled={Object.keys(selectedAnswers).length === 0}>Kiểm tra đáp án</Button>
                      )}
                  </div>
                )}
                {submitted && (
                    <Alert>
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
