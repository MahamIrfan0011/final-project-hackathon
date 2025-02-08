'use client';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from "../components/Navbar";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
const [dropdownOpen, setDropdownOpen] = useState(false);

const toggleMenu = () => {
  setIsMenuOpen(!isMenuOpen);
};


  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
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
<div className="md:hidden flex justify-between items-center px-4">
        <button onClick={toggleMenu} className="text-[#007580]">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>

      
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-white w-full px-4">
          <ul className="space-y-4 text-center">
            <li><Link href="/" className="block text-[#007580]">Home</Link></li>
            <li><Link href="/product" className="block text-[#007580]">Shop</Link></li>
            <li><Link href="/product" className="block text-[#007580]">Product</Link></li>
            <li><Link href="/" className="block text-[#007580]">Pages</Link></li>
            <li><Link href="/about" className="block text-[#007580]">About</Link></li>
            <li><Link href="/contact" className="block text-[#007580]">Contact</Link></li>
            <li className="relative dropdown">
              <button
                className="block text-[#007580] flex items-center justify-center"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                Eng
                <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {dropdownOpen && (
                <ul className="absolute top-8 left-0 bg-white text-[#272343] shadow-lg rounded-md w-full">
                  {['English', 'Spanish', 'French', 'Japanese', 'Arabic'].map((language, index) => (
                    <li key={index} className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                      {language}
                    </li>
                  ))}
                </ul>
              )}
            </li>
            <li><Link href="/faqs" className="block text-[#007580]">FAQs</Link></li>
            <li className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 flex items-center justify-center rounded-full border border-[#007580] text-[#007580] font-bold text-xs">
                !
              </div>
              <button className="text-[#007580]">Need Help</button>
            </li>
          </ul>
        </div>
      )}

      <div className="w-full h-18 bg-white flex text-[#636270] hidden md:flex pr-40">
        <ul className="w-full flex flex-wrap justify-center space-x-4 md:space-x-8">
          <li className="cursor-pointer text-[#007580]">
            <Link href="/">Home</Link>
          </li>
          <li className="cursor-pointer hover:text-[#007580]">
            <Link href="/product">Shop</Link>
          </li>
          <li className="cursor-pointer hover:text-[#007580]">
            <Link href="/product">Product</Link>
          </li>
          <li className="cursor-pointer hover:text-[#007580]">
            <Link href="/">Pages</Link>
          </li>
          <li className="cursor-pointer hover:text-[#007580]">
            <Link href="/about">About</Link>
          </li>
        </ul>
        <div className='ml-auto flex items-center'>
          <p className='font-normal text-sm text-[#636270] mr-2'>Contact:</p>
          <Link href="/contact" className='font-medium text-sm text-[#272343] lg:whitespace-nowrap mr-4'>
            (808) 555-0111
          </Link>
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
              className="rounded-lg cursor-pointer transition-transform duration-300 hover:scale-105" 
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
      {/* Footer Section */}
            <div className="flex flex-col h-full mt-auto">
              {/* Main Content */}
              <div className="flex-grow">
                <div className="bg-white w-full flex flex-col md:flex-row items-start justify-around p-4">
                  {/* Logo and Paragraph Section */}
                  <div className="flex flex-col items-center mb-4">
                    <Image src="/logo-sofa.png" alt="logo" width={128} height={20} />
                    <p className="font-inter text-center text-sm text-[#272343] mt-4 leading-6">
                      Vivamus tristique odio sit amet<br /> velit semper, eu posuere turpis<br />  
                    </p>
                    <Image src="/Social Links.png" alt="social accounts" width={206} height={38} className='mt-4'/>
                  </div>
      
                  {/* CATEGORY Section */}
                  <div className="mt-4">
                    <h4 className="font-inter font-medium text-sm leading-6 tracking-[3px] text-[#9A9CAA] mb-4">
                      CATEGORY
                    </h4>
                    <ul className="space-y-2 text-justify">
                      {['Sofa', 'Armchair', 'Wing Chair', 'Desk Chair', 'Wooden Chair', 'Park Bench'].map(category => (
                        <li key={category} className="font-inter font-normal text-sm leading-6 text-[#272343] hover:text-black cursor-pointer">
                          {category}
                        </li>
                      ))}
                    </ul>
                  </div>
      
                  {/* SUPPORT Section */}
                  <div className="mt-4">
                    <h4 className="font-inter font-medium text-sm leading-6 tracking-[3px] text-[#9A9CAA] mb-4">
                      SUPPORT
                    </h4>
                    <ul className="space-y-2 text-justify">
                      {['Help & Support', 'Terms & Conditions', 'Privacy Policy', 'Help'].map(support => (
                        <li key={support} className="font-inter font-normal text-sm leading-6 text-[#272343] hover:text-black cursor-pointer">
                          {support}
                        </li>
                      ))}
                    </ul>
                  </div>
      
                  {/* NEWSLETTER Section */}
                  <div className="mt-4 mr-2">
                    <h4 className="font-inter font-medium text-sm text-[#9A9CAA]">
                      NEWSLETTER
                    </h4>
                    <div className="mt-2 flex">
                      <input 
                        type="email" 
                        id="email" 
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        placeholder="Your email"
                      />
                      <button className="w-32 h-10 bg-[#029FAE] text-white text-sm font-inter font-semibold rounded-md">
                        Subscribe
                      </button>
                    </div>
                    <p className="font-inter text-sm text-[#272343] text-justify mt-2">
                      Lorem, ipsum dolor sit amet consectetur adipisicing elit<br />. 
                    </p>
                  </div>
                </div>
              </div>
      
              {/* Footer Section */}
              <footer className="w-full flex items-center justify-center bg-white px-4 mt-auto">
        <div className="flex w-full items-center justify-between flex-col lg:flex-row mr-6">
          {/* Text on the first line for mobile, second line for large devices */}
          <p className="font-Poppins text-sm text-[rgba(0,0,0,0.6)] whitespace-nowrap pl-6 lg:pl-16 mb-4 lg:mb-0 mr-4">
            @2021-Blogy-Designed & Developed 
            <span className="block lg:inline font-bold">by Zakirsoft</span> {/* Make Zakirsoft appear on the next line on mobile */}
          </p>
          
          {/* Image on the second line for mobile, same line for large devices */}
          <Image src="/Group 13 (1).png" alt="accounts" width={227} height={27} />
        </div>
      </footer>
            </div>
          </div>
          
    
  );
}
