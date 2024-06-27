type Person = {
    name: string;
};

export const printName = (person: Person) => {
    console.log(person.name);
};

const animal = {
    name: "dog",
};

// Since animal and Person have the same structure, Typescript will not complain
printName(animal);

const car = {
    brand: "Toyota",
    model: "Corolla",
    name: "Peter",
    age: 30,
};

// Typescript will even allow objects with extra properties as long as it fulfills the required properties
printName(car);
