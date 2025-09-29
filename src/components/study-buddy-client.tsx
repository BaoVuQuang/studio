
'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
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
  BrainCircuit,
  MessageCircle,
  Lightbulb,
  ArrowLeft,
  Book,
} from 'lucide-react';

import type { Conversation, Message, Subject, EducationLevel, Grade, QuizData } from '@/lib/types';
import { getQuestionSuggestions, getTutorResponse, getQuiz } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import ChatView from '@/components/chat-view';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from './ui/button';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import QuizDialog from './quiz-dialog';

type View = 'level' | 'grade' | 'subject' | 'mode' | 'chat';

const allThcsSubjects: Subject[] = [
  { value: 'math', label: 'Toán học', icon: Calculator, grades: ['6', '7', '8', '9'] },
  { value: 'physics', label: 'Vật lí', icon: FlaskConical, grades: ['6', '7', '8', '9'] },
  { value: 'chemistry', label: 'Hóa học', icon: Beaker, grades: ['8', '9'] },
  { value: 'biology', label: 'Sinh học', icon: Dna, grades: ['6', '7', '8', '9'] },
  { value: 'literature', label: 'Ngữ văn', icon: BookOpen, grades: ['6', '7', '8', '9'] },
  { value: 'history', label: 'Lịch sử', icon: Landmark, grades: ['6', '7', '8', '9'] },
  { value: 'geography', label: 'Địa lí', icon: Globe, grades: ['6', '7', '8', '9'] },
  { value: 'civics', label: 'GDCD', icon: Scale, grades: ['6', '7', '8', '9'] },
  { value: 'english', label: 'Ngoại ngữ', icon: Languages, grades: ['6', '7', '8', '9'] },
];

const allThptSubjects: Subject[] = [
    { value: 'math', label: 'Toán học', icon: Calculator, grades: ['10', '11', '12'] },
    { value: 'physics', label: 'Vật lí', icon: FlaskConical, grades: ['10', '11', '12'] },
    { value: 'chemistry', label: 'Hóa học', icon: Beaker, grades: ['10', '11', '12'] },
    { value: 'biology', label: 'Sinh học', icon: Dna, grades: ['10', '11', '12'] },
    { value: 'literature', label: 'Ngữ văn', icon: BookOpen, grades: ['10', '11', '12'] },
    { value: 'history', label: 'Lịch sử', icon: Landmark, grades: ['10', '11', '12'] },
    { value: 'geography', label: 'Địa lí', icon: Globe, grades: ['10', '11', '12'] },
    { value: 'civics', label: 'GDCD/Kinh tế & PL', icon: Scale, grades: ['10', '11', '12'] },
    { value: 'english', label: 'Ngoại ngữ', icon: Languages, grades: ['10', '11', '12'] },
];
  
const daihocSubjects: Subject[] = [
    { value: 'math', label: 'Toán cao cấp', icon: Sigma, grades: [] },
    { value: 'physics', label: 'Vật lí đại cương', icon: Atom, grades: [] },
    { value: 'chemistry', label: 'Hóa học đại cương', icon: Beaker, grades: [] },
    { value: 'biology', label: 'Sinh học đại cương', icon: Dna, grades: [] },
    { value: 'philosophy', label: 'Triết học Mác-Lênin', icon: BookCopy, grades: [] },
    { value: 'political-economy', label: 'Kinh tế chính trị Mác-Lênin', icon: BookCopy, grades: [] },
    { value: 'scientific-socialism', label: 'Chủ nghĩa xã hội khoa học', icon: BookCopy, grades: [] },
    { value: 'party-history', label: 'Lịch sử Đảng Cộng sản Việt Nam', icon: BookCopy, grades: [] },
    { value: 'english', label: 'Tiếng Anh học thuật', icon: Languages, grades: [] },
];


const educationLevels: { value: EducationLevel, label: string }[] = [
    { value: 'thcs', label: 'Trung học cơ sở (6-9)'},
    { value: 'thpt', label: 'Trung học phổ thông (10-12)'},
    { value: 'daihoc', label: 'Đại học'},
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
    thcs: allThcsSubjects,
    thpt: allThptSubjects,
    daihoc: daihocSubjects,
};


