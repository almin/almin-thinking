import { UseCase, Context, Dispatcher, Store } from "almin";
type A1<T> = T extends (x: infer R) => any ? R : any
type A2<T> = T extends (a1: any, x: infer R) => any ? R : any
type A3<T> = T extends (a1: any, a2: any, x: infer R) => any ? R : any
type A4<T> = T extends (a1: any, a2: any, a3: any, x: infer R) => any ? R : any
type PR = Promise<void>;
class UseCaseExecutor<T extends UseCase> {
    useCase: T;

    constructor(useCase: T) {
        this.useCase = useCase;
    }

    execute(a1: A1<T["execute"]>): Promise<void>;
    execute(a1: A1<T["execute"]>, a2: A2<T["execute"]>): Promise<void>;
    execute(a1: A1<T["execute"]>, a2: A2<T["execute"]>, a3: A3<T["execute"]>): Promise<void>;
    execute(...args: any[]): Promise<void> {
        return this.useCase.execute(...args);
    }
}


class MyUseCase extends UseCase {
    execute(value: string) {
        return Promise.resolve(value);
    }
}

class MyUseCase2 extends UseCase {
    execute(x1: number, x2: string) {
    }
}

class MyUseCase3 extends UseCase {
    execute(x1: number, x2: string, x3: { key: string }) {
    }
}

new UseCaseExecutor(new MyUseCase())
    .execute(1)
    .then(value => {
        console.log(value);
    });

new UseCaseExecutor(new MyUseCase2())
    .execute("wrong", "string")
    .then(value => {
        console.log(value);
    });
// Should be error
new UseCaseExecutor(new MyUseCase3())
    .execute(1, 1, { key: "" })
    .then(value => {
        console.log(value);
    });