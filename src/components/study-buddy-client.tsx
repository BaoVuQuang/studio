
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

import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from '@/components/ui/sidebar';
import type { Conversation, Message, Subject, EducationLevel, QuizData, Grade } from '@/lib/types';
import { getQuestionSuggestions, getTutorResponse, getQuiz } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import AppSidebar from '@/components/app-sidebar';
import ChatView from '@/components/chat-view';
import QuizDialog from './quiz-dialog';

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
  const [selectedLevel, setSelectedLevel] = useState<EducationLevel>('thpt');
  const [grades, setGrades] = useState<Grade[]>(gradesByLevel[selectedLevel]);
  const [selectedGrade, setSelectedGrade] = useState<string | undefined>(gradesByLevel[selectedLevel][0]?.value);
  const [subjects, setSubjects] = useState<Subject[]>(subjectMap[selectedLevel]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [history, setHistory] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [documentContent, setDocumentContent] = useState<string | null>(null);
  const [documentName, setDocumentName] = useState<string | null>(null);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [isQuizDialogOpen, setIsQuizDialogOpen] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [quizTopic, setQuizTopic] = useState<string>('');


  const { toast } = useToast();

  const clearChat = () => {
    setChatMessages([]);
  }

  const clearDocumentWithoutToast = () => {
    setDocumentContent(null);
    setDocumentName(null);
  }

  // Effect to update available GRADES and reset grade selection when LEVEL changes
  useEffect(() => {
    const newGrades = gradesByLevel[selectedLevel];
    setGrades(newGrades);
    setSelectedGrade(newGrades[0]?.value); // Reset to the first grade or undefined for daihoc
  }, [selectedLevel]);
  
  // Effect to update available SUBJECTS and reset subject selection when LEVEL or GRADE changes
  useEffect(() => {
    let newSubjects: Subject[] = [];
    if (selectedLevel === 'daihoc') {
      newSubjects = subjectMap.daihoc;
    } else if (selectedGrade) {
      newSubjects = subjectMap[selectedLevel].filter(s => s.grades.includes(selectedGrade));
    }
    setSubjects(newSubjects);
  
    // Set default subject if the current one is not available or not set
    const currentSubjectIsValid = newSubjects.some(s => s.value === selectedSubject);
    if (!currentSubjectIsValid) {
      setSelectedSubject(newSubjects[0]?.value || '');
    }
  }, [selectedLevel, selectedGrade, selectedSubject]);


  const groupedHistory = useMemo(() => {
    return history.reduce((acc, conv) => {
      const subjectList = subjectMap[conv.level] || [];
      const subjectLabel = subjectList.find(s => s.value === conv.subject)?.label || 'Không xác định';
      if (!acc[subjectLabel]) {
        acc[subjectLabel] = [];
      }
      acc[subjectLabel].push(conv);
      return acc;
    }, {} as Record<string, Conversation[]>);
  }, [history]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setDocumentContent(content);
        setDocumentName(file.name);
        clearChat(); // Clear chat when new document is loaded
        toast({
          title: "Tài liệu đã được tải lên",
          description: `Bây giờ bạn có thể hỏi về nội dung của "${file.name}".`,
        });
      };
      reader.readAsText(file);
    }
     // Reset file input to allow re-uploading the same file
     e.target.value = '';
  };

  const handleClearDocument = () => {
    clearDocumentWithoutToast();
    toast({
      title: "Đã bỏ tài liệu",
      description: "Cuộc trò chuyện đã quay lại chế độ bình thường.",
    });
  };

  const handleNewChat = () => {
    clearChat();
    clearDocumentWithoutToast();
  };

  const handleHistoryClick = (conversation: Conversation) => {
    const newMessages: Message[] = [
      {
        id: `${conversation.id}-user`,
        role: 'user',
        content: conversation.question,
      },
      {
        id: `${conversation.id}-assistant`,
        role: 'assistant',
        content: conversation.answer,
      },
    ];
    setChatMessages(newMessages);
    setSelectedLevel(conversation.level);
    // This will trigger the useEffects to update grade and subject accordingly
    setSelectedGrade(conversation.grade); 
    setSelectedSubject(conversation.subject);
    clearDocumentWithoutToast();
  };

  const handleQuestionSubmit = useCallback(
    async (question: string) => {
      if (isLoading) return;

      setIsLoading(true);
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: question,
      };
      setChatMessages((prev) => [...prev, userMessage]);

      const res = await getTutorResponse(selectedLevel, selectedGrade, selectedSubject, question, documentContent);
      setIsLoading(false);

      if (res.success && res.content) {
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: res.content,
        };
        setChatMessages((prev) => [...prev, assistantMessage]);
        
        // Only save to history if not in document Q&A mode
        if(!documentContent) {
          const newConversation: Conversation = {
            id: `conv-${Date.now()}`,
            level: selectedLevel,
            grade: selectedGrade,
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

  const handleGenerateQuiz = useCallback(
    async (topic: string) => {
      const currentSubjectInfo = subjects.find(s => s.value === selectedSubject);
      // Use the subject label as the topic for quiz generation for better consistency
      const quizGenerationTopic = currentSubjectInfo?.label || 'chủ đề hiện tại';

      setIsGeneratingQuiz(true);
      setIsQuizDialogOpen(true);
      setQuizData(null);
      setQuizTopic(quizGenerationTopic);

      const res = await getQuiz(selectedLevel, selectedGrade, selectedSubject, quizGenerationTopic);
      setIsGeneratingQuiz(false);

      if (res.success && res.data) {
        setQuizData(res.data);
      } else {
        toast({
          variant: 'destructive',
          title: 'Lỗi',
          description: res.error,
        });
        setIsQuizDialogOpen(false); // Close dialog on error
      }
    },
    [selectedLevel, selectedGrade, selectedSubject, toast, subjects]
  );


  const currentSubject = useMemo(() => {
    return subjects.find((s) => s.value === selectedSubject);
  }, [subjects, selectedSubject]);


  return (
    <SidebarProvider>
      <Sidebar>
        <AppSidebar
          levels={educationLevels}
          selectedLevel={selectedLevel}
          onLevelChange={level => {
            if(level === selectedLevel) return;
            setSelectedLevel(level);
            clearChat();
            clearDocumentWithoutToast();
          }}
          grades={grades}
          selectedGrade={selectedGrade}
          onGradeChange={grade => {
            if(grade === selectedGrade) return;
            setSelectedGrade(grade);
            clearChat();
            clearDocumentWithoutToast();
          }}
          subjects={subjects}
          selectedSubject={selectedSubject}
          onSubjectChange={subject => {
            if(subject === selectedSubject) return;
            setSelectedSubject(subject);
            clearChat();
            clearDocumentWithoutToast();
          }}
          history={history}
          groupedHistory={groupedHistory}
          onHistoryClick={handleHistoryClick}
          onNewChat={handleNewChat}
        />
      </Sidebar>
      <SidebarInset>
       {currentSubject ? (
          <ChatView
            key={`${selectedLevel}-${selectedGrade}-${selectedSubject}`}
            messages={chatMessages}
            isLoading={isLoading}
            selectedSubject={currentSubject}
            documentName={documentName}
            onSubmit={handleQuestionSubmit}
            onSuggestQuestions={handleSuggestQuestions}
            onGenerateQuiz={handleGenerateQuiz}
            onFileChange={handleFileChange}
            onClearDocument={handleClearDocument}
          />
        ) : (
            <div className="flex h-full items-center justify-center p-4 text-center">
                <div className="bg-card p-6 rounded-lg shadow-sm">
                    <p className="text-muted-foreground">Vui lòng chọn Cấp học và Lớp học để xem các môn học có sẵn.</p>
                </div>
            </div>
        )}
      </SidebarInset>
      <QuizDialog
        isOpen={isQuizDialogOpen}
        onOpenChange={setIsQuizDialogOpen}
        quizData={quizData}
        isLoading={isGeneratingQuiz}
        subject={currentSubject}
        topic={quizTopic}
      />
    </SidebarProvider>
  );
}

    