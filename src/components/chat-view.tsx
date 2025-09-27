
'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, LoaderCircle, Send, Sparkles, User, Paperclip, X } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import type { Message, Subject } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';

interface ChatViewProps {
  messages: Message[];
  isLoading: boolean;
  selectedSubject: Subject;
  documentName: string | null;
  onSubmit: (question: string) => Promise<void>;
  onSuggestResources: (messageId: string, question: string) => Promise<void>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearDocument: () => void;
}

export default function ChatView({
  messages,
  isLoading,
  selectedSubject,
  documentName,
  onSubmit,
  onSuggestResources,
  onFileChange,
  onClearDocument,
}: ChatViewProps) {
  const [question, setQuestion] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (question.trim()) {
      onSubmit(question);
      setQuestion('');
    }
  };

  const getLastUserQuestion = () => {
    const userMessages = messages.filter((msg) => msg.role === 'user');
    return userMessages[userMessages.length - 1]?.content;
  };

  const WelcomeScreen = () => (
    <div className="flex h-full items-center justify-center">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
            <selectedSubject.icon className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="font-headline">
            Gia sư {selectedSubject.label}
          </CardTitle>
          <CardDescription>
            Hỏi tôi bất cứ điều gì về {selectedSubject.label}. Bạn cũng có thể áp tài liệu (.txt, .md) để hỏi đáp riêng về nội dung đó.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );

  return (
    <div className="flex flex-col h-full max-h-screen">
      <header className="flex items-center justify-center p-4 border-b">
        <div className="flex items-center gap-2">
          <selectedSubject.icon className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">{selectedSubject.label}</h2>
        </div>
      </header>
      <div className="flex-1 overflow-hidden">
        {messages.length === 0 && !isLoading ? (
          <WelcomeScreen />
        ) : (
          <ScrollArea className="h-full" ref={scrollAreaRef}>
            <div className="p-4 md:p-6 space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex items-start gap-4',
                    message.role === 'user' && 'justify-end'
                  )}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="h-9 w-9 border">
                      <AvatarFallback>
                        <Bot className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'max-w-xl rounded-lg p-4',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card border'
                    )}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    {message.role === 'assistant' && (
                      <div className="mt-4">
                        {message.resources ? (
                          <div>
                            <Separator className="my-2" />
                            <h4 className="font-semibold text-sm mb-2">
                              Tài nguyên được đề xuất:
                            </h4>
                            <ul className="space-y-1 text-sm list-disc pl-4">
                              {message.resources.map((res, i) => (
                                <li key={i}>
                                  <a
                                    href={res}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-accent underline hover:no-underline"
                                  >
                                    {res}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-accent hover:text-accent"
                            onClick={() =>
                              onSuggestResources(
                                message.id,
                                getLastUserQuestion()
                              )
                            }
                            disabled={message.isSuggestingResources}
                          >
                            {message.isSuggestingResources ? (
                              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Sparkles className="mr-2 h-4 w-4" />
                            )}
                            Gợi ý tài nguyên
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                  {message.role === 'user' && (
                    <Avatar className="h-9 w-9 border">
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-4">
                  <Avatar className="h-9 w-9 border">
                    <AvatarFallback>
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="max-w-xl rounded-lg p-4 bg-card border">
                    <div className="flex items-center space-x-2">
                      <LoaderCircle className="h-5 w-5 animate-spin" />
                      <p>Đang suy nghĩ...</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </div>
      <div className="p-4 border-t bg-background/80 backdrop-blur-sm">
        <div className="relative max-w-3xl mx-auto">
          {documentName && (
            <div className="text-sm px-3 py-1 mb-2 bg-secondary rounded-full flex items-center justify-between max-w-sm">
              <span className="truncate">Đang hỏi đáp về: <strong>{documentName}</strong></span>
              <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={onClearDocument}>
                <X className="h-4 w-4"/>
                <span className="sr-only">Bỏ tài liệu</span>
              </Button>
            </div>
          )}
          <form
            onSubmit={handleFormSubmit}
            className="relative"
          >
            <Textarea
              placeholder={`Đặt câu hỏi về ${selectedSubject.label}...`}
              className="w-full pr-24 min-h-[48px] resize-none"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleFormSubmit(e as any);
                }
              }}
              disabled={isLoading}
            />
             <input
              type="file"
              ref={fileInputRef}
              onChange={onFileChange}
              className="hidden"
              accept=".txt,.md"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
              <Button type="button" variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
                <Paperclip className="h-4 w-4"/>
                <span className="sr-only">Áp tài liệu</span>
              </Button>
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !question.trim()}
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Gửi</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
