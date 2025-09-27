// src/lib/knowledge-base/thpt/index.ts
import { math } from './math';
import { science } from './science';
import { history } from './history';
import { literature } from './literature';
import { computerScience } from './computer-science';


export const knowledgeBase = {
    math,
    science,
    history,
    literature,
    'computer-science': computerScience
};
