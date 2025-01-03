export type Primitive = string | number | boolean | bigint | symbol | undefined | null;

export type ReadonlyExt<T> = unknown extends T ? Primitive | Readonly<T> : Readonly<T>;

export type StoreSubscriber<T> = (newState: ReadonlyExt<T>) => void;
export type StoreSetStateFunction<T> = (prevValue: T) => T;
export type StoreSetState<T> = T | StoreSetStateFunction<T>;
export type StoreStateShouldUpdate<T> = (prevState: T, nextState: T) => boolean;
export type StoreSubscriberUnsubscribeFunction = () => void;

export type StoreEffectDependencies = StoreReadonlyExt<unknown>[];

export type StoreEffectDestructor = () => void;
export type StoreEffectFunction = () => void | StoreEffectDestructor;

export interface StoreConfig<T> {
    shouldStateUpdate?: StoreStateShouldUpdate<T> | null;
    stateCopyFunction?: (state: T) => T;
}

export interface StoreReadonlyExt<T> {
    current(): ReadonlyExt<T>;
    subscribe(subscriber: StoreSubscriber<T>): StoreSubscriberUnsubscribeFunction;
}

export interface StoreReadonly<T> {
    current(): Readonly<T>;
    subscribe(subscriber: StoreSubscriber<T>): StoreSubscriberUnsubscribeFunction;
}

export type StoreInitStateFunction<T> = () => T;

export type StoreInitState<T> = T | StoreInitStateFunction<T>;
