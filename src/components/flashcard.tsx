// src/components/flashcard.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { RefreshCcw } from 'lucide-react';
import { Button } from './ui/button';

interface FlashcardProps {
  question: string;
  answer: string;
}

export default function Flashcard({ question, answer }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="group h-64 w-full [perspective:1000px]"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <Card
        className={cn(
          'relative h-full w-full cursor-pointer rounded-xl shadow-md transition-transform duration-500 [transform-style:preserve-3d]',
          isFlipped && '[transform:rotateY(180deg)]'
        )}
      >
        {/* Front of the card */}
        <div className="absolute flex h-full w-full flex-col items-center justify-center p-6 [backface-visibility:hidden]">
          <p className="text-center font-semibold text-lg">{question}</p>
          <div className="absolute bottom-4 right-4 flex items-center gap-2 text-sm text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
            <RefreshCcw className="h-4 w-4" />
            <span>Lật thẻ</span>
          </div>
        </div>

        {/* Back of the card */}
        <div className="absolute flex h-full w-full flex-col items-center justify-center bg-secondary p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <p className="text-center">{answer}</p>
           <div className="absolute bottom-4 right-4 flex items-center gap-2 text-sm text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
            <RefreshCcw className="h-4 w-4" />
            <span>Lật thẻ</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
