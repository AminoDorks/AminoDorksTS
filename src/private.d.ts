export type Safe<T> = NonNullable<Required<Readonly<T>>>;
export type Defined<T> = NonNullable<Required<T>>;
export type MayUndefined<T> = T | undefined;
export type HeadersType = Record<string, string>;