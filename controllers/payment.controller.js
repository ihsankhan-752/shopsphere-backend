import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res
        .status(400)
        .json({ success: false, message: "Amount is required" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "aed",
      automatic_payment_methods: { enabled: true },
    });

    return res
      .status(200)
      .json({ success: true, clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "something went wrong" });
  }
};
