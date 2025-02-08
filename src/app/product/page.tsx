'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaCartPlus, FaTrashAlt, FaShoppingCart, FaTimes, FaCreditCard, FaPlus, FaMinus } from 'react-icons/fa';
import { createClient } from '@sanity/client';

// Define Product Type
interface Product {
  _id: string;
  title: string;
  price: number;
  discount?: number;
  image: string;
}

// Define Cart Product Type
interface CartProduct extends Product {
  quantity: number;
  totalPrice: number;
  shipmentStatus: string;
}

// Sanity Client Setup
const client = createClient({
  projectId: 'bkrzw7t0',
  dataset: 'production',
  apiVersion: '2023-01-01',
  useCdn: false,
});

export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [cartProducts, setCartProducts] = useState<CartProduct[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Fetch products from Sanity
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const query = `*[_type == "products"]{
          _id,
          title,
          price,
          discount,
          "image": image.asset->url
        }`;
        const result: Product[] = await client.fetch(query);
        setProducts(result);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCartProducts(JSON.parse(storedCart));
    }
  }, []);

  // Persist cart changes to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartProducts));
  }, [cartProducts]);

  // Add to Cart Function
  const addToCart = (product: Product) => {
    setCartProducts((prevCartProducts) => {
      const existingProductIndex = prevCartProducts.findIndex((item) => item._id === product._id);
      
      if (existingProductIndex > -1) {
        const updatedCart = [...prevCartProducts];
        updatedCart[existingProductIndex] = {
          ...updatedCart[existingProductIndex],
          quantity: updatedCart[existingProductIndex].quantity + 1,
          totalPrice: (updatedCart[existingProductIndex].quantity + 1) * product.price
        };
        return updatedCart;
      } else {
        return [
          ...prevCartProducts,
          { 
            ...product, 
            quantity: 1, 
            totalPrice: product.price, 
            shipmentStatus: "Processing" 
          }
        ];
      }
    });

    setIsCartOpen(true);
  };

  // Increase Quantity
  const increaseQuantity = (id: string) => {
    setCartProducts((prevCartProducts) =>
      prevCartProducts.map((item) =>
        item._id === id
          ? { ...item, quantity: item.quantity + 1, totalPrice: (item.quantity + 1) * item.price }
          : item
      )
    );
  };

  // Decrease Quantity
  const decreaseQuantity = (id: string) => {
    setCartProducts((prevCartProducts) =>
      prevCartProducts.map((item) =>
        item._id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1, totalPrice: (item.quantity - 1) * item.price }
          : item
      ).filter(item => item.quantity > 0) // اگر quantity 0 ہو جائے تو remove کر دیں۔
    );
  };

  // Remove Item from Cart
  const removeItem = (id: string) => {
    setCartProducts((prevCartProducts) => 
      prevCartProducts.filter((item) => item._id !== id)
    );
  };

  // Calculate Total Price
  const totalPrice = cartProducts.reduce((total, item) => total + item.totalPrice, 0);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navigation Header */}
      <div className="w-full h-20 bg-[#F0F2F3] py-4 px-4 md:px-6 flex justify-between items-center md:px-20 lg:px-40">
        <Image src="/logo-sofa.png" alt="logo" width={166} height={40} />
        <div className="relative">
          <button 
            onClick={() => setIsCartOpen(!isCartOpen)} 
            className="w-28 h-10 bg-white rounded-md flex items-center justify-center relative"
          >
            <FaShoppingCart className="text-black mr-2" />
            <p className="text-black">Cart</p>
            <div className="absolute top-0 right-0 w-6 h-6 rounded-full bg-[#007580] text-white text-xs flex items-center justify-center">
              {cartProducts.length}
            </div>
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {products.map((product) => (
          <div key={product._id} className="bg-white shadow-2xl rounded-lg p-4 flex flex-col items-center">
            <Image 
              src={product.image} 
              alt={product.title} 
              width={150} 
              height={150} 
              className="rounded-lg cursor-pointer" 
              onClick={() => router.push(`/product/${product._id}`)} 
            />
            <h2 className="mt-2 font-bold">{product.title}</h2>
            <p className="text-gray-700">Price: ${product.price}</p>
            <button 
              onClick={() => addToCart(product)} 
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg"
            >
              <FaCartPlus className="inline-block mr-2" /> Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Shopping Cart</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-gray-500">
                <FaTimes size={20} />
              </button>
            </div>
            
            {cartProducts.map((item) => (
              <div key={item._id} className="flex justify-between items-center mb-4">
                <Image src={item.image} alt={item.title} width={50} height={50} className="rounded-lg" />
                <span>{item.title}</span>
                <div className="flex items-center">
                  <button onClick={() => decreaseQuantity(item._id)}><FaMinus /></button>
                  <span className="mx-2">{item.quantity}</span>
                  <button onClick={() => increaseQuantity(item._id)}><FaPlus /></button>
                </div>
                <span>${item.totalPrice.toFixed(2)}</span>
                <button onClick={() => removeItem(item._id)}><FaTrashAlt /></button>
              </div>
            ))}

            <div className="text-right font-bold text-lg">Total: ${totalPrice.toFixed(2)}</div>

            <button onClick={() => router.push('/checkout')} className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg">
              <FaCreditCard className="mr-2" /> Checkout
            </button>

            <button onClick={() => setIsCartOpen(false)} className="w-full mt-2 bg-gray-500 text-white py-2 rounded-lg">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
