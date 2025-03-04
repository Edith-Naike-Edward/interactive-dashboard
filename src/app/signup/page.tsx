'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const SignUp = () => {
  const [formData, setFormData] = useState({ name: '', email: '', role: '', password: '',  organization: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        <div className="mb-2">
          <Image src="/images/spice logo.png"alt="Logo" width={90} height={90} />
        </div>
        
        {/* Sign-up Form */}
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-2">Create an account</h2>
          <p className="text-gray-600 mb-3">Please enter your details for sign up.</p>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="text-left">
              <label className="block text-sm font-medium mb-2">Name</label>
              <input type="text" placeholder="Enter your name" className="w-[404px] h-[32px] p-3 border rounded-xl border-grey-200 bg-[#EDF2F7] text-white-800 text-sm focus:border-white-300" onChange={handleChange} />
            </div>
            <div className="text-left">
              <label className="block text-sm font-medium mb-2">Email</label>
              <input type="email" placeholder="Enter your email" className="w-[404px] h-[32px] p-3 border rounded-xl border-grey-200 bg-[#EDF2F7] text-sm focus:border-white-300" onChange={handleChange} />
            </div>
            <div className="text-left">
              <label className="block text-sm font-medium mb-2">Role</label>
              <input type="text" placeholder="Enter your role" className="w-[404px] h-[32px] p-3 border rounded-xl border-grey-200 bg-[#EDF2F7] text-sm focus:border-white-300" onChange={handleChange} />
            </div>
            <div className="text-left">
              <label className="block text-sm font-medium mb-2">Organization</label>
              <input type="text" placeholder="Enter your organization" className="w-[404px] h-[32px] p-3 border rounded-xl border-grey-200 bg-[#EDF2F7] text-sm focus:border-white-300" onChange={handleChange} />
            </div>
            <div className="text-left">
              <label className="block text-sm font-medium mb-2">Password</label>
              <input type="password" placeholder="Enter your password" className="mb-2 w-[404px] h-[32px] p-3 border rounded-xl border-grey-200 bg-[#EDF2F7] text-sm focus:border-white-300" onChange={handleChange} />
            </div>
            
            {/* <div className="flex items-center">
              <input type="checkbox" id="terms" className="mr-2" />
              <label htmlFor="terms" className="text-sm">I agree to the <span className="font-semibold">terms & policy</span></label>
            </div> */}
            
            <button className="mb-4 w-[404px] h-[35px] bg-[#3A5B22] text-white font-bold rounded-lg">Sign up</button>
          </form>
          
          <p className="mt-4 text-md">
            Have an account? <Link href="/login" className="text-blue-600 font-bold">Sign in</Link>
          </p>
        </div>
      </div>
      
      {/* Right Section - Image */}
      <div className="w-1/2 hidden md:flex items-center justify-center bg-gray-100 rounded-lg">
        <Image src="/images/signup.jpg" alt="Sign Up" width={780} height={600} className="rounded-3xl" />
      </div>
    </div>
  );
};

export default SignUp;
