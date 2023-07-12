export type Primitive = string | number | boolean | bigint | symbol | undefined | null;

export type ReadonlyExt<T> = unknown extends T ? Primitive | Readonly<T> : Readonly<T>;

export type StoreSubscriber<T> = (newState: ReadonlyExt<T>) => void;
export type StoreSetStateFunction<T> = (prevValue: T) => T;
export type StoreSetState<T> = T | StoreSetStateFunction<T>;
export type StoreStateShouldUpdate<T> = (prevState: T, nextState: T) => boolean;
export type StoreSubscriberUnsubscribeFunction = () => void;

export type StoreEffectDependencies = StoreReadonly<unknown>[];

export type StoreEffectDestructor = () => void;
export type StoreEffectFunction = () => void | StoreEffectDestructor;

export interface StoreConfig<T> {
    shouldStateUpdate?: StoreStateShouldUpdate<T>;
    stateCopyFunction?: (state: T) => T;
}

export interface StoreReadonly<T> {
    current(): ReadonlyExt<T>;
    subscribe(subscriber: StoreSubscriber<T>): StoreSubscriberUnsubscribeFunction;
}
