import { MyDomain } from "./domain/MyDomain";
import { Payload } from "almin";
// static method
interface StateStatics<Props> {
    // create new state from domain
    create(domain: MyDomain): State<Props>;
}
// state
interface State<Props> {
    // create new state
    constructor(props: Props): State<Props>;
    // update and merge state
    merge(props: Partial<Props>): State<Props>;
    // update state with domain
    from(domain: MyDomain): State<Props>;
    // update state with payload
    reduce(payload: Payload): State<Props>;
}

const DefaultProps = {
    value: "default value"
};
type Copy<T> = {
    [P in keyof T]: T[P];
    }
type Props = Copy<typeof DefaultProps>;
class BasicState implements State<Props> {
    value: string;

    static create(domain: MyDomain): BasicState {
        const initialState = new this();
        return initialState.from(domain);
    }

    constructor(props: typeof DefaultProps = DefaultProps) {
        this.a = props.a;
        this.b = props.b;
    }

    merge(props: Partial<Props>): BasicState {
        return new (this as any).constrctor({
            ...this as BasicState,
            ...props as any as Object
        })
    }

    from(domain: MyDomain): State<Props> {
        return this.merge({
            a: domain.value
        });
    }

    reduce(payload: Payload): State<Props> {
        throw new Error("Method not implemented.");
    }
}