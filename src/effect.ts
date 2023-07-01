import {
    StoreEffectDependencies,
    StoreEffectDestructor,
    StoreEffectFunction,
    StoreSubscriberUnsubscribeFunction,
} from "./types.js";

export class StoreEffect {
    private _effect: StoreEffectFunction;
    private _destructor: StoreEffectDestructor | undefined;
    private _dependencies: StoreEffectDependencies;
    private _unsubscribes: StoreSubscriberUnsubscribeFunction[];

    constructor(effect: StoreEffectFunction, dependencies: StoreEffectDependencies) {
        this._effect = effect;
        this._destructor = undefined;
        this._dependencies = dependencies;
        this._unsubscribes = [];
    }

    private subscriber() {
        if (this._destructor) {
            this._destructor();
        }
        this._destructor = this._effect() ?? undefined;
    }

    dependenciesSubscribe() {
        this.dependenciesUnsubscribe();

        this._unsubscribes = this._dependencies.map(d => d.subscribe(() => this.subscriber()));
    }

    dependenciesUnsubscribe() {
        this._unsubscribes.forEach(e => e());
        this._unsubscribes = [];
    }
}
