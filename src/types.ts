export type StoreSubscriber<T> = (newState: Readonly<T>) => void;
export type StoreSetStateFunction<T> = (prevValue: T) => T;
export type StoreSetState<T> = T | StoreSetStateFunction<T>;
export type StoreStateShouldUpdate<T> = (prevState: T, nextState: T) => boolean;
export type StoreSubscriberUnsubscribeFunction = () => void;

export interface StoreReadonly<T> {
    current(): Readonly<T>;
    subscribe(subscriber: StoreSubscriber<T>): StoreSubscriberUnsubscribeFunction;
}
