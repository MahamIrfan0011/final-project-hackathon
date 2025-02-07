'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

export default function Checkout() {
  const [cartProducts, setCartProducts] = useState<any[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        console.log('Cart loaded:', parsedCart);
        setCartProducts(parsedCart);
      } catch (error) {
        console.error('Invalid cart data:', error);
        localStorage.removeItem("cart");
      }
    }
  }, []);

  const handleCheckout = async () => {
    const stripe = await stripePromise;

    if (!stripe) {
      console.error('Stripe.js failed to load.');
      return;
    }

    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartProducts }),
      });

      const session = await response.json();

      if (session.error) {
        console.error(session.error);
        alert('Error creating checkout session');
        return;
      }

      const { error } = await stripe.redirectToCheckout({ sessionId: session.id });

      if (error) {
        console.error(error.message);
        alert('Something went wrong with the payment!');
      }
    } catch (error) {
      console.error('Error during checkout', error);
      alert('Something went wrong!');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Checkout Page</h1>
      {cartProducts.length > 0 ? (
        <ul className="space-y-4">
          {cartProducts.map((item) => {
            // ✅ Fix: Sanity image handling with fallback
            const imageUrl = item.image?.asset?.url || item.image || '/placeholder.png';

            return (
              <li key={item._id} className="flex items-center space-x-4 border-b pb-4">
                <Image
                  src={imageUrl}
                  alt={item.title || 'Product Image'}
                  width={80}
                  height={80}
                  className="rounded-md"
                />
                <div>
                  <h2 className="text-lg font-semibold">{item.title}</h2>
                  <p className="text-sm">Quantity: {item.quantity}</p>
                  <p className="text-sm font-medium">Price: ${item.totalPrice}</p>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-gray-500">No items in the cart</p>
      )}
      <button
        onClick={handleCheckout}
        className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
      >
        Proceed to Payment
      </button>
    </div>
  );
}
