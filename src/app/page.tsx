'use client';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from "./components/Navbar";
import { FaShoppingCart } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { sanityClient } from '@/sanity/lib/client';

interface Product {
  _id: string;
  title: string;
  image: {
      asset: {
          url: string;
      };
  };
}

interface Category {
  _id: string;
  title: string;
  image: {
      asset: {
          url: string;
      };
  };
}

const fetchData = async (): Promise<{ ourProducts: Product[], featuredProducts: Product[], topCategories: Category[] }> => {
  const query = `
    {
        "ourProducts": *[_type == "products"] {
            _id,
            title,
            image {
                asset-> {
                    url
                }
            }
        },
        "featuredProducts": *[_type == "products"] {
            _id,
            title,
            image {
                asset-> {
                    url
                }
            }
        },
        "topCategories": *[_type == "categories"] {
            _id,
            title,
            image {
                asset-> {
                    url
                }
            }
        }
    }
`;

  const data = await sanityClient.fetch(query);
  return data;
};

export default function Home() {
  const [cartCount, setCartCount] = useState(0);
  const [ourProducts, setOurProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [topCategories, setTopCategories] = useState<Category[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleAddToCart = () => {
    setCartCount(prevCount => prevCount + 1);
  };

  useEffect(() => {
    const getData = async () => {
        const data = await fetchData();
        setOurProducts(data.ourProducts);
        setFeaturedProducts(data.featuredProducts);
        setTopCategories(data.topCategories);
    };
    getData();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (dropdownOpen && !target.closest('.dropdown')) {
        setDropdownOpen(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="w-full h-20 bg-[#F0F2F3] py-4 px-4 md:px-6 flex justify-between items-center md:px-20 lg:px-40">
        <Image src="/logo-sofa.png" alt="logo" width={166} height={40} />
        
        <Link href="/product1">
          <button 
            className="w-28 h-10 bg-white rounded-md flex items-center justify-center relative"
            onClick={handleAddToCart}
          >
            <FaShoppingCart className="text-black mr-2" />
            <p className="text-black">Cart</p>
            <div className="absolute top-0 right-0 w-6 h-6 rounded-full bg-[#007580] text-white text-xs flex items-center justify-center">
              {cartCount}
            </div>
          </button>
        </Link>
      </div>

      <div className="md:hidden flex justify-between items-center px-4 py-4">
        <button onClick={toggleMenu} className="text-[#007580]">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white w-full p-4">
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
      {/* Main Content Section with Text and Image */}
      <div className='w-full max-w-6xl mx-auto px-4 py-8 bg-[#F0F2F3] flex flex-col md:flex-row rounded-lg mt-6'>
        {/* Left side: Text and heading */}
        <div className='flex-1 flex flex-col justify-center px-4'>
          <p className='font-inter text-sm text-[#272343]'>
            WELCOME TO 
          </p>
          <h1 className='font-inter font-bold text-2xl md:text-4xl text-[#272343]'>
            Best Furniture Collection For Your Interior
          </h1>
          <button className='w-40 h-12 bg-[#029FAE] text-white rounded-md mt-6 flex justify-center items-center'>
            Shop Now
            <span className="ml-2">→</span>
          </button>
        </div>

        {/* Right side: Image */}
        <div className='flex-1 flex justify-center mt-8 md:mt-0'>
          <Image src="/Product Image.png" alt="chair" width={434} height={584} className="max-w-full h-auto" />
        </div>
      </div>

      {/* Company Logo Section */}
      <div className='w-full max-w-6xl mx-auto bg-white py-8'>
    {/* Company Logo */}
    <Image src="/Company Logo.png" alt="logo" width={1321} height={139} className="mx-auto" />

    

{/* Featured Products Section */}
<div className="w-full max-w-6xl mx-auto px-4 py-8">
  <h2 className="text-2xl font-bold text-[#272343]">Featured Products</h2>
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
    {featuredProducts.map((product) => (
      <Link key={product._id} href={`/product/${product._id}`} className="border p-4 rounded-lg block">
        <Image src={product.image.asset.url} alt={product.title} width={400} height={400} />
        <p className="mt-2 font-medium">{product.title}</p>
      </Link>
    ))}
  </div>
</div>

{/* Top Categories Section */}
<div className="w-full max-w-6xl mx-auto px-4 py-8">
  <h2 className="text-2xl font-bold text-[#272343]">Top Categories</h2>
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
    {topCategories.map((category) => (
      <Link key={category._id} href={`/category/${category._id}`} className="border p-4 rounded-lg block">
        <Image src={category.image.asset.url} alt={category.title} width={400} height={400} />
        <p className="mt-2 font-medium">{category.title}</p>
      </Link>
    ))}
  </div>
</div>

{/* Our Products Section */}
<div className="w-full max-w-6xl mx-auto px-4 py-8">
  <h2 className="text-2xl font-bold text-[#272343]">Our Products</h2>
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
    {featuredProducts.map((product) => (
      <Link key={product._id} href={`/product/${product._id}`} className="border p-4 rounded-lg block">
        <Image src={product.image.asset.url} alt={product.title} width={400} height={400} />
        <p className="mt-2 font-medium">{product.title}</p>
      </Link>
    ))}
  </div>
</div>
</div>



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
