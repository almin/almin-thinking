import { UseCase, Context, Dispatcher, Store } from "almin";
type A0<T> = T extends () => any
    ? any : never
type A1<T> = T extends (a1: infer R1) => any
    ? [R1] : [never]
type A2<T> = T extends (a1: infer R1, a2: infer R2) => any
    ? [R1, R2] : [never, never]
type A3<T> = T extends (a1: infer R1, a2: infer R2, a3: infer R3) => any
    ? [R1, R2, R3] : [never, never, never]

class UseCaseExecutor<T extends UseCase> {
    useCase: T;

    constructor(useCase: T) {
        this.useCase = useCase;
    }

    execute<P extends A0<T["execute"]>>(a1: P): Promise<void>;
    execute<P extends A1<T["execute"]>>(a1: P[0]): Promise<void>;
    execute<P extends A2<T["execute"]>>(a1: P[0], a2: P[1]): Promise<void>;
    execute<P extends A3<T["execute"]>>(a1: P[0], a2: P[1], a3: P[2]): Promise<void>;
    execute(...args: any[]): Promise<void> {
        return this.useCase.execute(...args);
    }
}

class MyUseCaseZero extends UseCase {
    execute() {
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

new UseCaseExecutor(new MyUseCaseZero())
    .execute()
    .then(value => {
        console.log(value);
    });

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

new UseCaseExecutor(new MyUseCase3())
    .execute(1, "")
    .then(value => {
        console.log(value);
    });