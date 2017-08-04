import { UseCase, Context, Dispatcher, Store, StoreGroup } from "almin";

/**
 * ## Multiple Context
 *
 * We want to have multiple separated storegroup.
 * It is useful for large application which has many pages.
 *
 * For example, Page A use
 *
 * - Store A
 * - Store B
 *
 * Page B use
 *
 * - Store C
 * - Store D
 *
 * In the Page A, We not want to Store C and Store D.
 *
 * ### Should we have multiple context?
 *
 * In the Page A, use ContextA.
 * In the Page B, use ContextB.
 *
 */
class MockStore extends Store {
}

const aStore = new MockStore();
const bStore = new MockStore();
const cStore = new MockStore();
const dStore = new MockStore();
// big nest StoreGroup
const storeGroup = new StoreGroup({
    pageX: new StoreGroup({
        a: aStore,
        b: bStore
    }),
    pageY: new StoreGroup({
        c: cStore,
        d: dStore
    })
});

const context = new Context({
    dispatcher: new Dispatcher,
    store: storeGroup
});
context.getState(); // { pageX: {}, pageY: {} }
// multiple context
const storeGroupPageX = new StoreGroup({
    a: aStore,
    b: bStore
});
const storeGroupPageY = new StoreGroup({
    c: cStore,
    d: dStore
});
const contextX = new Context({
    dispatcher: new Dispatcher,
    store: storeGroupPageX,
});
const contextY = new Context({
    dispatcher: new Dispatcher,
    store: storeGroupPageY
});
// multiple StoreGroup and single context
const context = new Context({
    dispatcher: new Dispatcher,
    stores: [storeGroupPageX, storeGroupPageY]
});
context.getState() ; // [{ },{ }]