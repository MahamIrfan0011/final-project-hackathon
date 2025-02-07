'use client';
import Link from 'next/link';
import { SignedIn, SignedOut, SignUp, useUser } from "@clerk/nextjs";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter for redirection

const ProfilePage = () => {
  const { user } = useUser(); // Use Clerk's useUser hook to check auth state
  const router = useRouter(); // Initialize router for redirection
  
  // Redirect user to the main page after signing in
  useEffect(() => {
    if (user) {
      // Redirect to the main page (or any page you prefer)
      router.push('/'); // Redirects to the home page
    }
  }, [user, router]);

  return (
    <div>
      {/* Show SignUp form when user is signed out */}
      <SignedOut>
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <div className="bg-white p-6 rounded-md shadow-md">
            <h1 className="text-xl font-bold mb-4 text-center">Sign Up</h1>
            {/* SignUp Component with hash-based routing */}
            <SignUp routing="hash" />
          </div>
        </div>
      </SignedOut>

      {/* Show profile info when user is signed in */}
      <SignedIn>
        {/* Here, we can show some basic profile info or a logout button if desired */}
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <div className="bg-white p-6 rounded-md shadow-md">
           
            {/* You can add other user profile details here */}
            <Link href="/">Go to Home</Link> {/* Home page link */}
          </div>
        </div>
      </SignedIn>
    </div>
  );
};

export default ProfilePage;


