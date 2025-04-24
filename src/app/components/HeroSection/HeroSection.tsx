"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <div className="relative pt-48 pb-12 bg-black xl:pt-60 sm:pb-16 lg:pb-32 xl:pb-48 2xl:pb-56">
    {/* // <div className="relative h-screen w-screen max-w-[1920px] max-h-[1080px] overflow-hidden bg-black"> */}
    {/* // <div className="relative h-screen w-screen bg-black overflow-hidden"> */}
      {/* Header with Navigation */}
      <header className="absolute inset-x-0 top-0 z-10 py-8 xl:py-12">
        <div className="px-6 mx-auto sm:px-8 lg:px-12 max-w-7xl">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex flex-shrink-0">
              <Link href="/" className="inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-4 focus:ring-offset-secondary focus:ring-primary">
                <Image
                  src="/images/spice logo.png"
                  alt="Logo"
                  width={200}
                  height={180}
                  className="w-auto h-8"
                />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                type="button"
                className="p-2 -m-2 transition-all duration-200 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary focus:ring-offset-secondary"
                aria-label="Open mobile menu"
              >
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-10 lg:ml-28">
              <Link
                href="/courses"
                className="font-sans text-base font-normal transition-all duration-200 rounded text-white focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary focus:ring-offset-secondary hover:text-primary"
              >
                Courses
              </Link>

              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-5 py-2 font-sans text-base font-normal leading-7 transition-all duration-200 border-2 rounded-full text-white border-primary hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary focus:ring-offset-secondary"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/annie-spratt-cVEOh_JJmEE-unsplash.jpg"
          alt="Background"
          fill
          className="object-cover w-full h-full"
          priority
        />
      </div>

      {/* Hero Content */}
      <div className="relative">
        <div className="px-6 mx-auto sm:px-8 lg:px-12 max-w-7xl">
          <div className="w-full lg:w-2/3 xl:w-1/2">
            <h1 className="font-sans text-base font-normal tracking-tight text-white/70">
              Data Analytics for Health
            </h1>
            
            <p className="mt-6 tracking-tighter text-white">
              <span className="font-sans font-normal text-7xl">The road to the</span>
              <br />
              <span className="font-serif italic font-normal text-8xl">perfect loaf</span>
            </p>
            
            <p className="mt-12 font-sans text-base font-normal leading-7 text-white/70">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eu penatibus pellentesque dolor consequat ligula egestas massa gravida. Porttitor venenatis enim praesent.
            </p>
            
            <p className="mt-8 font-sans text-xl font-normal text-white">
              Starting at $9.99/month
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center mt-5 space-x-3 sm:space-x-4">
              <Link
                href="/get-started"
                className="inline-flex items-center justify-center px-5 py-2 font-sans text-base font-semibold transition-all duration-200 border-2 border-transparent rounded-full sm:leading-8 bg-white sm:text-lg text-black hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-secondary"
              >
                Get started
              </Link>

              <Link
                href="/trailer"
                className="inline-flex items-center justify-center px-5 py-2 font-sans text-base font-semibold transition-all duration-200 bg-transparent border-2 rounded-full sm:leading-8 text-white border-primary hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:text-lg focus:ring-offset-secondary"
              >
                <svg
                  className="w-6 h-6 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.0416 4.9192C7.37507 4.51928 6.5271 4.99939 6.5271 5.77669L6.5271 18.2232C6.5271 19.0005 7.37507 19.4806 8.0416 19.0807L18.4137 12.8574C19.061 12.469 19.061 11.5308 18.4137 11.1424L8.0416 4.9192Z"
                  />
                </svg>
                Watch trailer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;