// https://docs.microsoft.com/ja-jp/dotnet/standard/microservices-architecture/microservice-ddd-cqrs-patterns/microservice-application-layer-implementation-web-api

import ConsoleConstructor = NodeJS.ConsoleConstructor;

interface AbstractCommand {
}

interface AbstractCommandHandler<T extends AbstractCommand> {
    handle(command: T);
}

class Command implements AbstractCommand {
    ['constructor']: typeof Command;
}

interface Constructor<T> {
    new(): T;
}

class CommandHandler implements AbstractCommandHandler<Command> {
    handle(command: Command) {
        // do task
    }
}

class Mediator {
    private map = new Map<typeof Command, CommandHandler>();

    constructor() {
        this.map.set(Command, new CommandHandler);
    }

    send(command: Command) {
        const handler = this.map.get(command.constructor);
        if (handler) {
            handler.handle(command);
        }
    }
}


// Do

const mediator = new Mediator();
mediator.send(new Command());

// in almin
import { UseCase, Context, Dispatcher, Store, StoreGroup } from "almin";

const context = new Context({
    store: new Store(),
    mediator
});
context.send(new Command());

// old compatible
class MyUseCase extends UseCase {
    execute(command: Command) {

    }
}

interface Mapping<K, V> {
    _k: K;
    _v: V;
}

type P<K, M extends Mapping<K, any>> = M extends Mapping<K, infer V>
    ? V
    : never;

interface TypedMap<T extends Mapping<any, any> = Mapping<void, void>> {
    set<K extends typeof Command, V>(key: K, val: V): TypedMap<T | Mapping<K, V>>;
    get<K extends typeof Command>(key: K): P<K, T>;
}

class UseCaseMediator {
    map: TypedMap;
    send(command: Command | any) {
        const m = this.map.set(Command, new MyUseCase())
        const useCase = m.get(command.constructor);
        if (!useCase) {
            throw new Error("Not found UseCase");
        }
        useCase.execute(command);
    }
}


type UseCase = {
    execute(...args: any[]): void;
};
class MyUseCase implements UseCase {
    execute(command: {}) {

    }
}
class CommandA {
    abc = "a"
}
class CommandE {
    efg = "efg"
}

class Container<P extends UseCase, Command = never>{
    constructor(private CommandList: Command[] = [], private useCases: P[] = []) {

    }
    bind<V extends UseCase, K,>(Command: K, useCase: V): Container<V | P, K | Command> {
        return new Container([...this.CommandList, Command], [...this.useCases, useCase]);
    }
    send(arg: Command) {
        
    }
}
const container = new Container();
const bindedContainer = container
    .bind(CommandA, new MyUseCase)
    .bind(CommandE, new MyUseCase);
bindedContainer.send(CommandA);