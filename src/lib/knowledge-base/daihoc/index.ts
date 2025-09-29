// src/lib/knowledge-base/daihoc/index.ts
import { math } from './math';
import { literature } from './literature';
import { history } from './history';
import { geography } from './geography';
import { english } from './english';
import { physics } from './physics';
import { chemistry } from './chemistry';
import { biology } from './biology';
import { philosophy } from './philosophy';
import { politicalEconomy } from './political-economy';
import { scientificSocialism } from './scientific-socialism';
import { partyHistory } from './party-history';


export const knowledgeBase = {
    math,
    physics,
    chemistry,
    biology,
    literature,
    history,
    geography,
    english,
    philosophy,
    'political-economy': politicalEconomy,
    'scientific-socialism': scientificSocialism,
    'party-history': partyHistory
};
