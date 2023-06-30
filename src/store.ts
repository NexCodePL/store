import { StoreReadonly, StoreSetState, StoreStateShouldUpdate, StoreSubscriber } from "./types.js";

export interface StoreConfig<T> {
    shouldStateUpdate?: StoreStateShouldUpdate<T>;
    stateCopyFunction?: (state: T) => T;
}

export class Store<T> implements StoreReadonly<T> {
    protected _state: T;
    protected _config?: StoreConfig<T>;
    protected _subscribersSet: Set<StoreSubscriber<T>>;

    constructor(initState: T, config?: StoreConfig<T>) {
        this._state = initState;
        this._config = config;
        this._subscribersSet = new Set<StoreSubscriber<T>>();
    }

    current(): Readonly<T> {
        return this._state;
    }

    subscribe(subscriber: StoreSubscriber<T>): () => void {
        this._subscribersSet.add(subscriber);

        return () => {
            this._subscribersSet.delete(subscriber);
        };
    }

    set(setState: StoreSetState<T>) {
        const newStateBase = this._config?.stateCopyFunction
            ? this._config.stateCopyFunction(this._state)
            : this._state;
        const newState = isFunction(setState) ? setState(newStateBase) : setState;

        if (!!this._config?.shouldStateUpdate && !this._config.shouldStateUpdate(this._state, newState)) {
            return;
        }

        this._state = newState;
        this._subscribersSet.forEach(s => s(this._state));
    }
}

export function getStoreReadonly<T>(store: Store<T>): StoreReadonly<T> {
    return {
        current: store.current,
        subscribe: store.subscribe,
    };
}

function isFunction(e: unknown): e is Function {
    return typeof e === "function";
}

export function isStore<T = unknown>(e: Store<T> | unknown): e is Store<T> {
    return e instanceof Store;
}
