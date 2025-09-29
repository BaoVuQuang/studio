'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, LoaderCircle, Send, Lightbulb, User, Paperclip, X, Info } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { BlockMath, InlineMath } from 'react-katex';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import type { Message, Subject } from '@/lib/types';
import { cn } from '@/lib/utils';


interface ChatViewProps {
  messages: Message[];
  isLoading: boolean;
  selectedSubject: Subject;
  documentName: string | null;
  onSubmit: (question: string) => Promise<void>;
  onSuggestQuestions: (messageId: string, question: string) => Promise<void>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearDocument: () => void;
}

export default function ChatView({
  messages,
  isLoading,
  selectedSubject,
  documentName,
  onSubmit,
  onSuggestQuestions,
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
  
  const handleSuggestionClick = (suggestedQuestion: string) => {
    onSubmit(suggestedQuestion);
  };

  const getLastUserQuestion = useCallback((assistantMessageId: string) => {
    const assistantMessageIndex = messages.findIndex(m => m.id === assistantMessageId);
    if (assistantMessageIndex === -1) return '';

    // Find the last user message before this assistant message
    for (let i = assistantMessageIndex - 1; i >= 0; i--) {
        if (messages[i].role === 'user') {
            return messages[i].content;
        }
    }
    return '';
  }, [messages]);


  return (
    <Card className="flex flex-col h-full border-l rounded-none">
       <CardHeader className="p-4 border-b">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Bot className="h-5 w-5"/>
            Trợ lý AI
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Info className="h-4 w-4 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Hỏi đáp về chủ đề đang học hoặc tải lên tài liệu (.txt, .md) để hỏi về nội dung riêng.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        {messages.length === 0 && !isLoading ? (
          <div className="flex h-full items-center justify-center p-4">
             <div className="text-center text-sm text-muted-foreground">
              <p>Bắt đầu cuộc trò chuyện bằng cách đặt câu hỏi về "{selectedSubject.label}" ở bên dưới.</p>
            </div>
          </div>
        ) : (
          <ScrollArea className="h-full" ref={scrollAreaRef}>
            <div className="p-4 space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex items-start gap-3',
                    message.role === 'user' && 'justify-end'
                  )}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="h-8 w-8 border">
                      <AvatarFallback>
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'max-w-sm rounded-lg px-3 py-2 prose dark:prose-invert text-sm',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground prose-p:text-primary-foreground'
                        : 'bg-card border'
                    )}
                  >
                     <ReactMarkdown 
                      remarkPlugins={[remarkGfm, remarkMath]}
                      components={{
                        p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal list-inside" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc list-inside" {...props} />,
                        math: ({value}) => <BlockMath math={value} />,
                        inlineMath: ({value}) => <InlineMath math={value} />,
                      }}
                     >
                        {message.content}
                    </ReactMarkdown>
                    {message.role === 'assistant' && (
                      <div className="mt-2 not-prose">
                        {message.suggestedQuestions && message.suggestedQuestions.length > 0 && (
                            <div>
                                <Separator className="my-2" />
                                <h4 className="font-semibold text-xs mb-2 text-card-foreground">
                                Câu hỏi gợi ý:
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                {message.suggestedQuestions.map((q, i) => (
                                    <Button key={i} size="xs" variant="outline" onClick={() => handleSuggestionClick(q)} disabled={isLoading}>
                                      {q}
                                    </Button>
                                ))}
                                </div>
                            </div>
                        )}
                        {!message.suggestedQuestions && (
                            <Button
                                variant="ghost"
                                size="xs"
                                className="text-muted-foreground hover:text-accent-foreground px-1 h-auto py-1"
                                onClick={() =>
                                  onSuggestQuestions(
                                      message.id,
                                      getLastUserQuestion(message.id)
                                  )
                                }
                                disabled={message.isSuggestingQuestions}
                            >
                                {message.isSuggestingQuestions ? (
                                <LoaderCircle className="mr-1 h-3 w-3 animate-spin" />
                                ) : (
                                <Lightbulb className="mr-1 h-3 w-3" />
                                )}
                                Gợi ý
                            </Button>
                          )}
                      </div>
                    )}
                  </div>
                  {message.role === 'user' && (
                    <Avatar className="h-8 w-8 border">
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8 border">
                    <AvatarFallback>
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="max-w-sm rounded-lg px-3 py-2 bg-card border">
                    <div className="flex items-center space-x-2 text-sm">
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      <p>Đang suy nghĩ...</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </CardContent>
      <CardFooter className="p-2 border-t">
        <div className="relative w-full">
          {documentName && (
            <div className="text-xs px-2 py-1 mb-1.5 bg-secondary rounded-full flex items-center justify-between max-w-[calc(100%-1rem)]">
              <span className="truncate">Hỏi về: <strong>{documentName}</strong></span>
              <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full" onClick={onClearDocument}>
                <X className="h-3 w-3"/>
                <span className="sr-only">Bỏ tài liệu</span>
              </Button>
            </div>
          )}
          <form
            onSubmit={handleFormSubmit}
            className="relative"
          >
            <Textarea
              placeholder={`Hỏi AI về ${selectedSubject.label}...`}
              className="w-full pr-20 min-h-[40px] resize-none text-sm"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleFormSubmit(e as any);
                }
              }}
              disabled={isLoading}
              rows={1}
            />
             <input
              type="file"
              ref={fileInputRef}
              onChange={onFileChange}
              className="hidden"
              accept=".txt,.md"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
               <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
                      <Paperclip className="h-4 w-4"/>
                      <span className="sr-only">Áp tài liệu</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Tải tài liệu</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Button
                type="submit"
                size="icon"
                className="h-8 w-8"
                disabled={isLoading || !question.trim()}
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Gửi</span>
              </Button>
            </div>
          </form>
        </div>
      </CardFooter>
    </Card>
  );
}
