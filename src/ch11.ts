import {
	createTrace,
	pipe,
} from './tools';

export {
	runTest,
}

const trace = createTrace('ch11 #');

function runTest() {
	test1();
}

function test1() {
	test1();

	function test1() {

	}
}
