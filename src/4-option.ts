// The option data type is used to represent optional values.
// It can have __some__ value or __none__ at all.

type Some<T> = {
    type: "some";
    value: T;
};

type None = {
    type: "none";
};

type Option<T> = Some<T> | None;

export const some = <T>(value: T): Some<T> => ({
    type: "some",
    value,
});

export const none = (): None => ({
    type: "none",
});

type User = {
    id: string;
    email: Option<string>;
};
