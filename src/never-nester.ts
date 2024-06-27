import { pipe, Option, Either, Match, Effect } from "effect";
import { Branded } from "effect/Brand";

type Customer = {
    id: string;
    firstName: string;
    lastName: string;
    age: number;
    email: string;
};

type Product = {
    name: string;
    price: number;
    discountAmount?: number | null;
};

const mockFetch = (...args: any[]) => {
    ///
};

// Let's create a function that sends a thank you email to a user after they make a purchase

export const example1 = async (user?: Customer, products?: Array<Product>) => {
    if (user && products) {
        let totalPrice = 0;
        let totalDiscount = 0;

        for (let i = 0; i < products.length; i++) {
            const product = products[i];

            totalPrice += product.price;

            if (
                product.discountAmount !== undefined &&
                product.discountAmount !== null
            ) {
                totalDiscount += product.discountAmount ?? 0;
            }
        }

        // If the total price is greater than $100, we send a coupon code to the user as a thank you
        if (totalPrice > 100) {
            fetch("localhost:3000/thank-you", {
                method: "POST",
                body: JSON.stringify({
                    message: `Thank you for your purchase, ${user.firstName}! For being a loyal customer, we're giving you a 20% discount on your next purchase!`,
                    coupon: "20OFF",
                }),
            });
        } else {
            fetch("localhost:3000/thank-you", {
                method: "POST",
                body: JSON.stringify({
                    message: `Thank you for your purchase, ${user.firstName}! You saved $${totalDiscount}!`,
                }),
            });
        }

        // What happens if the api call fails to send the email?
    }

    // What happens if user or product is undefined?
};

export const example2 = (user?: Customer, products?: Array<Product>) => {
    if (!user) {
        return { message: "User is missing" };
    }

    if (!products) {
        return { message: "Products are missing" };
    }

    const { totalPrice, totalDiscount } = products.reduce(
        (acc, product) => {
            acc.totalPrice += product.price;
            acc.totalDiscount += product.discountAmount ?? 0;

            return acc;
        },
        { totalPrice: 0, totalDiscount: 0 }
    );

    // If the total price is greater than $100, we send a coupon code to the user as a thank you
    if (totalPrice > 100) {
        fetch("localhost:3000/thank-you", {
            method: "POST",
            body: JSON.stringify({
                message: `Thank you for your purchase, ${user.firstName}! For being a loyal customer, we're giving you a 20% discount on your next purchase!`,
                coupon: "20OFF",
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    return { message: "Failed to send email" };
                } else {
                    return { message: "Email sent successfully" };
                }
            })
            .catch((error) => {
                return { message: `Failed to send email: ${error.message}` };
            });
    } else {
        fetch("localhost:3000/thank-you", {
            method: "POST",
            body: JSON.stringify({
                message: `Thank you for your purchase, ${user.firstName}! You saved $${totalDiscount}!`,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    return { message: "Failed to send email" };
                } else {
                    return { message: "Email sent successfully" };
                }
            })
            .catch((error) => {
                return { message: `Failed to send email: ${error.message}` };
            });
    }
};

type BrandedCustomer = Branded<Customer, "Customer">;
type BrandedProduct = Branded<Product, "Product">;

const getSaleTotals = (products: Array<BrandedProduct>) => {
    return products.reduce(
        (acc, product) => {
            acc.totalPrice += product.price;
            acc.totalDiscount += product.discountAmount ?? 0;

            return acc;
        },
        { totalPrice: 0, totalDiscount: 0 }
    );
};

export const functional = (
    user: Option.Option<BrandedCustomer>,
    products: Option.Option<Array<BrandedProduct>>
) => {
    return pipe(
        Either.zipWith(
            Either.fromOption(() => ({ message: "User is missing" }))(user),
            Either.fromOption(() => ({ message: "Products are missing" }))(
                products
            ),
            (user, products) => ({ user, totals: getSaleTotals(products) })
        ),
        Either.map(({ user, totals: { totalPrice, totalDiscount } }) => {
            const shouldGetCoupon = totalPrice > 100;

            const payload = Match.type<boolean>().pipe(
                Match.when(true, () => ({
                    message: `Thank you for your purchase, ${user.firstName}! For being a loyal customer, we're giving you a 20% discount on your next purchase!`,
                    coupon: "20OFF",
                })),
                Match.when(false, () => ({
                    message: `Thank you for your purchase, ${user.firstName}! You saved $${totalDiscount}!`,
                })),
                Match.exhaustive
            )(shouldGetCoupon);

            return Effect.tryPromise({
                try: () =>
                    fetch("localhost:3000/thank-you", {
                        method: "POST",
                        body: JSON.stringify(payload),
                    }),
                catch: (error) =>
                    Either.left({
                        message: `Failed to send email: ${JSON.stringify(
                            error
                        )}`,
                    }),
            });
        })
    );
};
