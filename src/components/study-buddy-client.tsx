'use client';

import { useState, useMemo, useCallback, useRef } from 'react';
import {
  BookOpen,
  Calculator,
  Landmark,
  Scale,
  Globe,
  Languages,
  FlaskConical,
  Beaker,
  Dna,
  Atom,
  Sigma,
  BookCopy,
  ChevronRight,
  BrainCircuit,
  MessageCircle,
  ClipboardList,
  ArrowLeft,
  Upload,
} from 'lucide-react';
import type { EducationLevel, Grade, Subject, QuizData, Message } from '@/lib/types';
import { getQuiz, getTutorResponse, getQuestionSuggestions } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import QuizView from '@/components/quiz-view';
import ChatView from '@/components/chat-view';
import { Separator } from './ui/separator';

// Data definitions
const educationLevels: { value: EducationLevel; label: string }[] = [
  { value: 'thcs', label: 'Trung học cơ sở (6-9)' },
  { value: 'thpt', label: 'Trung học phổ thông (10-12)' },
  { value: 'daihoc', label: 'Đại học' },
];

const gradesByLevel: Record<EducationLevel, Grade[]> = {
  thcs: [
    { value: '6', label: 'Lớp 6' },
    { value: '7', label: 'Lớp 7' },
    { value: '8', label: 'Lớp 8' },
    { value: '9', label: 'Lớp 9' },
  ],
  thpt: [
    { value: '10', label: 'Lớp 10' },
    { value: '11', label: 'Lớp 11' },
    { value: '12', label: 'Lớp 12' },
  ],
  daihoc: [],
};

const subjectMap: Record<EducationLevel, Subject[]> = {
  thcs: [
    { value: 'math', label: 'Toán học', icon: Calculator, grades: ['6', '7', '8', '9'] },
    { value: 'physics', label: 'Vật lí', icon: FlaskConical, grades: ['6', '7', '8', '9'] },
    { value: 'chemistry', label: 'Hóa học', icon: Beaker, grades: ['8', '9'] },
    { value: 'biology', label: 'Sinh học', icon: Dna, grades: ['6', '7', '8', '9'] },
    { value: 'literature', label: 'Ngữ văn', icon: BookOpen, grades: ['6', '7', '8', '9'] },
    { value: 'history', label: 'Lịch sử', icon: Landmark, grades: ['6', '7', '8', '9'] },
    { value: 'geography', label: 'Địa lí', icon: Globe, grades: ['6', '7', '8', '9'] },
    { value: 'civics', label: 'GDCD', icon: Scale, grades: ['6', '7', '8', '9'] },
    { value: 'english', label: 'Ngoại ngữ', icon: Languages, grades: ['6', '7', '8', '9'] },
  ],
  thpt: [
    { value: 'math', label: 'Toán học', icon: Calculator, grades: ['10', '11', '12'] },
    { value: 'physics', label: 'Vật lí', icon: FlaskConical, grades: ['10', '11', '12'] },
    { value: 'chemistry', label: 'Hóa học', icon: Beaker, grades: ['10', '11', '12'] },
    { value: 'biology', label: 'Sinh học', icon: Dna, grades: ['10', '11', '12'] },
    { value: 'literature', label: 'Ngữ văn', icon: BookOpen, grades: ['10', '11', '12'] },
    { value: 'history', label: 'Lịch sử', icon: Landmark, grades: ['10', '11', '12'] },
    { value: 'geography', label: 'Địa lí', icon: Globe, grades: ['10', '11', '12'] },
    { value: 'civics', label: 'GDCD/Kinh tế & PL', icon: Scale, grades: ['10', '11', '12'] },
    { value: 'english', label: 'Ngoại ngữ', icon: Languages, grades: ['10', '11', '12'] },
  ],
  daihoc: [
    { value: 'math', label: 'Toán cao cấp', icon: Sigma, grades: [] },
    { value: 'physics', label: 'Vật lí đại cương', icon: Atom, grades: [] },
    { value: 'chemistry', label: 'Hóa học đại cương', icon: Beaker, grades: [] },
    { value: 'biology', label: 'Sinh học đại cương', icon: Dna, grades: [] },
    { value: 'philosophy', label: 'Lý luận chính trị', icon: BookCopy, grades: [] },
    { value: 'english', label: 'Tiếng Anh học thuật', icon: Languages, grades: [] },
  ],
};

