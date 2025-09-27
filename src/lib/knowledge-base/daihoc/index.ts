// src/lib/knowledge-base/daihoc/index.ts
import { math } from './math';
import { literature } from './literature';
import { history } from './history';
import { geography } from './geography';
import { civics } from './civics';
import { english } from './english';
import { physics } from './physics';
import { chemistry } from './chemistry';
import { biology } from './biology';


export const knowledgeBase = {
    math,
    physics,
    chemistry,
    biology,
    literature,
    history,
    geography,
    'civics': civics,
    'english': english
};
