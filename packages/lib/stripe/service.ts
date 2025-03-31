// import { prisma } from "@formbricks/database";
// import { stripe } from '../utils/stripe';
// import {
//     TIntegrationStripePlans,
//     TIntegrationStripePromoCodes,
//     TIntegrationStripe,
//     TIntegrationStripeInput,
//     TIntegrationStripeCredential,
//     ZIntegrationStripeTokenSchema,
// } from "@formbricks/types/integration/stripe";
// import { getIntegrationByType } from "../integration/service";
// import Stripe from "stripe";

// interface ConnectStripeOptions {
//     environmentId: string;
//     key: TIntegrationStripeCredential;
// }


// export const connectStripe = async ({ environmentId, key }: ConnectStripeOptions) => {
//     const type: TIntegrationStripeInput["type"] = "stripe";

//     const baseData: TIntegrationStripeInput = {
//         type,
//         config: { key },
//     };

//     await prisma.integration.upsert({
//         where: {
//             type_environmentId: {
//                 environmentId,
//                 type,
//             },
//         },
//         update: {
//             ...baseData,
//             environment: { connect: { id: environmentId } },
//         },
//         create: {
//             ...baseData,
//             environment: { connect: { id: environmentId } },
//         },
//     });
// };

// export const fetchStripeAuthToken = async (code: string) => {

//     const response = await stripe.oauth.token({
//         grant_type: 'authorization_code',
//         code: code
//     });

//     const parsedToken = ZIntegrationStripeTokenSchema.safeParse(response);

//     if (!parsedToken.success) {
//         console.error(parsedToken.error);
//         throw new Error(parsedToken.error.message);
//     }
//     const { stripe_user_id, livemode, token_type, scope } = parsedToken.data;

//     return {
//         stripe_user_id,
//         livemode,
//         token_type,
//         scope,
//     };
// };

// export const getStripePlans = async (environmentId: string): Promise<Stripe.ApiList<Stripe.Price>> => {
//     try {
//         const stripeIntegration = (await getIntegrationByType(environmentId, "stripe")) as TIntegrationStripe;
//         if (!stripeIntegration || !stripeIntegration.config?.key.stripe_user_id) {
//             throw new Error("Stripe integration or user ID not found for the given environment.");
//         }
//         const results = await stripe.prices.list({
//             expand: ['data.product'],
//             limit: 100, // Adjust this limit as necessary
//         }, {
//             stripeAccount: stripeIntegration.config?.key.stripe_user_id
//         });
//         return results;
//     } catch (error) {
//         throw error;
//     }
// };

// export const getStripeProducts = async (environmentId: string): Promise<Stripe.ApiList<Stripe.Product>> => {
//     try {
//         const stripeIntegration = (await getIntegrationByType(environmentId, "stripe")) as TIntegrationStripe;

//         if (!stripeIntegration || !stripeIntegration.config?.key.stripe_user_id) {
//             throw new Error("Stripe integration or user ID not found for the given environment.");
//         }

//         const results = await stripe.products.list(
//             {
//                 limit: 100, // Adjust this limit as necessary
//             },
//             {
//                 stripeAccount: stripeIntegration.config.key.stripe_user_id,
//             }
//         );

//         return results;
//     } catch (error) {
//         console.error("Error fetching Stripe products:", error);
//         throw new Error("Failed to fetch Stripe products.");
//     }
// };

// export const getStripePromoCodes = async (environmentId: string): Promise<Stripe.ApiList<Stripe.PromotionCode>> => {
//     try {
//         const stripeIntegration = (await getIntegrationByType(environmentId, "stripe")) as TIntegrationStripe;
//         if (!stripeIntegration || !stripeIntegration.config?.key.stripe_user_id) {
//             throw new Error("Stripe integration or user ID not found for the given environment.");
//         }
//         const results = await stripe.promotionCodes.list({
//             // expand: ['data.product'],
//             limit: 100, // Adjust this limit as necessary
//         }, {
//             stripeAccount: stripeIntegration.config?.key.stripe_user_id
//         });
//         return results;
//     } catch (error) {
//         throw error;
//     }
// };