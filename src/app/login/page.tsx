'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const SignIn = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log(data);
    };

  return (
    <div className="flex h-screen font-[Playfair Display]">
      {/* Left Section - Form */}
      <div className="w-1/2 flex flex-col justify-center items-center px-10">
        {/* Logo */}
        <div className="mb-6">
          <Image src="/images/spice logo.png" alt="Logo" width={100} height={90} />
        </div>
        
        {/* Sign-in Form */}
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-2">Welcome Back!</h2>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
          <h3 className="text-lg font-medium mb-6">Please enter your details</h3>
            <div className="text-left">
              <label className="block text-md font-medium mb-2">Email</label>
              <input type="email" placeholder="Enter your email" className="w-[404px] h-[32px] p-3 border rounded-xl border-grey-200 bg-[#EDF2F7]" onChange={handleChange} />
            </div>
            <div className="text-left">
              <label className="block text-md font-medium mb-2">Password</label>
              <input type="password" placeholder="Enter your password" className="w-[404px] h-[32px] p-3 border rounded-xl border-grey-200 bg-[#EDF2F7]" onChange={handleChange} />
            </div>
            <div className="text-left">
              <a href="#" className="text-md text-blue-600 hover:underline">Forgot your password?</a>
            </div>
            
            <button className="w-[404px] h-[32px] mt-4 bg-[#3A5B22] font-semibold text-white rounded-xl">Sign In</button>
          </form>

          <p className="mt-6 text-justify-center text-md">
            Dont have an account? <Link href="/signup" className="w-[404px] h-[35.4px] text-blue-600 font-bold">Sign up</Link>
          </p>
          {/* <h2 className="text-red-500">Test Tailwind</h2> */}
        </div>
      </div>
      
      {/* Right Section - Image */}
      <div className="w-1/2 hidden md:flex items-center justify-center bg-[#ECECEC] rounded-2xl">
        <Image src="/images/signin.jpg" alt="Sign In" width={780} height={600} className="rounded-2xl" />
      </div>
    </div>
  );
};

export default SignIn;
