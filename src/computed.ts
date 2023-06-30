import { StoreEffect, StoreEffectDependencies } from "./effect.js";
import { Store } from "./store.js";
import { StoreReadonly, StoreSubscriber, StoreSubscriberUnsubscribeFunction } from "./types.js";

export type StoreComputedValueGenerator<T> = () => T;

export class StoreComputed<T, TDependencyStores = unknown> implements StoreReadonly<T> {
    private _store: Store<T>;
    private _effect: StoreEffect<TDependencyStores>;

    constructor(
        computedValueGenerator: StoreComputedValueGenerator<T>,
        dependencies: StoreEffectDependencies<TDependencyStores>
    ) {
        this._store = new Store<T>(computedValueGenerator());
        this._effect = new StoreEffect<TDependencyStores>(
            () => this._store.set(computedValueGenerator()),
            dependencies
        );
        this._effect.dependenciesSubscribe();
    }

    current(): Readonly<T> {
        return this._store.current();
    }

    subscribe(subscriber: StoreSubscriber<T>): () => void {
        return this._store.subscribe(subscriber);
    }

    dependenciesUnsubscribe() {
        this._effect.dependenciesUnsubscribe();
    }
}
