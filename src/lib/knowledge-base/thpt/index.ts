// src/lib/knowledge-base/thpt/index.ts
import { math } from './math';
import { literature } from './literature';
import { history } from './history';
import { geography } from './geography';
import { civics } from './civics';
import { english } from './english';


export const knowledgeBase = {
    math,
    literature,
    history,
    geography,
    'civics': civics,
    'english': english
};
