import { Payload } from "almin";
import * as assert from "assert";
// This is concept model of State
// Simple principle:
interface StatePrinciple<T> {
    constructor(state: T): any;
    toJSON(): T;
}
// Implementation
// It is based `JSON.stringify` default algorithm
// https://tc39.github.io/ecma262/#sec-serializejsonobject
const ToJSONObject = <T>(object: State<T>): T => {
    const json: any = {};
    const keys = Object.keys(object);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        json[key] = (object as any)[key];
    }
    return json as T;
};

abstract class State<T> {
    constructor(state: T) {
    }

    merge(state: Partial<T>): State<T> {
        return new (this as any).constructor({
            ...this as State<T>,
            ...state as any
        });
    }

    toJSON(): T {
        return ToJSONObject(this);
    }
}

// Implement State sub class
// domain
class MyDomain {
    value: string;

    constructor(value: string) {
        this.value = value;
    }
}

interface MyStateProps {
    value: string;
    isLoading: boolean;
}

class MyState extends State<MyStateProps> implements MyStateProps {
    value: string;
    isLoading: boolean;

    constructor(props: MyStateProps) {
        super(props);
        this.value = props.value;
        this.isLoading = props.isLoading;
    }

    merge(state: Partial<MyState>): MyState {
        return new (this as any).constructor({
            ...this as MyState,
            ...state
        });
    }

    from(domain: MyDomain): MyState {
        return this.merge({
            value: domain.value
        });
    }

    reduce(payload: Payload): MyState {
        switch (payload.type) {
            case "start":
                return this.merge({
                    isLoading: true
                });
            case "stop":
                return this.merge({
                    isLoading: false
                });
            default:
                return this;
        }
    }
}


class ExtendState extends State<MyStateProps> implements MyStateProps {
    value: string;
    isLoading: boolean;

    extensionValue: string;

    constructor(props: MyStateProps) {
        super(props);
        this.value = props.value;
        this.isLoading = props.isLoading;
        this.extensionValue = "extension";
    }

    get extensionGetter() {
        return this.extensionValue + "ext";
    }

    merge(state: Partial<MyStateProps>): ExtendState {
        return new ExtendState({
            ...this as ExtendState,
            ...state
        });
    }

    from(domain: MyDomain): ExtendState {
        return this.merge({
            value: domain.value
        });
    }

    reduce(payload: Payload): ExtendState {
        switch (payload.type) {
            case "start":
                return this.merge({
                    isLoading: true
                });
            case "stop":
                return this.merge({
                    isLoading: false
                });
            default:
                return this;
        }
    }

    toJSON() {
        return {
            value: this.value,
            isLoading: this.isLoading,
        }; // without extensionValue
    }
}


// Pass MyState
testYourStore(MyState);
// Pass Some extension State
testYourStore(ExtendState);

function testYourStore(StoreConstructor: new (..._: Array<any>) => MyState | ExtendState) {
    describe(`${(StoreConstructor as any).name}`, () => {
        it("Store<T> can unwrap T by Store#toJSON()", () => {
            const stateProps = { value: "value", isLoading: false };
            const aState = new StoreConstructor(stateProps);
            assert.deepStrictEqual(aState.toJSON(), stateProps);
        });

        it("new Store === new Store", () => {
            const stateProps = { value: "value", isLoading: false };
            const aState = new StoreConstructor(stateProps);
            const bState = new StoreConstructor(stateProps);
            assert.deepStrictEqual(aState.toJSON(), bState.toJSON());
        });

        it("new Store === new Store(new Store())", () => {
            const stateProps = { value: "value", isLoading: false };
            const aState = new StoreConstructor(stateProps);
            const bState = new StoreConstructor(new MyState(stateProps));
            assert.deepStrictEqual(aState.toJSON(), bState.toJSON());
        });

        it("create Store from Payload", () => {
            const initialState = new StoreConstructor({
                value: "",
                isLoading: false
            });
            const state = initialState.reduce({
                type: "start"
            });
            assert.deepStrictEqual(state.toJSON(), {
                value: "",
                isLoading: true
            });
        });

        it("create Store from Domain", () => {
            const myDomain = new MyDomain("domain value");
            const initialState = new StoreConstructor({
                value: "",
                isLoading: false
            });
            const state = initialState.from(myDomain);
            assert.deepStrictEqual(state.toJSON(), {
                value: "domain value",
                isLoading: false
            });
        });

    });
}