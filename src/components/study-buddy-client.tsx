
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
import type { Conversation, Message, Subject, EducationLevel, QuizData } from '@/lib/types';
import { getQuestionSuggestions, getTutorResponse, getQuiz } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import AppSidebar from '@/components/app-sidebar';
import ChatView from '@/components/chat-view';
import QuizDialog from './quiz-dialog';

const thcsSubjects: Subject[] = [
  { value: 'math', label: 'Toán học', icon: Calculator },
  { value: 'physics', label: 'Vật lí', icon: FlaskConical },
  { value: 'chemistry', label: 'Hóa học', icon: Beaker },
  { value: 'biology', label: 'Sinh học', icon: Dna },
  { value: 'literature', label: 'Ngữ văn', icon: BookOpen },
  { value: 'history', label: 'Lịch sử', icon: Landmark },
  { value: 'geography', label: 'Địa lí', icon: Globe },
  { value: 'civics', label: 'GDCD', icon: Scale },
  { value: 'english', label: 'Ngoại ngữ', icon: Languages },
];

const thptSubjects: Subject[] = [
    { value: 'math', label: 'Toán học', icon: Calculator },
    { value: 'physics', label: 'Vật lí', icon: FlaskConical },
    { value: 'chemistry', label: 'Hóa học', icon: Beaker },
    { value: 'biology', label: 'Sinh học', icon: Dna },
    { value: 'literature', label: 'Ngữ văn', icon: BookOpen },
    { value: 'history', label: 'Lịch sử', icon: Landmark },
    { value: 'geography', label: 'Địa lí', icon: Globe },
    { value: 'civics', label: 'GDCD/Kinh tế & PL', icon: Scale },
    { value: 'english', label: 'Ngoại ngữ', icon: Languages },
];
  
const daihocSubjects: Subject[] = [
    { value: 'math', label: 'Toán cao cấp', icon: Sigma },
    { value: 'physics', label: 'Vật lí đại cương', icon: Atom },
    { value: 'chemistry', label: 'Hóa học đại cương', icon: Beaker },
    { value: 'biology', label: 'Sinh học đại cương', icon: Dna },
    { value: 'philosophy', label: 'Triết học Mác-Lênin', icon: BookCopy },
    { value: 'political-economy', label: 'Kinh tế chính trị Mác-Lênin', icon: BookCopy },
    { value: 'scientific-socialism', label: 'Chủ nghĩa xã hội khoa học', icon: BookCopy },
    { value: 'party-history', label: 'Lịch sử Đảng Cộng sản Việt Nam', icon: BookCopy },
    { value: 'english', label: 'Tiếng Anh học thuật', icon: Languages },
];


const educationLevels: { value: EducationLevel, label: string }[] = [
    { value: 'thcs', label: 'Trung học cơ sở (6-9)'},
    { value: 'thpt', label: 'Trung học phổ thông (10-12)'},
    { value: 'daihoc', label: 'Đại học'},
]

const subjectMap: Record<EducationLevel, Subject[]> = {
    thcs: thcsSubjects,
    thpt: thptSubjects,
    daihoc: daihocSubjects,
};


export default function StudyBuddyClient() {
  const [selectedLevel, setSelectedLevel] = useState<EducationLevel>('thpt');
  const [subjects, setSubjects] = useState<Subject[]>(subjectMap[selectedLevel]);
  const [selectedSubject, setSelectedSubject] = useState<string>(
    subjects[0].value
  );
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

  const clearDocumentWithoutToast = () => {
    setDocumentContent(null);
    setDocumentName(null);
  }

  useEffect(() => {
    const newSubjects = subjectMap[selectedLevel];
    setSubjects(newSubjects);
    setSelectedSubject(newSubjects[0].value);
    clearDocumentWithoutToast();
    handleNewChat();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLevel]);

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
        setChatMessages([]); // Clear chat when new document is loaded
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
    setChatMessages([]);
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
    setSelectedSubject(conversation.subject);
    setDocumentContent(null);
    setDocumentName(null);
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

      const res = await getTutorResponse(selectedLevel, selectedSubject, question, documentContent);
      setIsLoading(false);

      if (res.success && res.explanation) {
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: res.explanation,
        };
        setChatMessages((prev) => [...prev, assistantMessage]);
        
        // Only save to history if not in document Q&A mode
        if(!documentContent) {
          const newConversation: Conversation = {
            id: `conv-${Date.now()}`,
            level: selectedLevel,
            subject: selectedSubject,
            question,
            answer: res.explanation,
          };
          setHistory((prev) => [newConversation, ...prev]);
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Lỗi',
          description: res.error,
        });
        setChatMessages((prev) => prev.slice(0, -1));
      }
    },
    [isLoading, selectedLevel, selectedSubject, toast, documentContent]
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
      const currentSubject = subjects.find(s => s.value === selectedSubject);
      const currentSubjectLabel = currentSubject?.label || 'chủ đề hiện tại';
      const quizGenerationTopic = topic || currentSubjectLabel;

      setIsGeneratingQuiz(true);
      setIsQuizDialogOpen(true);
      setQuizData(null);
      setQuizTopic(quizGenerationTopic);

      const res = await getQuiz(selectedLevel, selectedSubject, quizGenerationTopic);
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
    [selectedLevel, selectedSubject, toast, subjects]
  );


  return (
    <SidebarProvider>
      <Sidebar>
        <AppSidebar
          levels={educationLevels}
          selectedLevel={selectedLevel}
          onLevelChange={level => {
            setSelectedLevel(level);
          }}
          subjects={subjects}
          selectedSubject={selectedSubject}
          onSubjectChange={subject => {
            setSelectedSubject(subject);
            clearDocumentWithoutToast();
            handleNewChat();
          }}
          history={history}
          groupedHistory={groupedHistory}
          onHistoryClick={handleHistoryClick}
          onNewChat={() => {
            handleNewChat();
            clearDocumentWithoutToast();
          }}
        />
      </Sidebar>
      <SidebarInset>
        <ChatView
          messages={chatMessages}
          isLoading={isLoading}
          selectedSubject={
            subjects.find((s) => s.value === selectedSubject) || subjects[0]
          }
          documentName={documentName}
          onSubmit={handleQuestionSubmit}
          onSuggestQuestions={handleSuggestQuestions}
          onGenerateQuiz={handleGenerateQuiz}
          onFileChange={handleFileChange}
          onClearDocument={handleClearDocument}
        />
      </SidebarInset>
      <QuizDialog
        isOpen={isQuizDialogOpen}
        onOpenChange={setIsQuizDialogOpen}
        quizData={quizData}
        isLoading={isGeneratingQuiz}
        subject={subjects.find((s) => s.value === selectedSubject) || subjects[0]}
        topic={quizTopic}
      />
    </SidebarProvider>
  );
}
