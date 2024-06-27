// Example 1

type Branded<T, Brand> = T & { __brand: Brand };

type Person = Branded<{ name: string }, "Person">;

export const printName = (person: Person) => {
    console.log(person.name);
};

const animal = {
    name: "dog",
};

// Typescript will complain here since 'printName' only accepts the branded 'Person' type
printName(animal);

// Example 2

type UserId = Branded<string, "UserId">;

type User = Branded<
    {
        id: UserId;
        firstName: string;
        lastName: string;
        age: number;
        address: string;
    },
    "User"
>;

const users: User[] = [];

export const getUserById = (id: UserId): User | undefined => {
    return users.find((user) => user.id === id);
};

// Typescript will complain here since 'getUserById' only accepts
// the branded 'UserId' type which a normal string does not satisfy
getUserById("1");

// We can't directly assign a string to a UserId (due to the magic "__brand" property)
const userId: UserId = "1";

// But we can tell Typescript to "trust me bro" by using type casting (type casting is normally discouraged)
const userId2 = "1" as UserId;

// Example 3

export const printUserFullName = (user: User) => {
    console.log(`${user.firstName} ${user.lastName}`);
};

const user = {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    age: 30,
    address: "123 Main St",
};

// Typescript will complain here since 'printUserFullName' only accepts
// the branded 'User' type which a normal object does not satisfy
// even though it has the same shape
printUserFullName(user);

// Practical examples include using branded types to prevent mixing up different types of IDs
// (e.g. UserId, ProductId, OrderId, etc.) or to prevent mixing up different types of entities
// (e.g. User, Product, Order, etc.)

// Branded types also have the added benefit of acting as a documentation for the codebase

// A practical example in our case would be fetching a calibration vs. fetching a logger test

type CalibrationId = Branded<string, "CalibrationId">;
type Calibration = Branded<
    {
        id: CalibrationId;
        name: string;
        date: Date;
    },
    "Calibration"
>;

export const fetchCalibrationById = async (
    calibrationId: CalibrationId
): Promise<Calibration> => {
    return Promise.resolve({
        id: calibrationId,
        date: new Date(),
        name: "Calibration",
    } as Calibration);
};

type LoggerTestId = Branded<string, "LoggerTestId">;
type LoggerTest = Branded<
    {
        id: LoggerTestId;
        name: string;
        date: Date;
    },
    "LoggerTest"
>;

export const fetchLoggerTestById = async (
    loggerTestId: LoggerTestId
): Promise<LoggerTest> => {
    return Promise.resolve({
        id: loggerTestId,
        date: new Date(),
        name: "Logger Test",
    } as LoggerTest);
};
