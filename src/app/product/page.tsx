
'use client'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaCartPlus, FaTrashAlt, FaPlus, FaMinus } from 'react-icons/fa';
import sanityClient from '@sanity/client';
import { FaShoppingCart } from 'react-icons/fa'; 
// Sanity Client Setup
const client = sanityClient({
  projectId: 'bkrzw7t0',
  dataset: 'production',
  apiVersion: '2023-01-01',
  useCdn: true,
});

const ProductsPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("/api/getProducts");
      const data = await response.json();
      setProducts(data);
    };
    fetchProducts();
  }, []);
};

export default function Home() {
  const router = useRouter(); // Initialize router
  const [products, setProducts] = useState<any[]>([]); 
  const [cartProducts, setCartProducts] = useState<any[]>([]); 
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const query = `*[_type == "products"]{
        _id,
        title,
        price,
        discount,
        "image":image.asset->url,
      }`;
      const result = await client.fetch(query);
      setProducts(result);
    };

    fetchProducts();
  }, []);

  const addToCart = (product: any) => {
    setCartProducts((prevCartProducts) => {
      let updatedCart;

      // Agar product cart mein already nahi hai, to add karein
      if (!prevCartProducts.find((item) => item._id === product._id)) {
        updatedCart = [
          ...prevCartProducts,
          {
            ...product,
            quantity: 1,
            totalPrice: product.price,
            shipmentStatus: "Processing", // Removed tracking number
          },
        ];
      } else {
        updatedCart = prevCartProducts;
      }

      // Cart ko localStorage mein save karein
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });

    setIsCartOpen(true);
  };

  const incrementQuantity = (id: string) => {
    setCartProducts((prevCartProducts) =>
      prevCartProducts.map((item) =>
        item._id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
              totalPrice: (item.quantity + 1) * item.price,
            }
          : item
      )
    );
  };

  const decrementQuantity = (id: string) => {
    setCartProducts((prevCartProducts) =>
      prevCartProducts.map((item) =>
        item._id === id && item.quantity > 1
          ? {
              ...item,
              quantity: item.quantity - 1,
              totalPrice: (item.quantity - 1) * item.price,
            }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartProducts((prevCartProducts) =>
      prevCartProducts.filter((item) => item._id !== id)
    );
  };

  const calculateTotalPrice = () =>
    cartProducts.reduce((total, item) => total + item.totalPrice, 0);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="w-full h-20 bg-[#F0F2F3] py-4 px-4 md:px-6 flex justify-between items-center md:px-20 lg:px-40">
        <Image src="/logo-sofa.png" alt="logo" width={166} height={40} />
        <div className="relative">
      {/* Cart Button with Icon, Badge, and Dynamic Count */}
      <button
        onClick={() => setIsCartOpen(!isCartOpen)} // Toggle cart visibility
        className="w-28 h-10 bg-white rounded-md flex items-center justify-center relative"
      >
        <FaShoppingCart className="text-black mr-2" /> {/* Cart Icon */}
        <p className="text-black">Cart</p>
        
        {/* Badge Circle with Dynamic Count */}
        <div className="absolute top-0 right-0 w-6 h-6 rounded-full bg-[#007580] text-white text-xs flex items-center justify-center">
          {cartProducts.length} {/* Dynamically updated count */}
        </div>
      </button>
    </div>
    </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white shadow-2xl rounded-lg p-4 flex flex-col items-center"
          >
            <Image
              src={product.image}
              alt={product.title}
              width={150}
              height={150}
              className="rounded-lg cursor-pointer"
              onClick={() => router.push(`/product/${product._id}`)} // Correct route for dynamic page
            />
            <h2 className="mt-2 font-bold">{product.title}</h2>
            <p className="text-gray-700">Price: ${product.price}</p>
            {product.discount && (
              <p className="text-green-500">Discount: {product.discount}%</p>
            )}
            <button
              onClick={() => addToCart(product)}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg"
            >
              <FaCartPlus className="inline-block mr-2" /> Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Always Visible Proceed to Checkout Button */}
      {cartProducts.length > 0 && (
        <div className="fixed bottom-5 right-5">
          <button
            onClick={() => router.push('/checkout')}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg"
          >
            Proceed to Checkout
          </button>
        </div>
      )}

      {/* Cart Modal (if open) */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-96 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
            <div>
              {cartProducts.map((item) => (
                <div key={item._id} className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={50}
                      height={50}
                      className="rounded-lg"
                    />
                    <span className="ml-4">{item.title}</span>
                  </div>
                  <div className="flex items-center">
                    <button onClick={() => decrementQuantity(item._id)} className="px-2">
                      <FaMinus />
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button onClick={() => incrementQuantity(item._id)} className="px-2">
                      <FaPlus />
                    </button>
                  </div>
                  <span className="text-lg font-bold">${item.totalPrice.toFixed(2)}</span>
                  <button onClick={() => removeItem(item._id)} className="ml-4">
                    <FaTrashAlt />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-xl font-bold">Total: ${calculateTotalPrice().toFixed(2)}</span>
            </div>

            {/* Removed Shipment Tracking Info */}

            {/* Separate button container for "Proceed to Checkout" and "Close" */}
            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={() => router.push('/checkout')}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-2"
              >
                Proceed to Checkout
              </button>
              <button
                onClick={() => setIsCartOpen(false)}
                className="bg-blue-500 text-white px-3 py-2 rounded-lg w-20"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  
  );
}

