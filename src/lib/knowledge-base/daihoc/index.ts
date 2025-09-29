// src/lib/knowledge-base/daihoc/index.ts
import { math } from './math';
import { literature } from './literature';
import { history } from './history';
import { geography } from './geography';
import { english } from './english';
import { physics } from './physics';
import { chemistry } from './chemistry';
import { biology } from './biology';
import { civics } from './civics';


export const knowledgeBase = {
    math,
    physics,
    chemistry,
    biology,
    literature,
    history,
    geography,
    english,
    philosophy: civics, // All political theory subjects point to the same knowledge base
};
