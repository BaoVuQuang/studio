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
} from 'lucide-react';

import type { Conversation, Message, Subject, EducationLevel, Grade, QuizData } from '@/lib/types';
import { getQuestionSuggestions, getTutorResponse, getQuiz } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import ChatView from '@/components/chat-view';
import { Skeleton } from '@/components/ui/skeleton';
import QuizView from '@/components/quiz-view';
import DashboardLayout, { AppSidebar, AppContent, AppChatbar } from '@/components/dashboard-layout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

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

function getDefaultSelections() {
  const defaultLevel: EducationLevel = 'thpt';
  const defaultGrade = '12';
  const defaultSubject = 'math';
  return { defaultLevel, defaultGrade, defaultSubject };
}


export default function StudyBuddyClient() {
  const { defaultLevel, defaultGrade, defaultSubject } = getDefaultSelections();

  const [selectedLevel, setSelectedLevel] = useState<EducationLevel>(defaultLevel);
  const [grades, setGrades] = useState<Grade[]>(gradesByLevel[defaultLevel]);
  const [selectedGrade, setSelectedGrade] = useState<string>(defaultGrade);
  
  const [subjects, setSubjects] = useState<Subject[]>(subjectMap[defaultLevel].filter(s => s.grades.includes(defaultGrade)));
  const [selectedSubject, setSelectedSubject] = useState<string>(defaultSubject);
  
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [history, setHistory] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [documentContent, setDocumentContent] = useState<string | null>(null);
  const [documentName, setDocumentName] = useState<string | null>(null);

  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [isQuizLoading, setQuizLoading] = useState(true);

  const { toast } = useToast();
  
  const clearChat = useCallback(() => {
    setChatMessages([]);
    setDocumentContent(null);
    setDocumentName(null);
  }, []);

  const onLevelChange = (level: EducationLevel) => {
    setSelectedLevel(level);
    const newGrades = gradesByLevel[level];
    setGrades(newGrades);
    
    // Reset grade and subject
    const newSelectedGrade = newGrades.length > 0 ? newGrades[0].value : undefined;
    setSelectedGrade(newSelectedGrade as string);
    
    const newSubjects = subjectMap[level].filter(s => newSelectedGrade ? s.grades.includes(newSelectedGrade) : s.grades.length === 0);
    setSubjects(newSubjects);
    setSelectedSubject(newSubjects.length > 0 ? newSubjects[0].value : '');
    
    clearChat();
  };

  const onGradeChange = (grade: string) => {
    setSelectedGrade(grade);
    const newSubjects = subjectMap[selectedLevel].filter(s => s.grades.includes(grade));
    setSubjects(newSubjects);
    setSelectedSubject(newSubjects[0].value);
    clearChat();
  };

  const onSubjectChange = (subject: string) => {
    setSelectedSubject(subject);
    clearChat();
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
  
  const handleGetQuiz = useCallback(async () => {
    if (!selectedLevel || !selectedSubject) return;

    setQuizLoading(true);
    setQuizData(null);
    
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
  }, [selectedLevel, selectedGrade, selectedSubject, toast]);

  useEffect(() => {
    handleGetQuiz();
  }, [selectedSubject, handleGetQuiz]);

  const currentSubjectDetails = useMemo(() => {
    const allSubjects = subjectMap[selectedLevel];
    return allSubjects.find((s) => s.value === selectedSubject);
  }, [selectedLevel, selectedSubject]);

  const renderSidebar = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="level-select">Cấp học</Label>
        <Select value={selectedLevel} onValueChange={(value) => onLevelChange(value as EducationLevel)}>
          <SelectTrigger id="level-select">
            <SelectValue placeholder="Chọn cấp học..." />
          </SelectTrigger>
          <SelectContent>
            {educationLevels.map(level => (
              <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {grades.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="grade-select">Lớp học</Label>
          <Select value={selectedGrade} onValueChange={onGradeChange}>
            <SelectTrigger id="grade-select">
              <SelectValue placeholder="Chọn lớp học..." />
            </SelectTrigger>
            <SelectContent>
              {grades.map(grade => (
                <SelectItem key={grade.value} value={grade.value}>{grade.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="subject-select">Môn học</Label>
         <Select value={selectedSubject} onValueChange={onSubjectChange} disabled={!selectedGrade && grades.length > 0}>
            <SelectTrigger id="subject-select">
              <SelectValue placeholder="Chọn môn học..." />
            </SelectTrigger>
            <SelectContent>
              {subjects.map(subject => (
                <SelectItem key={subject.value} value={subject.value}>{subject.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
      </div>
    </div>
  );

  if (!currentSubjectDetails) {
    return (
      <DashboardLayout>
        <AppSidebar>
          {renderSidebar()}
        </AppSidebar>
        <AppContent>
          <div className="flex items-center justify-center h-full">
            <p>Vui lòng chọn môn học.</p>
          </div>
        </AppContent>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <AppSidebar>
        {renderSidebar()}
      </AppSidebar>
      <AppContent>
        {isQuizLoading ? (
            <div className="p-6 space-y-8">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
        ) : (
          <QuizView 
            key={selectedSubject} 
            quizData={quizData} 
            subject={currentSubjectDetails} 
          />
        )}
      </AppContent>
      <AppChatbar>
         <ChatView
            key={`${selectedLevel}-${selectedGrade}-${selectedSubject}`}
            messages={chatMessages}
            isLoading={isLoading}
            selectedSubject={currentSubjectDetails}
            documentName={documentName}
            onSubmit={handleQuestionSubmit}
            onSuggestQuestions={handleSuggestQuestions}
            onFileChange={handleFileChange}
            onClearDocument={handleClearDocument}
          />
      </AppChatbar>
    </DashboardLayout>
  );
}
