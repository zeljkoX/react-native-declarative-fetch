/**
 * Query Context creation
 */

import { createContext } from 'react';

const QueryContext = createContext();

export const QueryConsumer = QueryContext.Consumer;
export const QueryProvider = QueryContext.Provider;
