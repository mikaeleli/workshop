import { pipe, Option } from "effect";

type User = {
    id: string;
    firstName: string;
    lastName: string;
    age: number;
    email?: string;
};

type Product = {
    name: string;
    price: number;
    discountAmount?: number | null;
};

// Let's print to console some information about a purchase that a user made

export const imperative1 = (user?: User, product?: Product) => {
    if (user && product) {
        if (
            product.discountAmount !== undefined &&
            product.discountAmount !== null
        ) {
            // If the discount is higher that 50%, we show a different message than if it's lower
            const discountPercent =
                (product.discountAmount / product.price) * 100;

            if (discountPercent > 50) {
                if (user.email) {
                    console.log(
                        `${user.firstName} ${user.lastName} purchased ${product.name} for $${product.price} with a discount of ${product.discountAmount}%`
                    );
                }
            }

            // We have different messages based on whether the user has an email or not
            if (user.email) {
                console.log(
                    `${user.firstName} ${user.lastName} purchased ${product.name} for $${product.price} with a discount of ${product.discountAmount}%`
                );
            }
        }
    }
};

export const imperative2 = (user?: User) => {
    if (!user) {
        return "Unknown";
    }

    const fullName = `${user.firstName} ${user.lastName}`;
};

export const functional = (user: Option.Option<User>) => {
    const fullName = pipe(
        user,
        Option.map((user) => `${user.firstName} ${user.lastName}`),
        Option.getOrElse(() => "Unknown")
    );
};
