import { UseCase, Context, Dispatcher, Store } from "almin";
class MyUseCase extends UseCase {
    execute(...args) {
        return args;
    }
}

class AsyncUseCase extends UseCase {
    execute(value: string) {
        return Promise.resolve(value);
    }
}
class UseCaseExecutor<T extends UseCase> {
    useCase: T;

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
        execute(...args){
            console.info("[LOG]", ...args);
            if (isExecuted) {
                return reject(new Error("already executed"));
            }
            return resolve(useCase.execute(...args));
        }
    } as T;
};

/**
 * Fluent UseCase style
 *
 * It could
 *
 * - type safe UseCase
 * - hook
 *
 */
new UseCaseExecutor(new MyUseCase())
    .executor(useCase => useCase.execute("test"))
    .then(value => {
        console.log(value);
    });

new UseCaseExecutor(new AsyncUseCase())
    .executor(useCase => useCase.execute("async"))
    .then(value => {
        console.log(value);
    });
