import QuickLRU from 'quick-lru';

import { LOGGER } from './logger.js';
import { AccountsCache, CachedAccount } from '../schemas/aminodorks.js';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { CACHE_FILENAME } from '../constants.js';

export let QUICKLRU: QuickLRU<string, CachedAccount>;

const loadFromFile = (): AccountsCache => {
    return JSON.parse(readFileSync(CACHE_FILENAME, 'utf-8'));
};

const cacheSave = () => {
    const cacheToSave: Record<string, CachedAccount> = {};

    for (const [key, value] of QUICKLRU.entries()) {
        cacheToSave[key] = value;
        writeFileSync(CACHE_FILENAME, JSON.stringify(cacheToSave));
    };
};

export const cacheSet = (key: string, value: CachedAccount) => {
    QUICKLRU.set(key, value);
    cacheSave();
};

export const cacheDelete = (key: string) => {
    QUICKLRU.delete(key);
    cacheSave();
};

export const initQuickLRU = (maxAge = Infinity, maxSize = 1000) => {
    if (QUICKLRU) return QUICKLRU;

    QUICKLRU = new QuickLRU({
        maxSize,
        maxAge,
        onEviction: (key, value) => LOGGER.info({ key, value }, 'LRU eviction.')
    })

    if (existsSync('cache.json')) {
        const accountsCache = loadFromFile();
        for (const [key, value] of Object.entries(accountsCache)) {
            QUICKLRU.set(key, value);
        };
    };

    return QUICKLRU;
};

export default initQuickLRU;
