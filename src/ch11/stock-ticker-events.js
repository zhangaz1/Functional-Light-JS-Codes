import {
	map,
	pipe,
	curry,
	unboundMethod,
	uncurry,
	zip,
	partial,
	partialRight,
	spreadArgProps,
	spreadArgs,
	createTrace,
	unary,
	setProp,
	reduce,
} from './tools.js';

import { connectToServer } from './mock-server.js';

const trace = createTrace('stock-ticker-events:');

const formatDecimal = unboundMethod('toFixed')(2);
const formatPrice = pipe(formatDecimal, formatCurrency);
const formatChange = pipe(formatDecimal, formatSign);

const server = connectToServer();
const stockEventNames = ['stock', 'stock-update'];
const makeObservableFromEvent = curry(rxjs.fromEvent, 2)(server);

const processNewStock = pipe(
	// unary(trace),
	setStockName,
	formatStockNumbers,
);

export const [newStocks, stockUpdates] = pipe(
	curry(map)(unary(makeObservableFromEvent)),
	curry(zip)([processNewStock, formatStockNumbers]),
	curry(map)(pipe(uncurry, spreadArgs, unary)(rxjs.operators.map))
)(stockEventNames);

function setStockName(stock) {
	return setProp('name', stock, stock.id);
}

function formatStockNumbers(stock) {
	const stockDataUpdates = [
		['price', formatPrice(stock.price)],
		['change', formatChange(stock.change)],
	];

	return curry(reduce)(function formatter(stock, [propName, val]) {
		return setProp(propName, stock, val);
	})(stock)(stockDataUpdates);
}

function formatCurrency(val) {
	return `$${val}`;
}

function formatSign(val) {
	return `${val > 0 ? '+' : ''}${val}`
}