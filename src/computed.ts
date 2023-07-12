import { StoreEffect } from "./effect.js";
import { Store } from "./store.js";
import { StoreConfig, StoreEffectDependencies, StoreReadonly, StoreSubscriber } from "./types.js";

export type StoreComputedValueGenerator<T> = () => T;

export class StoreComputed<T> implements StoreReadonly<T> {
    private _store: Store<T>;
    private _effect: StoreEffect;

    constructor(
        computedValueGenerator: StoreComputedValueGenerator<T>,
        dependencies: StoreEffectDependencies,
        storeConfig?: StoreConfig<T>
    ) {
        this._store = new Store<T>(computedValueGenerator(), storeConfig);
        this._effect = new StoreEffect(() => this._store.set(computedValueGenerator()), dependencies);
    }

    current(): Readonly<T> {
        return this._store.current();
    }

    subscribe(subscriber: StoreSubscriber<T>): () => void {
        return this._store.subscribe(subscriber);
    }

    dependenciesSubscribe() {
        this._effect.dependenciesSubscribe();
    }

    dependenciesUnsubscribe() {
        this._effect.dependenciesUnsubscribe();
    }
}
