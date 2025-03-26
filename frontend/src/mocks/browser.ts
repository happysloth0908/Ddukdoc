import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';
import { mypageHandlers } from './mypageHandlers';

const allHandlers = [...handlers, ...mypageHandlers];

export const worker = setupWorker(...allHandlers);
