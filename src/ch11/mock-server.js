import { partial } from './tools.js';

export function connectToServer() {
	start();
	return evtEmitter;
}

const evtEmitter = {
	handlers: {},
	on(evtName, cb) {
		this.handlers[evtName] = this.handlers[evtName] || [];
		this.handlers[evtName].push(cb);
	},
	addEventListener(...args) {
		this.on(...args);
	},
	removeEventListener() { },
	emit(evtName, ...args) {
		for (let handler of this.handlers[evtName] || []) {
			handler(...args);
		}
	}
};

const stocks = {
	'APPL': { price: 121.95, change: 0.01 },
	'MSFT': { price: 65.78, change: 1.51 },
	'GOOG': { price: 821.31, change: -8.84 },
};

function start() {
	traceEmitter();
	setTimeout(initialStocks, 100);
}

function initialStocks() {
	for (let id in stocks) {
		const stock = Object.assign({ id }, stocks[id]);
		evtEmitter.emit('stock', stock);
	}

	setTimeout(randomStockUpdate, 1000);
}

function randomStockUpdate() {
	const stockIds = Object.keys(stocks);
	const stockIdx = randInRange(0, stockIds.length);
	const stockId = stockIds[stockIdx];
	const change = (randInRange(1, 10) > 7 ? -1 : 1) * (randInRange(1, 10) / 1E2);

	const newStock = Object.assign({}, stocks[stockId]);
	newStock.price += change;
	newStock.change = change;

	stocks[stockId] = newStock;
	evtEmitter.emit('stock-update', Object.assign({ id: stockId }, newStock));

	setTimeout(randomStockUpdate, randInRange(300, 1500));
}

function randInRange(min = 0, max = 1E9) {
	return Math.round(Math.random() * 1E4) % (max - min) + min;
}

function traceEmitter() {
	const log = partial(console.log.bind(console), 'mock-server:');
	['stock', 'stock-update'].forEach(evtName => evtEmitter.addEventListener(evtName, log));
}


