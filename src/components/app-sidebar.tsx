
'use client';

import { BrainCircuit, Plus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import type { Conversation, Subject } from '@/lib/types';

interface AppSidebarProps {
  subjects: Subject[];
  selectedSubject: string;
  onSubjectChange: (subject: string) => void;
  history: Conversation[];
  onHistoryClick: (conversation: Conversation) => void;
  onNewChat: () => void;
}

export default function AppSidebar({
  subjects,
  selectedSubject,
  onSubjectChange,
  history,
  onHistoryClick,
  onNewChat,
}: AppSidebarProps) {
  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <BrainCircuit className="h-6 w-6 text-primary" />
          </Button>
          <div className="flex flex-col">
            <h2 className="font-headline text-lg font-semibold tracking-tight">
              StudyBuddy AI
            </h2>
            <p className="text-sm text-muted-foreground">Your Learning Assistant</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Subject</SidebarGroupLabel>
          <Select value={selectedSubject} onValueChange={onSubjectChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subject) => (
                <SelectItem key={subject.value} value={subject.value}>
                  <div className="flex items-center gap-2">
                    <subject.icon className="h-4 w-4" />
                    <span>{subject.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <div className="flex items-center justify-between">
            <SidebarGroupLabel>History</SidebarGroupLabel>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={onNewChat}
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">New Chat</span>
            </Button>
          </div>
          <SidebarMenu>
            {history.length > 0 ? (
              history.map((conv) => (
                <SidebarMenuItem key={conv.id}>
                  <SidebarMenuButton
                    onClick={() => onHistoryClick(conv)}
                    className="h-auto py-2"
                  >
                    <div className="flex flex-col gap-1 items-start w-full">
                      <span className="text-xs text-muted-foreground">
                        {
                          subjects.find((s) => s.value === conv.subject)
                            ?.label
                        }
                      </span>
                      <span className="block truncate w-full text-wrap text-sm">
                        {conv.question}
                      </span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))
            ) : (
              <div className="p-2 text-sm text-muted-foreground">
                No history yet. Start a new conversation!
              </div>
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </>
  );
}
