import {
	createTrace,
	partial,
	curry,
	sum,
	add,
	compose,
	prop,
} from './tools';

export {
	runTest,
}

const trace = createTrace('appendix-B #');
const someObj = {
	something: {
		else: {
			entirely: 'xxx',
		}
	}
};

const Maybe = {
	Just,
	Nothing,
	of: Just,
};

function runTest() {
	test1();
	test2();
	test3();
}

function test3() {
	const egoChange = curry(function egoChange(amount: number, concept: number, egoLevel: number) {
		trace('test3:', `${amount > 0 ? 'Learned' : 'Shared'} ${concept}`);
		return MaybeHumble(egoLevel + amount);
	});

	test1();
	test2();
	test3();
	test4();

	function test4() {
		trace('test3-4:', '------------');
		const learn = egoChange(3);
		const share = egoChange(-2);

		const learner = MaybeHumble(35);

		learner.chain(learn('closures'))
			.chain(share('closures'))
			.chain(learn('side effects'))
			.chain(share('side effects'))
			.chain(learn('recursion'))
			.chain(share('recursion'))
			.chain(learn('map/reduce'))
			.chain(share('map/reduce'))
			.map(introduction);
	}

	function test3() {
		trace('test3-3:', '------------');
		const learn = egoChange(3);
		const learner = MaybeHumble(35);

		learner.chain(learn('closures'))
			.chain(learn('side effects'))
			.chain(learn('recursion'))
			.chain(learn('map/reduce'))
			.map(introduction);
	}

	function introduction() {
		trace('test3:', `I'm just a learner like you :)`);
	}

	function test2() {
		const bob = MaybeHumble(41);
		const alice = MaybeHumble(39);

		const teamMembers = curry(function teamMembers(ego1: any, ego2: any) {
			trace('test3-2:', `Our humble team's egos: ${ego1} ${ego2}`);
		});

		bob.map(teamMembers).ap(alice);

		const frank = MaybeHumble(45);
		frank.map(teamMembers).ap(alice);
		alice.map(teamMembers).ap(frank);
	}

	function test1() {
		const bob = MaybeHumble(45);
		let alice = MaybeHumble(39);

		trace('test3-1:', bob.inspect());
		trace('test3-2:', alice.inspect());

		function winAward(ego: number) {
			return MaybeHumble(ego + 3);
		}

		alice = alice.chain(winAward);
		trace('test3-3:', alice.inspect());
	}
}

function test2() {
	test1();
	test2();

	function test2() {
		const safeProp = curry(function safeProp(prop: string, obj: any) {
			return isEmpty(obj)
				? Maybe.Nothing()
				: Maybe.of(obj[prop]);
		});

		Maybe.of(someObj)
			.chain(safeProp('something'))
			.chain(safeProp('else'))
			.chain(safeProp('entirely'))
			.map(partial(trace, 'test2-2:'));
	}

	function test1() {
		Maybe.of(someObj)
			.map(prop('something'))
			.map(prop('else'))
			.map(prop('entirely'))
			.map(partial(trace, 'test2-1:'));
	}
}

function test1() {
	test1();
	test2();
	test3();

	function test3() {
		const A = Just(10);
		const B = Just(3);

		const C = A.map(curry(add));
		trace('test1-3-1:', C.inspect());

		const D = C.ap(B);
		trace('test1-3-2:', D.inspect());

		trace('test1-3-3:', A.map(curry(add)).ap(B).inspect());
		trace('test1-3-4:', B.map(A.chain(curry(add))).inspect());
		trace('test1-3-5:', compose(B.map, A.chain, curry)(add).inspect());
	}

	function test2() {
		const A = Just(10);
		const eleven = A.chain((v: number) => v + 1);
		trace('test1-2:', eleven);
	}

	function test1() {
		const A = Just(10);
		const B = A.map((v: number) => v * 2);
		trace('test1-1:', B.inspect());
	}
}

function Just(val: any) {
	return {
		map,
		chain,
		ap,
		inspect,
	}

	function map(fn: Function) {
		return Just(fn(val));
	}

	function chain(fn: Function) {
		return fn(val);
	}

	function ap(anotherMonad: { map: Function }) {
		return anotherMonad.map(val);
	}

	function inspect() {
		return `Just(${val})`;
	}
}

function Nothing() {
	return {
		map: Nothing,
		chain: Nothing,
		ap: Nothing,
		inspect: () => 'Nothing'
	};
}

function isEmpty(val: any) {
	return val === undefined || val === null;
}

function MaybeHumble(egoLevel: number) {
	return egoLevel < 42
		? Maybe.of(egoLevel)
		: Maybe.Nothing();
}