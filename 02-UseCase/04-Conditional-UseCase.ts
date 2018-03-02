import { UseCase, Context, Dispatcher, Store } from "almin";
type A1<T> = T extends (a1: infer R1) => any ? [R1] : any
type A2<T> = T extends (a1: infer R1, a2: infer R2) => any ? [R1, R2] : any
type A3<T> = T extends (a1: infer R1, a2: infer R2, x: infer R3) => any ? [R1, R2, R3] : any
class UseCaseExecutor<T extends UseCase> {
    useCase: T;

    constructor(useCase: T) {
        this.useCase = useCase;
    }

    execute(a1: A1<T["execute"]>[0]): Promise<void>;
    execute(a1: A2<T["execute"]>[0], a2: A2<T["execute"]>[1]): Promise<void>;
    execute(a1: A3<T["execute"]>[0], a2: A3<T["execute"]>[1], a3: A3<T["execute"]>[2]): Promise<void>;
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

type r = A3<MyUseCase3["execute"]>

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