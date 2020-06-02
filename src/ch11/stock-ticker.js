import {
	createTrace,
	pipe,
	zip,
	curry,
	unboundMethod,
	uncurry,
	spreadArgs,
	map,
	partial,
	partialRight,
	unary,
} from './tools.js';

import {
	newStocks,
	stockUpdates,
} from './stock-ticker-events.js';

import {
	addStock,
	updateStock,
} from './stock-ticker-ui.js';

const sources = [newStocks, stockUpdates];
const uiHandlers = map(unary(partialRight(partial, 'stock-ticker')), [addStock, updateStock]);
const subscribeHandlers = pipe(unboundMethod, uncurry, spreadArgs)('subscribe');

const subscribe = pipe(
	curry(zip)(uiHandlers),
	curry(map)(subscribeHandlers)
);

subscribe(sources);