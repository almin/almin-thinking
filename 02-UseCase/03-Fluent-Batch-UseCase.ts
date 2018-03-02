import { UseCase, Context, Dispatcher, Store } from "almin";
class MyUseCase extends UseCase {
    execute(n: number) {
        console.info("MyUseCase#execute");
        return n;
    }
}

class AsyncUseCase extends UseCase {
    execute(value: string) {
        console.info("AsyncUseCase#execute");
        return Promise.resolve(value);
    }
}
class UseCaseExecutorCollection<U1 extends UseCase, U2 extends UseCase> {
    constructor(public useCases: Array<UseCase>) {
        this.useCases = useCases;
    }

    // @ts-ignore
    executor(executor: (u1: U1, u2: U2) => any);
    executor(executor: (...useCases: Array<UseCase>) => any) {
        return new Promise((resolve, reject) => {
            const queue = [];
            const proxyUseCases = this.useCases.map(useCase => {
                return proxify(useCase, (result) => queue.push(result), reject);
            });
            executor(...proxyUseCases);
            console.info("[LOG] DID");
            resolve(Promise.all(queue));
        }).then((value) => {
            console.info("[LOG] COMPLETED: ", value);
        });
    }
}

class UseCaseExecutor<T extends UseCase> {
    useCase: T;

    static of<U1 extends UseCase, U2 extends UseCase>(useCase1: U1, useCase2: U2): UseCaseExecutorCollection<U1, U2>;
    static of<K extends UseCase>(...useCases: Array<K>): UseCaseExecutorCollection<any, any> {
        return new UseCaseExecutorCollection(useCases);
    }

    constructor(useCase: T) {
        this.useCase = useCase;
    }

    executor(executor: (useCase: T) => any) {
        return new Promise((resolve, reject) => {
            const proxyUseCase = proxify(this.useCase, resolve, reject);
            executor(proxyUseCase);
        });
    }
}
const proxify = <T extends UseCase>(useCase: T, resolve: Function, reject: Function): T => {
    let isExecuted = false;
    return {
        execute(...args) {
            console.info("[LOG] WILL: ", ...args);
            if (isExecuted) {
                return reject(new Error("already executed"));
            }
            return resolve(useCase.execute(...args));
        }
    } as T;
};

/**
 * Fluent UseCase style - multiple useCase
 *
 * It could
 *
 * - type safe UseCase
 * - hook
 *
 */
UseCaseExecutor.of(new AsyncUseCase(), new MyUseCase())
    .executor((a, b) => {
        const [p1, p2] = [
            a.execute("string"),
            b.execute(42)
        ];
        return Promise.all([p1, p2]);
    }).then((result) => {
    console.log(result);
});