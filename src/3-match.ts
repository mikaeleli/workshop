import { Match } from "effect";

// Pattern matching is a powerful feature in functional programming.
// It allows you to match a value against a pattern and execute code based on the match.

type Circle = {
    type: "circle";
    radius: number;
};

type Square = {
    type: "square";
    length: number;
};

type Triangle = {
    type: "triangle";
    base: number;
    height: number;
};

type Shape = Circle | Square | Triangle;

// This works fine for simple data shapes
export const calculateArea = (shape: Shape): number => {
    // We can use a switch statement to match against the discriminant property ("type")
    switch (shape.type) {
        case "circle":
            return Math.PI * shape.radius ** 2;
        case "square":
            return shape.length ** 2;
        case "triangle":
            return 0.5 * shape.base * shape.height;
        default:
            throw new Error("Invalid shape");
    }
};

// But what about if we want to match against multiple properties? A switch statement doesn't lend itself well to this.
// Let's take a recent example of a dynamic form

// For the sake of it, let's say we want to handle number fields differently
// based on whether they have a minimum value or not

type StringField = {
    type: "string";
    value: string;
};

type NumberField = {
    type: "number";
    value: number;
};

type NumberFieldWithMinimum = {
    type: "number";
    value: number;
    minimum: number;
};

type Field = StringField | NumberField | NumberFieldWithMinimum;

export const fieldMatcher = (field: Field) => {
    return Match.type<Field>().pipe(
        Match.when(
            { type: "number", minimum: Match.defined },
            (numberFieldWithMinimum) => {
                // a number field with a minimum value
                console.log(
                    `Number field with minimum value: ${numberFieldWithMinimum.minimum}`
                );
            }
        ),
        Match.when({ type: "number" }, (numberField) => {
            // a normal number field
            console.log(`Number field: ${numberField.value}`);
        }),
        Match.orElse((otherField) => {
            // handle other cases
            console.log(`Other field: ${otherField.value}`);
        })
    )(field);
};
