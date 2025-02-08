import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Define a Product type
interface Product {
  title: string;
  image?: { asset?: { url?: string } } | string;
  totalPrice: number;
  quantity: number;
}

// Initialize Stripe client with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27.acacia',
});
console.log("Stripe Secret Key:", process.env.STRIPE_SECRET_KEY ? "Loaded" : "Not Loaded");

export async function POST(req: Request) {
  try {
    const { cartProducts }: { cartProducts: Product[] } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: cartProducts.map((product: Product) => {
        // ✅ Fix: Sanity Image Handling
        const imageUrl =
          typeof product.image === 'string'
            ? product.image
            : product.image?.asset?.url || 'https://via.placeholder.com/150';

        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.title,
              images: [imageUrl], // Ensure valid image URL
            },
            unit_amount: product.totalPrice * 100, // Convert to cents
          },
          quantity: product.quantity,
        };
      }),
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/success`,
      cancel_url: `${req.headers.get('origin')}/cancel`,
    });

    return NextResponse.json({ id: session.id });
  } catch (error) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