export default function StudyBuddyClient() {
  const [currentView, setCurrentView] = useState<View>('level');
  
  const [selectedLevel, setSelectedLevel] = useState<EducationLevel | null>(null);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [history, setHistory] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [documentContent, setDocumentContent] = useState<string | null>(null);
  const [documentName, setDocumentName] = useState<string | null>(null);

  const [isQuizDialogOpen, setQuizDialogOpen] = useState(false);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [isQuizLoading, setQuizLoading] = useState(false);


  const { toast } = useToast();

  const handleLevelSelect = (level: EducationLevel) => {
    setSelectedLevel(level);
    const newGrades = gradesByLevel[level];
    setGrades(newGrades);
    if (newGrades.length > 0) {
      setCurrentView('grade');
    } else {
      // Skip grade selection for university level
      setSelectedGrade(null);
      const newSubjects = subjectMap[level];
      setSubjects(newSubjects);
      setCurrentView('subject');
    }
  };

  const handleGradeSelect = (grade: string) => {
    setSelectedGrade(grade);
    if (selectedLevel) {
      const newSubjects = subjectMap[selectedLevel].filter(s => s.grades.includes(grade));
      setSubjects(newSubjects);
      setCurrentView('subject');
    }
  };

  const handleSubjectSelect = (subject: string) => {
    setSelectedSubject(subject);
    setCurrentView('mode');
  };

  const handleModeSelect = (mode: 'chat' | 'quiz') => {
    if (mode === 'chat') {
      setCurrentView('chat');
    } else {
      handleQuiz();
    }
  };

  const handleBack = () => {
    setChatMessages([]); // Clear chat on back
    setDocumentContent(null);
    setDocumentName(null);

    switch (currentView) {
      case 'chat':
        setCurrentView('mode');
        break;
      case 'mode':
        setSelectedSubject(null);
        setCurrentView('subject');
        break;
      case 'subject':
        setSelectedGrade(null);
        if (grades.length > 0) {
          setCurrentView('grade');
        } else {
          setSelectedLevel(null);
          setCurrentView('level');
        }
        break;
      case 'grade':
        setSelectedLevel(null);
        setCurrentView('level');
        break;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setDocumentContent(content);
        setDocumentName(file.name);
        setChatMessages([]);
        toast({
          title: "Tài liệu đã được tải lên",
          description: `Bây giờ bạn có thể hỏi về nội dung của "${file.name}".`,
        });
      };
      reader.readAsText(file);
    }
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
      if (isLoading || !selectedLevel || !selectedSubject) return;

      setIsLoading(true);
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: question,
      };
      setChatMessages((prev) => [...prev, userMessage]);

      const res = await getTutorResponse(selectedLevel, selectedGrade || undefined, selectedSubject, question, documentContent);
      setIsLoading(false);

      if (res.success && res.content) {
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: res.content,
        };
        setChatMessages((prev) => [...prev, assistantMessage]);
        
        if(!documentContent) {
          const newConversation: Conversation = {
            id: `conv-${Date.now()}`,
            level: selectedLevel,
            grade: selectedGrade || undefined,
            subject: selectedSubject,
            question,
            answer: res.content,
          };
          setHistory((prev) => [newConversation, ...prev]);
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Lỗi',
          description: res.error || 'Đã có lỗi xảy ra.',
        });
        setChatMessages((prev) => prev.slice(0, -1));
      }
    },
    [isLoading, selectedLevel, selectedGrade, selectedSubject, toast, documentContent]
  );

  const handleSuggestQuestions = useCallback(
    async (messageId: string, question: string) => {
        if (!selectedSubject) return;
      setChatMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, isSuggestingQuestions: true } : msg
        )
      );

      const res = await getQuestionSuggestions(selectedSubject, question);

      if (res.success && res.questions) {
        setChatMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? {
                  ...msg,
                  suggestedQuestions: res.questions,
                  isSuggestingQuestions: false,
                }
              : msg
          )
        );
      } else {
        toast({
          variant: 'destructive',
          title: 'Lỗi',
          description: res.error,
        });
        setChatMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? { ...msg, isSuggestingQuestions: false }
              : msg
          )
        );
      }
    },
    [selectedSubject, toast]
  );
  
  const handleQuiz = useCallback(async () => {
    if (!selectedLevel || !selectedSubject) return;

    setQuizLoading(true);
    setQuizData(null);
    setQuizDialogOpen(true);

    const res = await getQuiz(selectedLevel, selectedSubject, selectedGrade || undefined);

    if (res.success && res.data) {
      setQuizData(res.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: res.error || 'Không thể tạo bài ôn tập.',
      });
      setQuizDialogOpen(false); // Close dialog on error
    }
    setQuizLoading(false);
  }, [selectedLevel, selectedGrade, selectedSubject, toast]);

  const currentSubject = useMemo(() => {
    return subjects.find((s) => s.value === selectedSubject);
  }, [subjects, selectedSubject]);

  const renderContent = () => {
    switch (currentView) {
      case 'level':
        return (
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Chọn cấp học của bạn</CardTitle>
              <CardDescription>Hãy bắt đầu bằng việc chọn cấp học bạn muốn học.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {educationLevels.map(level => (
                <Button key={level.value} variant="outline" className="w-full h-14 justify-start text-base" onClick={() => handleLevelSelect(level.value)}>
                  {level.label}
                </Button>
              ))}
            </CardContent>
          </Card>
        );
      case 'grade':
        return (
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Chọn lớp học</CardTitle>
              <CardDescription>Bạn đang học lớp mấy?</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup onValueChange={handleGradeSelect} className="grid grid-cols-2 gap-4">
                {grades.map(grade => (
                  <Label key={grade.value} htmlFor={`grade-${grade.value}`} className="flex items-center gap-4 border rounded-md p-4 cursor-pointer hover:bg-accent">
                    <RadioGroupItem value={grade.value} id={`grade-${grade.value}`} />
                    {grade.label}
                  </Label>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        );
      case 'subject':
        return (
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle>Chọn môn học</CardTitle>
              <CardDescription>Bạn muốn học môn gì hôm nay?</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {subjects.map(subject => {
                const Icon = subject.icon;
                return (
                  <Card key={subject.value} className="flex flex-col items-center justify-center p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleSubjectSelect(subject.value)}>
                    <Icon className="w-10 h-10 mb-2 text-primary" />
                    <p className="font-semibold text-center">{subject.label}</p>
                  </Card>
                )
              })}
            </CardContent>
          </Card>
        );
      case 'mode':
        return (
          <Card className="w-full max-w-md">
             <CardHeader>
              <CardTitle>Chọn chế độ</CardTitle>
              <CardDescription>Bạn muốn trò chuyện với AI hay làm bài ôn tập?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full h-20 justify-start text-lg" onClick={() => handleModeSelect('chat')}>
                <MessageCircle className="w-8 h-8 mr-4"/>
                Trò chuyện với AI
              </Button>
              <Button variant="outline" className="w-full h-20 justify-start text-lg" onClick={() => handleModeSelect('quiz')}>
                <Book className="w-8 h-8 mr-4"/>
                Ôn tập kiến thức
              </Button>
            </CardContent>
          </Card>
        );
      case 'chat':
        if (!currentSubject) return null;
        return (
          <div className="h-full w-full flex">
            <ChatView
              key={`${selectedLevel}-${selectedGrade}-${selectedSubject}`}
              messages={chatMessages}
              isLoading={isLoading}
              selectedSubject={currentSubject}
              documentName={documentName}
              onSubmit={handleQuestionSubmit}
              onSuggestQuestions={handleSuggestQuestions}
              onFileChange={handleFileChange}
              onClearDocument={handleClearDocument}
            />
          </div>
        );
      default:
        return null;
    }
  }
  
  const getBreadcrumb = () => {
    if (currentView === 'level') return null;
    const levelLabel = educationLevels.find(l => l.value === selectedLevel)?.label;
    const gradeLabel = gradesByLevel[selectedLevel!]?.find(g => g.value === selectedGrade)?.label;
    const subjectLabel = subjects.find(s => s.value === selectedSubject)?.label;
    
    let path = [levelLabel];
    if (gradeLabel) path.push(gradeLabel);
    if (subjectLabel) path.push(subjectLabel);
    
    return path.filter(Boolean).join(' / ');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-secondary/50 p-4">
       <header className="absolute top-0 left-0 w-full p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {currentView !== 'level' && (
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeft className="h-5 w-5"/>
              </Button>
            )}
             <div className="flex items-center gap-2">
                <BrainCircuit className="h-6 w-6 text-primary" />
                <h1 className="font-bold text-xl">StudyBuddy AI</h1>
              </div>
          </div>
           <div className="text-sm text-muted-foreground font-medium">
             {getBreadcrumb()}
           </div>
       </header>

       <main className="w-full h-full flex-1 flex items-center justify-center">
         {currentView === 'chat' ? (
           <div className="w-full h-[calc(100vh-80px)] mt-16 border rounded-lg overflow-hidden bg-background shadow-lg">
             {renderContent()}
           </div>
         ) : (
           renderContent()
         )}
       </main>
      
       <QuizDialog
         isOpen={isQuizDialogOpen}
         onOpenChange={setQuizDialogOpen}
         quizData={quizData}
         isLoading={isQuizLoading}
         subject={currentSubject}
         topic={currentSubject?.label || ''}
       />
    </div>
  );
}
