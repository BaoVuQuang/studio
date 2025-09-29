'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-questions.ts';
import '@/ai/flows/provide-personalized-tutoring.ts';
import '@/ai/flows/generate-quiz.ts';
