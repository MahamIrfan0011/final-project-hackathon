'use client'
import Image from 'next/image';
import Link from 'next/link';
import Navbar from "../components/Navbar";
import { FaShoppingCart } from 'react-icons/fa'; // Importing the shopping cart icon
import { useState } from 'react';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); 

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle menu open/close
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      {/* Top Section with Logo and Cart Button */}
      <div className="w-full h-20 bg-[#F0F2F3] py-4 px-4 md:px-6 flex justify-between items-center md:px-20 lg:px-40">
        <Image src="/logo-sofa.png" alt="logo" width={166} height={40} />
        
        {/* Cart Button */}
        <Link href="/product1">
          <button className="w-28 h-10 bg-white rounded-md flex items-center justify-center relative">
            <FaShoppingCart className="text-black mr-2" /> {/* Cart Icon */}
            <p className="text-black">Cart</p>
            {/* Badge Circle with Number */}
            <div className="absolute top-0 right-0 w-6 h-6 rounded-full bg-[#007580] text-white text-xs flex items-center justify-center">
              2 {/* This is the number you can update */}
            </div>
          </button>
        </Link>
      </div>

      {/* Hamburger Menu for Mobile */}
      <div className="md:hidden flex justify-between items-center px-4 py-4">
        <button onClick={toggleMenu} className="text-[#007580]">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>

      {/* Mobile Menu - Show when 'isMenuOpen' is true */}
      {isMenuOpen && (
        <div className="md:hidden bg-white w-full p-4">
          <ul className="space-y-4 text-center">
            <li><Link href="/" className="block text-[#007580]">Home</Link></li>
            <li><Link href="/product" className="block text-[#007580]">Shop</Link></li>
            <li><Link href="/product" className="block text-[#007580]">Product</Link></li>
            <li><Link href="/" className="block text-[#007580]">Pages</Link></li>
            <li><Link href="/about" className="block text-[#007580]">About</Link></li>
            <li><Link href="/contact" className="block text-[#007580]">Contact</Link></li>
            <li className="relative">
    <button
      className="block text-[#007580] flex items-center justify-center"
      onClick={() => setDropdownOpen(!dropdownOpen)}
    >
      Eng
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="ml-2 h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    {dropdownOpen && (
      <ul className="absolute top-8 left-0 bg-white text-[#272343] shadow-lg rounded-md w-full">
        <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">English</li>
        <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">Spanish</li>
        <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">French</li>
        <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">Japanese</li>
        <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">Arabic</li>
      </ul>
    )}
  </li>

  {/* FAQs */}
  <li>
    <Link href="/faqs" className="block text-[#007580]">
      FAQs
    </Link>
  </li>

  {/* Need Help */}
  <li className="flex items-center justify-center space-x-2">
    <div className="w-5 h-5 flex items-center justify-center rounded-full border border-[#007580] text-[#007580] font-bold text-xs">
      !
    </div>
    <button className="text-[#007580]">Need Help</button>
  </li>
  <li className="mt-4">
              <Link href="/product1">
                
              </Link>
            </li>
