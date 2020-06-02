import {
	createTrace,
	curry,
	map,
	unboundMethod,
	partial,
	partialRight,
	spreadArgs,
	pipe,
	zip,
	unary,
	reverseArgs,
	prop,
	compose,
	reduce,
	filterOut,
	uncurry,
	filterIn,
	listify,
	flatMap,
	first,
} from './tools.js';

export {
	addStock,
	updateStock,
};

const trace = createTrace('stock-ticker-ui:');

const each = pipe(unboundMethod, partialRight(curry, 2))('forEach');

const craeteElement = document.createElement.bind(document);
const getElemAttrVal = curry(getElemAttr, 2);
const getClass = getElemAttrVal('class');
const getStockId = getElemAttrVal('data-stock-id');
const getDOMChildren = pipe(
	listify,
	curry(flatMap)(
		pipe(
			unary(curry(prop)('childNodes')),
			Array.from
		)
	)
);

function addStock(containerId, stock) {
	const [stockElem, ...infoChildElems] = curry(map)(craeteElement)(['li', 'span', 'span', 'span']);
	const attrValTuples = [
		[['class', 'stock'], ['data-stock-id', stock.id]],
		[['class', 'stock-name']],
		[['class', 'stock-price']],
		[['class', 'stock-change']],
	];

	const elemsAttrsTuples = zip([stockElem, ...infoChildElems], attrValTuples);

	each(function setElemAttrs([elem, attrValTupleList]) {
		each(unary(spreadArgs(partial(setElemAttr, elem))))(attrValTupleList);
	})(elemsAttrsTuples);

	updateStockElems(infoChildElems, stock);
	curry(reduce)(appendDOMChild)(stockElem)(infoChildElems);
	appendDOMChild(getStockContainer(containerId), stockElem);
}

function getStockContainer(containerId) {
	return document.getElementById(containerId);
}
function setElemAttr(elem, propName, val) {
	return elem.setAttribute(propName, val);
}

function updateStock(containerId, stock) {
	const infoChildElem = pipe(
		getStockContainer,
		getDOMChildren,
		curry(filterIn)(partial(matchingStockId, stock.id)),
		first,
		getDOMChildren
	)(containerId);

	updateStockElems(infoChildElem, stock);
}

function updateStockElems(stockInfoChildElemList, stock) {
	const getPropVal = partialRight(uncurry(prop), stock);
	const extractInfoChildElemVal = pipe(
		getClass,
		partial(stripPrefix, /\bstock-/i),
		getPropVal
	);

	const orderedDataVals = map(extractInfoChildElemVal, stockInfoChildElemList);

	const elemsValsTuples = curry(filterOut)(function updateValueMission([infoChildElem, val]) {
		return val === undefined;
	})(zip(stockInfoChildElemList, orderedDataVals));

	compose(each, spreadArgs)(setDOMContent)
		(elemsValsTuples);
}

function getElemAttr(propName, elem) {
	return elem.getAttribute(propName);
}

function stripPrefix(prefixRegex, val) {
	return val.replace(prefixRegex, '');
}

function setDOMContent(elem, html) {
	elem.innerHTML = html;
	return elem;
}

function appendDOMChild(parentNode, childNode) {
	parentNode.appendChild(childNode);
	return parentNode;
}

function matchingStockId(stockId, node) {
	return getStockId(node) == stockId;
}