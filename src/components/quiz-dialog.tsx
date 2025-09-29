// src/components/quiz-dialog.tsx
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { LoaderCircle } from 'lucide-react';
import type { QuizData, Subject } from '@/lib/types';
import Flashcard from './flashcard';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { CheckCircle, XCircle } from 'lucide-react';


interface QuizDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  quizData: QuizData | null;
  isLoading: boolean;
  subject: Subject;
}

export default function QuizDialog({
  isOpen,
  onOpenChange,
  quizData,
  isLoading,
  subject,
}: QuizDialogProps) {
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
    
    // Reset state when dialog is closed or new data is loaded
    useState(() => {
        if (isOpen) {
          resetQuiz();
        }
    });


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <subject.icon className="h-5 w-5" />
            Ôn tập: {subject.label}
          </DialogTitle>
          <DialogDescription>
            Kiểm tra kiến thức của bạn với thẻ học tập và câu hỏi trắc nghiệm.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">Đang tạo câu hỏi ôn tập...</p>
            </div>
          </div>
        ) : quizData ? (
          <Tabs defaultValue="flashcards" className="flex-1 flex flex-col min-h-0">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="flashcards">Thẻ học tập</TabsTrigger>
              <TabsTrigger value="multiple-choice">Trắc nghiệm</TabsTrigger>
            </TabsList>
            <TabsContent value="flashcards" className="flex-1 overflow-y-auto p-1">
               <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 py-4">
                    {quizData.flashcards.map((card, index) => (
                        <Flashcard key={index} question={card.question} answer={card.answer} />
                    ))}
               </div>
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
                                                "flex items-center space-x-2 p-3 rounded-md transition-colors",
                                                submitted && isCorrect && "bg-green-100 dark:bg-green-900/30",
                                                submitted && isSelected && !isCorrect && "bg-red-100 dark:bg-red-900/30",
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
                     <div className="flex justify-end gap-2">
                        {submitted ? (
                            <Button onClick={resetQuiz}>Làm lại</Button>
                        ) : (
                            <Button onClick={handleCheckAnswers}>Kiểm tra đáp án</Button>
                        )}
                    </div>
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
        ) : (
            <div className="flex flex-1 items-center justify-center">
                 <p className="text-muted-foreground">Không có dữ liệu để hiển thị.</p>
            </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