</ul>

            {/* Cart Button in Mobile Menu */}
            
        
        </div>
        
      )}

      {/* Navigation Bar with clickable items */}
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

      <div className="flex flex-col items-center">
        {/* About Us Section */}
        <div className="flex flex-col md:flex-row items-start w-full max-w-7xl mt-10">
          {/* Text Content */}
          <div className="w-[200px] ml-1 md:w-[480px] h-[370px] bg-[#007580] mx-4 p-6 lg:ml-32 w-full">
            <h1 className="font-inter font-bold text-[32px] text-white">
              About Us - Comforty
            </h1>
            <p className="font-inter text-[18px] text-white mt-4">
              At Comforty, we believe that the right chair can transform your space and elevate your comfort. Specializing in ergonomic design, premium materials, and modern aesthetics, we craft chairs that seamlessly blend style with functionality.
            </p>
            <button className="w-[150px] h-[40px] rounded-md mt-6 bg-[#52959b] text-white font-inter text-[16px] lg:w-[179px] h-[56px]">
              View Collection
            </button>
          </div>
          {/* Image */}
          <div className="mx-2 mr-6 mt-6 md:mt-0 md:ml-auto lg:mr-28">
            <Image
              src="/Image Block.png"
              alt="chair"
              width={480}
              height={380}
              className="rounded-lg"
            />
          </div>
        </div>

        {/* Section Title */}
        <h1 className="font-semibold text-[28px] mr-4 lg:text-[32px] font-inter text-[#272343] text-center mt-24">
          What Makes Our Brand Different
        </h1>

        {/* Full-Width Image */}
        <div className="w-full mt-10">
          <Image
            src="/Group 163.png"
            alt="picture"
            width={1320}
            height={244}
            className="w-full h-auto"
          />
        </div>
      </div>

      <div className='w-full mt-8'>
        <h4 className='font-inter font-semibold text-[28px] mr-4 lg:text-[32px] text-[#272343] text-center'>
          Our Popular Products
        </h4>
        <div className='flex flex-col md:flex-row justify-center mt-4 pr-12'>
          <Image src="/Product Card.png" alt="sofa" width={630} height={462} className='mx-4' />
          <Image src="/Product Card (1).png" alt="sofa" width={305} height={462} className='mx-4 mt-4 md:mt-0' />
          <Image src="/Product Card (2).png" alt="sofa" width={305} height={462} className='mx-4 mt-4 md:mt-0' />
        </div>
      </div>

      <div className="flex flex-col h-screen -mt-32 ml-4 md:ml-16">
        {/* Main Content */}
        <div className="flex-grow">
          <div className="bg-white w-full h-auto flex flex-col md:flex-row items-start justify-center mr-8 mt-[182px]">
            {/* Logo and Paragraph Section */}
            <div className="w-full md:w-[350px] mt-16">
              <Image src="/logo-sofa.png" alt="logo" width={128} height={20} />
              <p className="font-inter font-regular text-[16px] text-[#272343] mt-4 leading-[28px] text-justify">
                Vivamus tristique odio sit amet<br /> velit semper, eu posuere turpis<br />  
              </p>
              <Image src="/Social Links.png" alt="social accounts" width={206} height={38} className='mt-4'/>
            </div>

            {/* CATEGORY Section */}
            <div className="ml-0 md:ml-12 mt-6 md:mt-16">
              <h4 className="font-inter font-medium text-[16px] leading-[18px] tracking-[3px] text-[#9A9CAA] mb-4">
                CATEGORY
              </h4>
              <ul className="space-y-2 text-justify">
                <li className="font-inter font-normal text-[14px] leading-[22px] text-[#272343] hover:text-black cursor-pointer">
                  Sofa
                </li>
                <li className="font-inter font-normal text-[14px] leading-[22px] text-[#272343] hover:text-black cursor-pointer">
                  Armchair
                </li>
                <li className="font-inter font-normal text-[14px] leading-[22px] text-[#272343] hover:text-black cursor-pointer">
                  Wing Chair
                </li>
                <li className="font-inter font-normal text-[14px] leading-[22px] text-[#007580] hover:text-black cursor-pointer underline underline-color-[#007580]">
                  Desk Chair
                </li>
                <li className="font-inter font-normal text-[14px] leading-[22px] text-[#272343] hover:text-black cursor-pointer">
                  Wooden Chair
                </li>
                <li className="font-inter font-normal text-[14px] leading-[22px] text-[#272343] hover:text-black cursor-pointer">
                  Park Bench
                </li>
              </ul>
            </div>

            {/* SUPPORT Section */}
            <div className="ml-0 md:ml-14 mt-6 md:mt-16">
              <h4 className="font-inter font-medium text-[16px] leading-[18px] tracking-[3px] text-[#9A9CAA] mb-4">
                SUPPORT
              </h4>
              <ul className="space-y-2 text-justify ml-6">
                <li className="font-inter font-normal text-[14px] leading-[22px] text-[#272343] hover:text-black cursor-pointer">
                  Help & Support
                </li>
                <li className="font-inter font-normal text-[14px] leading-[22px] text-[#272343] hover:text-black cursor-pointer whitespace-nowrap">
                  Terms & Conditions
                </li>
                <li className="font-inter font-normal text-[14px] leading-[22px] text-[#272343] hover:text-black cursor-pointer">
                  Privacy Policy
                </li>
                <li className="font-inter font-normal text-[14px] leading-[22px] text-[#272343] hover:text-black cursor-pointer">
                  Help
                </li>
              </ul>
            </div>

            {/* NEWSLETTER Section */}
            <div className="mt-4 mr-8 lg:mr-2">
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
    <p className="font-Poppins text-sm text-[rgba(0,0,0,0.6)] whitespace-nowrap pl-6 lg:pl-16 mb-4 lg:mb-0 mr-8">
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
