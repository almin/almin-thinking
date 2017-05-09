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
    promise: Promise<any>;

    constructor(useCase: T, executor: (useCase: T) => any) {
        this.promise = new Promise((resolve, reject) => {
            const proxyUseCase = proxify(useCase, resolve, reject);
            executor(proxyUseCase);
        });
    }

    then(onFull, onReject?) {
        return this.promise.then(onFull, onReject);
    }

    catch(onReject) {
        return this.promise.catch(onReject);
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
 * Revealing Constructor Pattern
 * Reference: https://blog.domenic.me/the-revealing-constructor-pattern/
 */
new UseCaseExecutor(new MyUseCase(), (useCase) => useCase.execute('arg', 'arg2')).then(value => {
    console.log(value);
});

new UseCaseExecutor(new AsyncUseCase(), (useCase) => {
    return useCase.execute("test");
}).then(value => {
    console.log(value);
});
