import { StoreConfig, StoreReadonly, StoreSetState, StoreSetStateFunction, StoreSubscriber } from "./types.js";

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
        const newState = isStoreSetStateFunction(setState) ? setState(newStateBase) : setState;

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

function isStoreSetStateFunction<T>(e: StoreSetState<T>): e is StoreSetStateFunction<T> {
    return typeof e === "function";
}

export function isStoreReadonly<T = unknown>(e: StoreReadonly<T> | unknown): e is StoreReadonly<T> {
    return (
        e instanceof Store ||
        (typeof e === "object" && !!(e as StoreReadonly<T>).current && !!(e as StoreReadonly<T>).subscribe)
    );
}
