"use client";
import { useEffect, useState } from "react";

const SuccessPage: React.FC = () => {
  const [trackingNumber, setTrackingNumber] = useState<string | null>(null);

  useEffect(() => {
    // ✅ Retrieve cart data from localStorage
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    console.log("Cart Data in localStorage:", cart); // Debugging

    if (cart.length > 0 && cart[0].trackingNumber) {
      setTrackingNumber(cart[0].trackingNumber);
      console.log("Tracking Number Found:", cart[0].trackingNumber);
    } else {
      // Generate random tracking number if not found
      const randomTrackingNumber = `TRACK-${Math.floor(Math.random() * 10000)}`;
      setTrackingNumber(randomTrackingNumber);
      console.log("Generated Tracking Number:", randomTrackingNumber);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold text-green-600">Payment Successful!</h1>
      <p className="text-lg mt-4">Thank you for your purchase.</p>
      {trackingNumber && (
        <p className="mt-2 text-lg font-semibold">
          Your Tracking Number: <span className="text-blue-600">{trackingNumber}</span>
        </p>
      )}
    </div>
  );
};

export default SuccessPage;
