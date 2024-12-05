import { compare } from "./compare.js";
import {
    StoreConfig,
    StoreInitState,
    StoreInitStateFunction,
    StoreReadonly,
    StoreSetState,
    StoreSetStateFunction,
    StoreSubscriber,
} from "./types.js";

export class Store<T> implements StoreReadonly<T> {
    protected _state: T;
    protected _config?: StoreConfig<T>;
    protected _subscribersSet: Set<StoreSubscriber<T>>;

    constructor(initState: StoreInitState<T>, config?: StoreConfig<T>) {
        this._state = isInitStateFunction(initState) ? initState() : initState;
        this._config = config;
        this._subscribersSet = new Set<StoreSubscriber<T>>();
    }

    current(): Readonly<T> {
        return this._state;
    }

    subscribe(subscriber: StoreSubscriber<T>): () => void {
        this._subscribersSet.add(subscriber);

        subscriber(this._state);

        return () => {
            this._subscribersSet.delete(subscriber);
        };
    }

    set(setState: StoreSetState<T>): void;
    set(setState: StoreSetState<T>, returnValue: "always"): T;
    set(setState: StoreSetState<T>, returnValue: "updated"): T | undefined;
    set(setState: StoreSetState<T>, returnValue?: "always" | "updated"): void | T | undefined {
        const newStateBase = this._config?.stateCopyFunction
            ? this._config.stateCopyFunction(this._state)
            : this._state;
        const newState = isStoreSetStateFunction(setState) ? setState(newStateBase) : setState;

        if (this._config?.shouldStateUpdate !== null) {
            if (this._config?.shouldStateUpdate) {
                if (!this._config.shouldStateUpdate(this._state, newState)) {
                    if (returnValue === "always") return this._state;
                    return;
                }
            } else if (compare(this._state, newState, 2)) {
                if (returnValue === "always") return this._state;
                return;
            }
        }

        this._state = newState;
        this._subscribersSet.forEach(s => s(this._state));

        if (returnValue) return this._state;
    }
}

export function getStoreReadonly<T>(store: Store<T>): StoreReadonly<T> {
    return {
        current: () => store.current(),
        subscribe: subscriber => store.subscribe(subscriber),
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

function isInitStateFunction<T>(initState: StoreInitState<T>): initState is StoreInitStateFunction<T> {
    return typeof initState === "function";
}
