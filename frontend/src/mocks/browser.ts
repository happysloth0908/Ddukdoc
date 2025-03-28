import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';
import { mypageHandlers } from './mypageHandlers';
import { forgeryHandlers } from './fogery.handlers';

const allHandlers = [...handlers, ...mypageHandlers, ...forgeryHandlers];

export const worker = setupWorker(...allHandlers);
