
'use client';

import { useState, useCallback } from 'react';
import {
  BookOpen,
  BrainCircuit,
  Calculator,
  Code,
  FlaskConical,
  Landmark,
} from 'lucide-react';

import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from '@/components/ui/sidebar';
import type { Conversation, Message, Subject } from '@/lib/types';
import { getResourceSuggestions, getTutorResponse } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import AppSidebar from '@/components/app-sidebar';
import ChatView from '@/components/chat-view';

const subjects: Subject[] = [
  { value: 'math', label: 'Toán học', icon: Calculator },
  { value: 'science', label: 'Khoa học', icon: FlaskConical },
  { value: 'history', label: 'Lịch sử', icon: Landmark },
  { value: 'literature', label: 'Văn học', icon: BookOpen },
  {
    value: 'computer-science',
    label: 'Khoa học máy tính',
    icon: Code,
  },
];

export default function StudyBuddyClient() {
  const [selectedSubject, setSelectedSubject] = useState<string>(
    subjects[0].value
  );
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [history, setHistory] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
    setSelectedSubject(conversation.subject);
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

      const res = await getTutorResponse(selectedSubject, question);
      setIsLoading(false);

      if (res.success && res.explanation) {
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: res.explanation,
        };
        setChatMessages((prev) => [...prev, assistantMessage]);

        const newConversation: Conversation = {
          id: `conv-${Date.now()}`,
          subject: selectedSubject,
          question,
          answer: res.explanation,
        };
        setHistory((prev) => [newConversation, ...prev]);
      } else {
        toast({
          variant: 'destructive',
          title: 'Lỗi',
          description: res.error,
        });
        setChatMessages((prev) => prev.slice(0, -1));
      }
    },
    [isLoading, selectedSubject, toast]
  );

  const handleSuggestResources = useCallback(
    async (messageId: string, question: string) => {
      setChatMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, isSuggestingResources: true } : msg
        )
      );

      const res = await getResourceSuggestions(selectedSubject, question);

      if (res.success && res.resources) {
        setChatMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? {
                  ...msg,
                  resources: res.resources,
                  isSuggestingResources: false,
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
              ? { ...msg, isSuggestingResources: false }
              : msg
          )
        );
      }
    },
    [selectedSubject, toast]
  );

  return (
    <SidebarProvider>
      <Sidebar>
        <AppSidebar
          subjects={subjects}
          selectedSubject={selectedSubject}
          onSubjectChange={setSelectedSubject}
          history={history}
          onHistoryClick={handleHistoryClick}
          onNewChat={handleNewChat}
        />
      </Sidebar>
      <SidebarInset>
        <ChatView
          messages={chatMessages}
          isLoading={isLoading}
          selectedSubject={
            subjects.find((s) => s.value === selectedSubject) || subjects[0]
          }
          onSubmit={handleQuestionSubmit}
          onSuggestResources={handleSuggestResources}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}