type Step = 'level' | 'grade' | 'subject' | 'mode' | 'chat' | 'quiz';

export default function StudyBuddyClient() {
  const [step, setStep] = useState<Step>('level');
  
  const [selectedLevel, setSelectedLevel] = useState<EducationLevel | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [isChatLoading, setChatLoading] = useState(false);
  const [documentContent, setDocumentContent] = useState<string | null>(null);
  const [documentName, setDocumentName] = useState<string | null>(null);

  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [isQuizLoading, setQuizLoading] = useState(false);

  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const availableGrades = useMemo(() => {
    if (!selectedLevel) return [];
    return gradesByLevel[selectedLevel];
  }, [selectedLevel]);

  const availableSubjects = useMemo(() => {
    if (!selectedLevel) return [];
    if (selectedLevel === 'daihoc') {
      return subjectMap.daihoc;
    }
    if (selectedGrade) {
      return subjectMap[selectedLevel].filter(s => s.grades.includes(selectedGrade));
    }
    return [];
  }, [selectedLevel, selectedGrade]);

  const currentSubjectDetails = useMemo(() => {
    if (!selectedLevel || !selectedSubject) return null;
    return subjectMap[selectedLevel].find(s => s.value === selectedSubject) || null;
  }, [selectedLevel, selectedSubject]);

  const handleLevelSelect = (level: EducationLevel) => {
    setSelectedLevel(level);
    setSelectedGrade(null);
    setSelectedSubject(null);
    if (gradesByLevel[level].length === 0) { // Skip grade selection for University
      setStep('subject');
    } else {
      setStep('grade');
    }
  };

  const handleGradeSelect = (grade: string) => {
    setSelectedGrade(grade);
    setSelectedSubject(null);
    setStep('subject');
  };

  const handleSubjectSelect = (subject: string) => {
    setSelectedSubject(subject);
    setStep('mode');
  };

  const handleModeSelect = async (mode: 'chat' | 'quiz') => {
    if (mode === 'chat') {
        setChatMessages([]);
        setDocumentContent(null);
        setDocumentName(null);
        setStep('chat');
    }
    if (mode === 'quiz') {
      if (!selectedLevel || !selectedSubject) return;
      setQuizLoading(true);
      setQuizData(null);
      setStep('quiz');
      
      const res = await getQuiz(selectedLevel, selectedSubject, selectedGrade || undefined);
      
      if (res.success && res.data) {
        setQuizData(res.data);
      } else {
        toast({
          variant: 'destructive',
          title: 'Lỗi',
          description: res.error || 'Không thể tạo bài ôn tập.',
        });
        setQuizData(null);
      }
      setQuizLoading(false);
    }
  };

  const handleBack = () => {
    switch (step) {
      case 'quiz':
      case 'chat':
        if (documentName) { // If we are in a custom document chat, go all the way back to subject selection
          setDocumentContent(null);
          setDocumentName(null);
          setChatMessages([]);
          setStep('subject');
        } else {
          setStep('mode');
        }
        break;
      case 'mode':
        setStep('subject');
        break;
      case 'subject':
        if (selectedLevel === 'daihoc') {
          setStep('level');
        } else {
          setStep('grade');
        }
        break;
      case 'grade':
        setStep('level');
        break;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedLevel) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setDocumentContent(content);
        setDocumentName(file.name);
        // Create a temporary subject for the custom document
        setSelectedSubject(file.name); 
        setChatMessages([]);
        setStep('chat');
        toast({
          title: "Tài liệu đã được tải lên",
          description: `Bây giờ bạn có thể hỏi về nội dung của "${file.name}".`,
        });
      };
      reader.readAsText(file);
    }
    // Reset file input to allow uploading the same file again
    e.target.value = '';
  };

  const handleClearDocument = () => {
    setDocumentContent(null);
    setDocumentName(null);
    toast({
      title: "Đã bỏ tài liệu",
      description: "Cuộc trò chuyện đã quay lại chế độ bình thường.",
    });
  };

  const handleQuestionSubmit = useCallback(
    async (question: string) => {
      if (isChatLoading || !selectedLevel || !selectedSubject) return;

      setChatLoading(true);
      const userMessage: Message = { id: `user-${Date.now()}`, role: 'user', content: question };
      setChatMessages((prev) => [...prev, userMessage]);

      const res = await getTutorResponse(selectedLevel, selectedGrade || undefined, selectedSubject, question, documentContent);
      setChatLoading(false);

      if (res.success && res.content) {
        const assistantMessage: Message = { id: `assistant-${Date.now()}`, role: 'assistant', content: res.content };
        setChatMessages((prev) => [...prev, assistantMessage]);
      } else {
        toast({ variant: 'destructive', title: 'Lỗi', description: res.error || 'Đã có lỗi xảy ra.' });
        setChatMessages((prev) => prev.slice(0, -1));
      }
    },
    [isChatLoading, selectedLevel, selectedGrade, selectedSubject, toast, documentContent]
  );
  
  const handleSuggestQuestions = useCallback(async (messageId: string, question: string) => {
    if (!selectedSubject) return;
    setChatMessages((prev) => prev.map((msg) => msg.id === messageId ? { ...msg, isSuggestingQuestions: true } : msg));

    const res = await getQuestionSuggestions(selectedSubject, question);

    if (res.success && res.questions) {
      setChatMessages((prev) => prev.map((msg) => msg.id === messageId ? { ...msg, suggestedQuestions: res.questions, isSuggestingQuestions: false } : msg));
    } else {
      toast({ variant: 'destructive', title: 'Lỗi', description: res.error });
      setChatMessages((prev) => prev.map((msg) => msg.id === messageId ? { ...msg, isSuggestingQuestions: false } : msg));
    }
  }, [selectedSubject, toast]);

  const renderBreadcrumbs = () => {
    if (step === 'level') return null;
    const levelLabel = educationLevels.find(l => l.value === selectedLevel)?.label;
    const gradeLabel = availableGrades.find(g => g.value === selectedGrade)?.label;
    
    return (
      <div className="flex items-center text-sm text-muted-foreground mb-4">
        {levelLabel && <Button variant="link" className="p-0 h-auto" onClick={() => setStep('level')}>{levelLabel}</Button>}
        {gradeLabel && (
          <>
            <ChevronRight className="h-4 w-4 mx-1" />
            <Button variant="link" className="p-0 h-auto" onClick={() => setStep('grade')}>{gradeLabel}</Button>
          </>
        )}
        {currentSubjectDetails && step !== 'subject' && (
          <>
            <ChevronRight className="h-4 w-4 mx-1" />
            <Button variant="link" className="p-0 h-auto" onClick={() => setStep('subject')}>{currentSubjectDetails.label}</Button>
          </>
        )}
      </div>
    );
  };
  
  const renderContent = () => {
    switch (step) {
      case 'level':
        return (
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle>Chọn cấp học của bạn</CardTitle>
              <CardDescription>Hãy bắt đầu bằng cách chọn cấp học bạn đang theo học.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {educationLevels.map(level => (
                <Button key={level.value} variant="outline" className="w-full justify-between" size="lg" onClick={() => handleLevelSelect(level.value)}>
                  {level.label}
                  <ChevronRight />
                </Button>
              ))}
            </CardContent>
          </Card>
        );

      case 'grade':
        return (
          <Card className="w-full max-w-lg">
            <CardHeader>
              {renderBreadcrumbs()}
              <CardTitle>Chọn lớp học</CardTitle>
              <CardDescription>Cung cấp thêm thông tin để cá nhân hóa trải nghiệm học tập.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              {availableGrades.map(grade => (
                <Button key={grade.value} variant="outline" size="lg" onClick={() => handleGradeSelect(grade.value)}>
                  {grade.label}
                </Button>
              ))}
            </CardContent>
          </Card>
        );

      case 'subject':
        return (
          <Card className="w-full max-w-2xl">
            <CardHeader>
              {renderBreadcrumbs()}
              <CardTitle>Chọn môn học</CardTitle>
              <CardDescription>Bạn muốn học về môn gì hôm nay?</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableSubjects.map(subject => (
                <Button key={subject.value} variant="outline" className="h-20 flex-col gap-2" onClick={() => handleSubjectSelect(subject.value)}>
                  <subject.icon className="h-6 w-6 text-primary" />
                  <span>{subject.label}</span>
                </Button>
              ))}
            </CardContent>
             <CardFooter className="flex-col items-center gap-4 pt-6">
                <div className="flex items-center w-full">
                    <Separator className="flex-1" />
                    <span className="px-4 text-xs text-muted-foreground">HOẶC</span>
                    <Separator className="flex-1" />
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".txt,.md"
                />
                <Button variant="secondary" className="w-full" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" />
                    Tải lên tài liệu riêng...
                </Button>
             </CardFooter>
          </Card>
        );

      case 'mode':
        return (
          <Card className="w-full max-w-lg">
            <CardHeader>
              {renderBreadcrumbs()}
              <CardTitle>Chọn chế độ</CardTitle>
              <CardDescription>Bạn muốn làm gì với môn {currentSubjectDetails?.label}?</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="h-28 flex-col gap-2" onClick={() => handleModeSelect('chat')}>
                <MessageCircle className="h-8 w-8 text-primary" />
                <span className="font-semibold">Trò chuyện với AI</span>
              </Button>
              <Button variant="outline" className="h-28 flex-col gap-2" onClick={() => handleModeSelect('quiz')}>
                <ClipboardList className="h-8 w-8 text-primary" />
                <span className="font-semibold">Ôn tập kiến thức</span>
              </Button>
            </CardContent>
          </Card>
        );

      case 'chat':
        return (
          <div className="h-full w-full max-w-4xl flex flex-col p-4 sm:p-6 md:p-8">
            <header className="flex items-center gap-4 mb-4">
               <Button variant="outline" size="icon" className="h-8 w-8 flex-shrink-0" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="min-w-0">
                <h1 className="text-xl font-bold truncate">Trò chuyện: {documentName || currentSubjectDetails?.label}</h1>
                {renderBreadcrumbs()}
              </div>
            </header>
            <div className="flex-1 min-h-0">
               {(currentSubjectDetails || documentName) && (
                <ChatView
                    key={`${selectedLevel}-${selectedGrade}-${selectedSubject}`}
                    messages={chatMessages}
                    isLoading={isChatLoading}
                    selectedSubject={currentSubjectDetails || { label: documentName || 'Tài liệu của bạn', value: 'custom', icon: BookOpen, grades: [] }}
                    documentName={documentName}
                    onSubmit={handleQuestionSubmit}
                    onSuggestQuestions={handleSuggestQuestions}
                    onFileChange={handleFileChange}
                    onClearDocument={handleClearDocument}
                />
               )}
            </div>
          </div>
        );

      case 'quiz':
        return (
            <div className="h-full w-full max-w-6xl flex flex-col p-4 sm:p-6 md:p-8">
                 <header className="flex items-center gap-4 mb-4">
                    <Button variant="outline" size="icon" className="h-8 w-8 flex-shrink-0" onClick={handleBack}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="min-w-0">
                        <h1 className="text-xl font-bold truncate">Ôn tập: {currentSubjectDetails?.label}</h1>
                        {renderBreadcrumbs()}
                    </div>
                </header>
                <div className="flex-1 min-h-0 bg-card rounded-lg shadow-sm p-4 sm:p-6">
                    {isQuizLoading ? (
                        <div className="space-y-8">
                            <Skeleton className="h-8 w-1/3" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Skeleton className="h-48 w-full" />
                                <Skeleton className="h-48 w-full" />
                                <Skeleton className="h-64 w-full" />
                                <Skeleton className="h-64 w-full" />
                            </div>
                        </div>
                    ) : (
                        currentSubjectDetails && <QuizView key={selectedSubject} quizData={quizData} subject={currentSubjectDetails} />
                    )}
                </div>
            </div>
        );

      default:
        return null;
    }
  };

  const isSelectionStep = step === 'level' || step === 'grade' || step === 'subject' || step === 'mode';

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-4">
        {isSelectionStep && (
            <div className="flex items-center gap-2 mb-8">
                <BrainCircuit className="h-8 w-8 text-primary" />
                <h1 className="font-bold text-3xl tracking-tight">StudyBuddy AI</h1>
            </div>
        )}
        {renderContent()}
    </div>
  );
}

    