import {
	Subject,
	Observable,
	interval,
} from 'rxjs';

import {
	map as rxjsMap,
	take as rxjsTake,
	filter as rxjsFilter,
	distinctUntilChanged,
	throttle,
} from 'rxjs/operators';

import {
	createTrace,
	pipe,
} from './tools';

export {
	runTest,
}

const trace = createTrace('ch10 #');

function runTest() {
	test1();
}

function test1() {
	test1();
	test2();
	test3();

	function test3() {
		pipe(
			rxjsFilter((v: number) => v % 2 == 1),
			distinctUntilChanged(),
			rxjsTake(3),
			// throttle(100),
			rxjsMap((v: number) => v * 2)
		)(interval(1000))
			.subscribe((n: number) => trace('test1-3', n));
	}

	function test2() {
		const a = Observable.create(
			(observer: Subject<number>) => {
				setInterval(
					() => observer.next(Math.random()),
					1000
				)
			}
		);

		const b = rxjsTake(3)(a) as Observable<number>;

		b.subscribe((n: number) => trace('test1-2', n));
	}

	function test1() {
		const a = new Subject<number>();
		setInterval(() => a.next(Math.random()), 1000);

		const b = rxjsMap((n: number) => n * 2)(a);

		const c = rxjsTake(3)(b) as Observable<number>;

		c.subscribe((n: number) => trace('test1-1', n));
	}
}
