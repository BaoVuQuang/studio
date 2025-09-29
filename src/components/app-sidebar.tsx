
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
import type { Conversation, Subject, EducationLevel, Grade } from '@/lib/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

interface AppSidebarProps {
  levels: { value: EducationLevel, label: string }[];
  selectedLevel: EducationLevel;
  onLevelChange: (level: EducationLevel) => void;
  grades: Grade[];
  selectedGrade?: string;
  onGradeChange: (grade: string) => void;
  subjects: Subject[];
  selectedSubject: string;
  onSubjectChange: (subject: string) => void;
  history: Conversation[];
  groupedHistory: Record<string, Conversation[]>;
  onHistoryClick: (conversation: Conversation) => void;
  onNewChat: () => void;
}

export default function AppSidebar({
  levels,
  selectedLevel,
  onLevelChange,
  grades,
  selectedGrade,
  onGradeChange,
  subjects,
  selectedSubject,
  onSubjectChange,
  history,
  groupedHistory,
  onHistoryClick,
  onNewChat,
}: AppSidebarProps) {
  const getGradeLabel = (level: EducationLevel, gradeValue?: string) => {
    if (level === 'daihoc') return 'Đại học';
    if (!gradeValue) return '';
    return `Lớp ${gradeValue}`;
  }

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
            <p className="text-sm text-muted-foreground">Trợ lý học tập của bạn</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
            <SidebarGroupLabel>Cấp học</SidebarGroupLabel>
            <RadioGroup value={selectedLevel} onValueChange={onLevelChange as (value: string) => void} className="mt-2 space-y-2">
                {levels.map(level => (
                    <div key={level.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={level.value} id={`level-${level.value}`} />
                        <Label htmlFor={`level-${level.value}`} className="font-normal">{level.label}</Label>
                    </div>
                ))}
            </RadioGroup>
        </SidebarGroup>
        <SidebarSeparator/>
        {grades.length > 0 && (
          <>
            <SidebarGroup>
                <SidebarGroupLabel>Lớp học</SidebarGroupLabel>
                <RadioGroup value={selectedGrade} onValueChange={onGradeChange} className="mt-2 grid grid-cols-2 gap-2">
                    {grades.map(grade => (
                        <div key={grade.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={grade.value} id={`grade-${grade.value}`} />
                            <Label htmlFor={`grade-${grade.value}`} className="font-normal">{grade.label}</Label>
                        </div>
                    ))}
                </RadioGroup>
            </SidebarGroup>
            <SidebarSeparator/>
          </>
        )}
        <SidebarGroup>
          <SidebarGroupLabel>Môn học</SidebarGroupLabel>
          <Select value={selectedSubject} onValueChange={onSubjectChange} disabled={selectedLevel !== 'daihoc' && !selectedGrade}>
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder="Chọn một môn học" />
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
            <SidebarGroupLabel>Lịch sử</SidebarGroupLabel>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={onNewChat}
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">Trò chuyện mới</span>
            </Button>
          </div>
          <SidebarMenu>
            {history.length > 0 ? (
              <Accordion type="multiple" className="w-full">
                {Object.entries(groupedHistory).map(([subjectLabel, convs]) => (
                  <AccordionItem value={subjectLabel} key={subjectLabel}>
                    <AccordionTrigger className="text-sm font-medium hover:no-underline py-2">
                      {subjectLabel}
                    </AccordionTrigger>
                    <AccordionContent>
                      <SidebarMenu className="pl-2 border-l">
                      {convs.map((conv) => (
                        <SidebarMenuItem key={conv.id}>
                          <SidebarMenuButton
                            onClick={() => onHistoryClick(conv)}
                            className="h-auto py-2"
                          >
                            <div className="flex flex-col gap-1 items-start w-full">
                              <span className="text-xs text-muted-foreground">
                                {levels.find(l => l.value === conv.level)?.label} - {getGradeLabel(conv.level, conv.grade)}
                              </span>
                              <span className="block truncate w-full text-wrap text-sm">
                                {conv.question}
                              </span>
                            </div>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                      </SidebarMenu>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="p-2 text-sm text-muted-foreground">
                Chưa có lịch sử. Bắt đầu một cuộc trò chuyện mới!
              </div>
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </>
  );
}

    