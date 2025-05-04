'use client';

import Head from 'next/head';
import { useEffect, useState, useRef } from 'react';

export default function Home() {
  const floatingDataRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [roles, setRoles] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedOrg, setSelectedOrg] = useState('Ministry of Health');
  const [sites, setSites] = useState<{site_id: number, name: string}[]>([]);
  // const [selectedSite, setSelectedSite] = useState<number | null>(null);
  const [selectedSite, setSelectedSite] = useState<string>(''); // Initialize as empty string

  // Add these state variables
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Login handler function
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:8000/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await response.json();
      
      // Store token and user data
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Close modal and update app state
      setIsLoginModalOpen(false);
      
      // You might want to add state management here for the logged in user
      console.log('Logged in user:', data.user);
      
      // Redirect or show success message
      alert('Login successful!');
      
    } catch (error) {
      console.error('Login error:', error);
      alert(error instanceof Error ? error.message : 'Login failed. Please try again.');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const name = (document.getElementById('signupName') as HTMLInputElement).value;
    const email = (document.getElementById('signupEmail') as HTMLInputElement).value;
    const password = (document.getElementById('signupPassword') as HTMLInputElement).value;
    const confirm = (document.getElementById('signupConfirm') as HTMLInputElement).value;
  
    if (password !== confirm) {
      alert("Passwords don't match!");
      return;
    }
    const siteId = selectedSite ? Number(selectedSite) : null;

    if (!selectedRole || !siteId) {
      alert("Please select both role and health facility");
      return;
    }
  
    try {
      const response = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          role: selectedRole,
          organisation: selectedOrg,
          password,
          site_id: siteId
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Signup failed');
      }
  
      const data = await response.json();
      setIsSignupModalOpen(false);
      alert("Account created successfully!");
    } catch (error) {
      console.error('Signup error:', error);
      
      // Type-safe error handling
      let errorMessage = 'Signup failed. Please try again.';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      alert(errorMessage);
    }
  };

  useEffect(() => {
    const loadSites = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/sites');
        if (!response.ok) throw new Error('Failed to load sites');
        const data = await response.json();
        console.log('Sites data:', data); 
        setSites(data);
      } catch (error) {
        console.error('Error loading sites:', error);
        alert('Failed to load health facilities. Please refresh the page.');
      }
    };
    loadSites();
  }, []);

  // Handle scroll event to change navbar style
  const toggleLoginModal = () => {
    setIsLoginModalOpen(!isLoginModalOpen);
    setIsSignupModalOpen(false);
  };
  
  const toggleSignupModal = () => {
    setIsSignupModalOpen(!isSignupModalOpen);
    setIsLoginModalOpen(false);
  };
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Add this useEffect to fetch roles and sites on component mount
useEffect(() => {
  // Fetch available roles
  fetch('http://localhost:8000/api/auth/roles')
    .then(res => res.json())
    .then(data => setRoles(data))
    .catch(err => console.error('Error fetching roles:', err));

  // Fetch available sites (you'll need to create this endpoint)
  fetch('http://localhost:8000/api/sites')
    .then(res => res.json())
    .then(data => setSites(data))
    .catch(err => console.error('Error fetching sites:', err));
}, []);

  useEffect(() => {

    // Generate floating data points in the header
    if (floatingDataRef.current) {
      const dataTypes = ['BP: 120/80', 'Glucose: 95', 'HR: 72', 'SpO2: 98%', 'Temp: 98.6°F'];
      
      for (let i = 0; i < 25; i++) {
        const dataPoint = document.createElement('div');
        dataPoint.className = 'data-point absolute flex items-center justify-center rounded-full font-semibold text-white shadow-[0_0_20px_rgba(255,255,255,0.3)]';
        dataPoint.style.left = `${Math.random() * 100}%`;
        dataPoint.style.bottom = `${Math.random() * 20}%`;
        dataPoint.style.width = `${Math.random() * 30 + 60}px`;
        dataPoint.style.height = `${Math.random() * 30 + 60}px`;
        dataPoint.style.animationDelay = `${Math.random() * 15}s`;
        dataPoint.textContent = dataTypes[Math.floor(Math.random() * dataTypes.length)];
        floatingDataRef.current.appendChild(dataPoint);
      }
    }

    // Create interactive chart
    if (chartRef.current) {
      const chart = chartRef.current;
      
      // Generate data points with some anomalies
      const generateDataPoints = () => {
        const points: {x: number, y: number, value: number, isAnomaly: boolean}[] = [];
        for (let i = 0; i < 20; i++) {
          const x = i * 40 + 40;
          
          // Generate a somewhat realistic glucose curve
          let y = 300 - (100 + Math.sin(i * 0.5) * 30 + Math.random() * 20);
          
          // Add some anomalies
          if (i === 7 || i === 15) {
            y = 300 - (180 + Math.random() * 20);
          }
          
          points.push({ x, y, value: Math.round(400 - y), isAnomaly: (i === 7 || i === 15) });
        }
        return points;
      };
      
      const dataPoints = generateDataPoints();
      
      // Create chart lines connecting the points
      for (let i = 0; i < dataPoints.length - 1; i++) {
        const line = document.createElement('div');
        line.className = 'chart-line absolute h-[2px] bg-[#2514BE] origin-left transition-[width] duration-500';
        
        const p1 = dataPoints[i];
        const p2 = dataPoints[i + 1];
        
        // Calculate length and angle of line
        const length = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
        const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
        
        line.style.width = `${length}px`;
        line.style.transform = `translate(${p1.x}px, ${p1.y}px) rotate(${angle}deg)`;
        
        chart.appendChild(line);
      }
      
      // Create chart points
      dataPoints.forEach(point => {
        const dataPoint = document.createElement('div');
        dataPoint.className = `chart-point absolute w-3 h-3 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)] transition-transform duration-300 ${
          point.isAnomaly ? 'bg-[#FF6B6B] animate-pulse' : 'bg-[#A9E5C7]'
        }`;
        dataPoint.style.left = `${point.x}px`;
        dataPoint.style.top = `${point.y}px`;
        
        const label = document.createElement('div');
        label.className = 'chart-label absolute bg-[#EFEEFA] px-4 py-2 rounded text-sm -translate-y-full opacity-0 transition-opacity duration-300 whitespace-nowrap';
        label.textContent = `Glucose: ${point.value} mg/dL ${point.isAnomaly ? '(Anomaly Detected!)' : ''}`;
        
        chart.appendChild(dataPoint);
        chart.appendChild(label);
        
        // Position the label above the point
        label.style.left = `${point.x}px`;
        label.style.top = `${point.y}px`;
      });
      
      // Make chart draggable
      let isDragging = false;
      let startX = 0, startY = 0;
      
      chart.addEventListener('mousedown', (e) => {
        isDragging = true;
        chart.style.cursor = 'grabbing';
        startX = e.pageX - chart.offsetLeft;
        startY = e.pageY - chart.offsetTop;
      });
      
      chart.addEventListener('mouseleave', () => {
        isDragging = false;
        chart.style.cursor = 'move';
      });
      
      chart.addEventListener('mouseup', () => {
        isDragging = false;
        chart.style.cursor = 'move';
      });
      
      chart.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - chart.offsetLeft;
        const y = e.pageY - chart.offsetTop;
        const moveX = (x - startX) * 2;
        const moveY = (y - startY) * 2;
        
        // Move all elements in the chart
        chart.childNodes.forEach(child => {
          if (child instanceof HTMLElement && child.className && 
              (child.className.includes('chart-point') || 
               child.className.includes('chart-line') || 
               child.className.includes('chart-label'))) {
            const left = parseInt(child.style.left || '0', 10);
            const top = parseInt(child.style.top || '0', 10);
            
            child.style.left = `${left + moveX}px`;
            child.style.top = `${top + moveY}px`;
            
            if (child.className.includes('chart-line')) {
              const transform = child.style.transform;
              const translateMatch = transform.match(/translate\(([^,]+)px,\s*([^)]+)px\)/);
              if (translateMatch) {
                const translateX = parseFloat(translateMatch[1]);
                const translateY = parseFloat(translateMatch[2]);
                const rotateMatch = transform.match(/rotate\(([^)]+)deg\)/);
                const rotate = rotateMatch ? rotateMatch[1] : '0';
                
                child.style.transform = `translate(${translateX + moveX}px, ${translateY + moveY}px) rotate(${rotate}deg)`;
              }
            }
          }
        });
        
        startX = x;
        startY = y;
      });

    }
  }, []);

  return (
    <>
      <Head>
        <title>Interactive Health Data Visualization Tool</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
        <style>{`
          @keyframes float {
            0% {
              opacity: 0;
              transform: translateY(0) scale(0.5);
            }
            10% {
              opacity: 1;
              transform: translateY(-10px) scale(1);
            }
            90% {
              opacity: 1;
              transform: translateY(-200px) scale(1);
            }
            100% {
              opacity: 0;
              transform: translateY(-220px) scale(0.5);
            }
          }
          .data-point {
            background-color: rgba(255, 255, 255, 0.4);
            animation: float 15s infinite linear;
          }
          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.7);
            }
            70% {
              box-shadow: 0 0 0 10px rgba(255, 107, 107, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(255, 107, 107, 0);
            }
          }
        `}</style>
      </Head>
      

      {/* Navigation Bar */}
      <nav
        className={`fixed w-full top-0 left-0 z-50 flex justify-between items-center py-4 px-8 transition-all ${
          isScrolled ? 'py-3 bg-white/95 backdrop-blur-md shadow-md' : 'bg-white shadow-sm'
        }`}
      >
        <a href="#" className="flex items-center gap-2 no-underline text-blue-800 font-serif font-bold text-xl">
          <div className="w-8 h-8 bg-blue-800 text-white rounded-lg flex items-center justify-center text-lg">🔍</div>
          <span>AfyaScope</span>
        </a>

        <div
          className={`flex items-center gap-8 ${isMobileMenuOpen ? 'flex absolute top-16 left-0 w-full bg-white flex-col py-4 shadow-xl' : 'hidden md:flex'}`}
        >
          <div className="flex flex-col md:flex-row gap-8 md:gap-8">
            <a href="#features" className="text-indigo-900 no-underline font-medium hover:text-blue-800 transition-colors">
              Features
            </a>
            <a href="#architecture" className="text-indigo-900 no-underline font-medium hover:text-blue-800 transition-colors">
              Architecture
            </a>
            <a href="#data" className="text-indigo-900 no-underline font-medium hover:text-blue-800 transition-colors">
              Data Tables
            </a>
            <a href="#tools" className="text-indigo-900 no-underline font-medium hover:text-blue-800 transition-colors">
              Tools
            </a>
          </div>

          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto justify-center px-4 md:px-0">
            <button
              onClick={toggleLoginModal}
              className="px-6 py-2 border-2 border-blue-800 rounded-full text-blue-800 font-semibold bg-transparent hover:bg-blue-50 transition-all"
            >
              Log In
            </button>
            <button
              onClick={toggleSignupModal}
              className="px-6 py-2 rounded-full text-white font-semibold bg-gradient-to-r from-blue-800 to-indigo-600 hover:translate-y-[-2px] hover:shadow-lg transition-all"
            >
              Sign Up
            </button>
          </div>
        </div>

        <button
          onClick={toggleMobileMenu}
          className="text-indigo-900 bg-transparent border-none text-2xl md:hidden"
        >
          ☰
        </button>
      </nav>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center transition-opacity">
          <div className="bg-white p-8 rounded-xl w-full max-w-md shadow-xl transition-transform">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-serif">Log In</h3>
              <button onClick={toggleLoginModal} className="text-2xl bg-transparent border-none text-indigo-900">
                ×
              </button>
            </div>
            <form onSubmit={handleLogin}>
              <div className="mb-6">
                <label htmlFor="loginEmail" className="block mb-2 font-medium text-indigo-900">
                  Email Address
                </label>
                <input
                  type="email"
                  id="loginEmail"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-blue-100"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="loginPassword" className="block mb-2 font-medium text-indigo-900">
                  Password
                </label>
                <input
                  type="password"
                  id="loginPassword"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-blue-100"
                  placeholder="••••••••"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-800 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                Log In
              </button>
              <div className="text-center mt-6 text-sm">
                <p>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLoginModalOpen(false);
                      setIsSignupModalOpen(true);
                    }}
                    className="text-blue-800 font-semibold no-underline"
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {isSignupModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center transition-opacity">
          <div className="bg-white p-8 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl transition-transform">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-serif">Create Account</h3>
              <button onClick={toggleSignupModal} className="text-2xl bg-transparent border-none text-indigo-900">
                ×
              </button>
            </div>
            <form onSubmit={handleSignup}>
              <div className="mb-3">
                <label htmlFor="signupName" className="block mb-2 font-medium text-indigo-900">
                  Full Name
                </label>
                <input
                  type="text"
                  id="signupName"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-blue-100"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="signupEmail" className="block mb-2 font-medium text-indigo-900">
                  Email Address
                </label>
                <input
                  type="email"
                  id="signupEmail"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-blue-100"
                  placeholder="your@email.com"
                  required
                />
              </div>
              {/* Role dropdown */}
              <div className="mb-3">
                <label htmlFor="signupRole" className="block mb-2 font-medium text-indigo-900">
                  Role
                </label>
                <select
                  id="signupRole"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-blue-100"
                  required
                >
                  <option value="">Select a role</option>
                  {roles.map(role => (
                    // <option key={role} value={role}>{role}</option>
                    <option key={`role-${role}`} value={role}>
                    {role}
                  </option>
                  ))}
                </select>
              </div>
              
              {/* Organization dropdown */}
              <div className="mb-3">
                <label htmlFor="signupOrg" className="block mb-2 font-medium text-indigo-900">
                  Organization
                </label>
                <select
                  id="signupOrg"
                  value={selectedOrg}
                  onChange={(e) => setSelectedOrg(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-blue-100"
                  required
                >
                  <option value="Ministry of Health">Ministry of Health</option>
                  <option value="Faith-Based Organization">Faith-Based Organization</option>
                  <option value="Private Practice">Private Practice</option>
                  <option value="Private Hospital">Private Hospital</option>
                </select>
              </div>
            
              <div className="mb-3">
                <label htmlFor="signupSite" className="block mb-2 font-medium text-indigo-900">
                  Health Facility
                </label>
                <select
                  id="signupSite"
                  value={selectedSite ?? ''}
                  onChange={(e) => setSelectedSite(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-blue-100"
                  required
                >
                  <option value="">Select a health facility</option>
                  {sites.map(site => {
                    if (!site.site_id) {
                      console.error('Site without ID found:', site);
                      return null; // or handle this case appropriately
                    }
                    return (
                      <option key={`site-${site.site_id}`} value={site.site_id}>
                        {site.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="signupPassword" className="block mb-2 font-medium text-indigo-900">
                  Password
                </label>
                <input
                  type="password"
                  id="signupPassword"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-blue-100"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="mb-5">
                <label htmlFor="signupConfirm" className="block mb-2 font-medium text-indigo-900">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="signupConfirm"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-blue-100"
                  placeholder="••••••••"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-800 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                Create Account
              </button>
              <div className="text-center mt-6 text-sm">
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignupModalOpen(false);
                      setIsLoginModalOpen(true);
                    }}
                    className="text-blue-800 font-semibold no-underline"
                  >
                    Log In
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      )}

      <header className="relative h-[500px] flex items-center justify-center text-center overflow-hidden bg-gradient-to-br from-[#2514BE] to-[#675BD2] py-8 px-4 text-white">
        <div className="floating-data absolute w-full h-full top-0 left-0 pointer-events-none" ref={floatingDataRef}></div>
        <div className="header-content relative z-10 max-w-6xl mx-auto">
          <h1 className="font-playfair text-5xl md:text-6xl font-bold mb-6">Interactive Health Data Visualization & Analysis Tool</h1>
          <p className="subtitle text-xl md:text-2xl max-w-4xl mx-auto mb-8">
            An advanced system for generating, analyzing, and alerting on health data patterns with powerful visual analytics for Medtronic Labs
          </p>
          <a href="#learn-more" className="btn inline-block px-8 py-3 bg-[#2514BE] text-white rounded-full font-medium no-underline mt-4 transition-all duration-300 hover:bg-[#675BD2] hover:-translate-y-1">
            Learn More
          </a>
        </div>
      </header>

      <div className="container max-w-6xl mx-auto py-8 px-4" id="learn-more">
        <div className="card bg-white rounded-xl p-8 mb-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <h2 className="font-playfair text-3xl md:text-4xl text-[#2514BE] mb-6">About the Tool</h2>
          <p className="text-lg leading-relaxed mb-6">
            The Interactive Health Data Visualization and Analysis Tool is a test environment designed for Medtronic Labs. It supports healthcare professionals by simulating real-world health data, applying anomaly detection algorithms, and triggering alerts based on configured thresholds.
          </p>
          <p className="text-lg leading-relaxed">
            Our goal is to generate realistic, continuous, timestamped health data (hourly/daily), simulate real-world health behaviors, and flag anomalies via SMS/email alerts to improve patient outcomes and clinical decision making.
          </p>
        </div>

        <h2 className="font-playfair text-3xl md:text-4xl text-[#2514BE] mt-10 mb-6">System Architecture</h2>
        <div className="architecture-visual flex flex-wrap justify-between gap-4 my-8">
          <div className="arch-component flex-1 min-w-[300px] bg-white rounded-xl p-6 border-t-4 border-[#675BD2] relative shadow-lg">
            <h3 className="font-playfair text-2xl text-[#675BD2] mb-4">1. Data Generator</h3>
            <p className="text-base leading-relaxed">
              Uses Hybrid Rule-Based + Statistical Data Generation to create synthetic, timestamped health data with natural variability and medical logic.
            </p>
          </div>
          <div className="arch-component flex-1 min-w-[300px] bg-white rounded-xl p-6 border-t-4 border-[#675BD2] relative shadow-lg">
            <h3 className="font-playfair text-2xl text-[#675BD2] mb-4">2. Analytics Engine</h3>
            <p className="text-base leading-relaxed">
              Applies advanced anomaly detection using thresholds and statistical rules to identify potential health concerns.
            </p>
          </div>
          <div className="arch-component flex-1 min-w-[300px] bg-white rounded-xl p-6 border-t-4 border-[#675BD2] relative shadow-lg">
            <h3 className="font-playfair text-2xl text-[#675BD2] mb-4">3. Alert System</h3>
            <p className="text-base leading-relaxed">
              Sends SMS/email notifications when anomalies are detected to ensure timely intervention.
            </p>
          </div>
        </div>

        <h2 className="font-playfair text-3xl md:text-4xl text-[#2514BE] mt-10 mb-6">Interactive Data Visualization</h2>
        <p className="text-lg leading-relaxed mb-6">
          Move your cursor over the chart points to see details. You can drag the entire chart to explore different parts of the visualization.
        </p>
        <div className="chart-container relative h-[400px] my-12 cursor-move" ref={chartRef} id="interactiveChart">
          {/* Dynamic chart will be rendered here */}
        </div>

        <h2 className="font-playfair text-3xl md:text-4xl text-[#2514BE] mt-10 mb-6">Data Tables</h2>
        <p className="text-lg leading-relaxed mb-6">
          The system works with the following key data tables to generate comprehensive health insights:
        </p>
        <div className="data-tables flex flex-wrap gap-4 my-8">
          <div className="data-table flex-1 min-w-[300px] bg-white rounded-r-lg p-4 border-l-4 border-[#675BD2] transition-transform duration-300 hover:translate-x-2">
            <h3 className="font-playfair text-xl text-[#675BD2] mb-2">Patient</h3>
            <p className="text-base">Demographics and unique identifiers</p>
          </div>
          <div className="data-table flex-1 min-w-[300px] bg-white rounded-r-lg p-4 border-l-4 border-[#675BD2] transition-transform duration-300 hover:translate-x-2">
            <h3 className="font-playfair text-xl text-[#675BD2] mb-2">Glucoselog</h3>
            <p className="text-base">Blood sugar level records</p>
          </div>
          <div className="data-table flex-1 min-w-[300px] bg-white rounded-r-lg p-4 border-l-4 border-[#675BD2] transition-transform duration-300 hover:translate-x-2">
            <h3 className="font-playfair text-xl text-[#675BD2] mb-2">PatientDiagnosis</h3>
            <p className="text-base">Confirmed diagnoses records</p>
          </div>
        </div>
        <div className="data-tables flex flex-wrap gap-4 my-8">
          <div className="data-table flex-1 min-w-[300px] bg-white rounded-r-lg p-4 border-l-4 border-[#675BD2] transition-transform duration-300 hover:translate-x-2">
            <h3 className="font-playfair text-xl text-[#675BD2] mb-2">PatientLifeStyle</h3>
            <p className="text-base">Habits affecting health trends</p>
          </div>
          <div className="data-table flex-1 min-w-[300px] bg-white rounded-r-lg p-4 border-l-4 border-[#675BD2] transition-transform duration-300 hover:translate-x-2">
            <h3 className="font-playfair text-xl text-[#675BD2] mb-2">PatientMedicalReview</h3>
            <p className="text-base">Regular checkup data</p>
          </div>
          <div className="data-table flex-1 min-w-[300px] bg-white rounded-r-lg p-4 border-l-4 border-[#675BD2] transition-transform duration-300 hover:translate-x-2">
            <h3 className="font-playfair text-xl text-[#675BD2] mb-2">PatientMedicalCompliance</h3>
            <p className="text-base">Treatment adherence tracking</p>
          </div>
        </div>
        <div className="data-tables flex flex-wrap gap-4 my-8">
          <div className="data-table flex-1 min-w-[300px] bg-white rounded-r-lg p-4 border-l-4 border-[#675BD2] transition-transform duration-300 hover:translate-x-2">
            <h3 className="font-playfair text-xl text-[#675BD2] mb-2">Screeninglog</h3>
            <p className="text-base">Patient screening data</p>
          </div>
          <div className="data-table flex-1 min-w-[300px] bg-white rounded-r-lg p-4 border-l-4 border-[#675BD2] transition-transform duration-300 hover:translate-x-2">
            <h3 className="font-playfair text-xl text-[#675BD2] mb-2">Bplog</h3>
            <p className="text-base">Blood pressure readings</p>
          </div>
          <div className="data-table flex-1 min-w-[300px] bg-white rounded-r-lg p-4 border-l-4 border-[#675BD2] transition-transform duration-300 hover:translate-x-2">
            <h3 className="font-playfair text-xl text-[#675BD2] mb-2">Redrisk Notification</h3>
            <p className="text-base">High-risk patient tracking</p>
          </div>
        </div>

        <div className="indicators bg-white rounded-xl p-8 my-8 overflow-x-auto">
          <h2 className="font-playfair text-3xl md:text-4xl text-[#2514BE] mb-6">Health Data Indicators & Alert Thresholds</h2>
          <table className="w-full border-collapse my-6">
            <thead>
              <tr>
                <th className="p-4 text-left border-b bg-[#EFEEFA] text-[#1E1B3F] font-semibold">Indicator</th>
                <th className="p-4 text-left border-b bg-[#EFEEFA] text-[#1E1B3F] font-semibold">Performance Decline Threshold</th>
                <th className="p-4 text-left border-b bg-[#EFEEFA] text-[#1E1B3F] font-semibold">Alert Condition</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-[#F6FCF9]">
                <td className="p-4 border-b">% of Active Sites</td>
                <td className="p-4 border-b">Decline ≥5%</td>
                <td className="p-4 border-b">Email/SMS</td>
              </tr>
              <tr className="hover:bg-[#F6FCF9]">
                <td className="p-4 border-b">% of Active Users</td>
                <td className="p-4 border-b">&lt;5%</td>
                <td className="p-4 border-b">Email/SMS</td>
              </tr>
              <tr className="hover:bg-[#F6FCF9]">
                <td className="p-4 border-b">% New Diagnosis</td>
                <td className="p-4 border-b">&lt;50%</td>
                <td className="p-4 border-b">Email/SMS</td>
              </tr>
              <tr className="hover:bg-[#F6FCF9]">
                <td className="p-4 border-b">% BP Follow-up</td>
                <td className="p-4 border-b">&lt;50%</td>
                <td className="p-4 border-b">Email/SMS</td>
              </tr>
              <tr className="hover:bg-[#F6FCF9]">
                <td className="p-4 border-b">% BG Follow-up</td>
                <td className="p-4 border-b">&lt;50%</td>
                <td className="p-4 border-b">Email/SMS</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="font-playfair text-3xl md:text-4xl text-[#2514BE] mt-10 mb-6">Tools for Data Generation & Simulation</h2>
        <div className="card-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          <div className="tool-card bg-white rounded-xl p-6 flex flex-col items-center text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="tool-icon w-20 h-20 flex items-center justify-center rounded-full mb-6 text-4xl bg-[#F6FCF9] text-[#32443B]">🧑</div>
            <h3 className="font-playfair text-xl mb-4">Faker</h3>
            <p className="text-base">Generate realistic names, dates, IDs, and locations for patient profiles</p>
          </div>
          <div className="tool-card bg-white rounded-xl p-6 flex flex-col items-center text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="tool-icon w-20 h-20 flex items-center justify-center rounded-full mb-6 text-4xl bg-[#E9E7F8] text-[#0B0639]">📊</div>
            <h3 className="font-playfair text-xl mb-4">Pandas + NumPy</h3>
            <p className="text-base">Create time series data and apply statistical noise for realistic patterns</p>
          </div>
          <div className="tool-card bg-white rounded-xl p-6 flex flex-col items-center text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="tool-icon w-20 h-20 flex items-center justify-center rounded-full mb-6 text-4xl bg-[#FDF7F4] text-[#48362D]">🐍</div>
            <h3 className="font-playfair text-xl mb-4">Custom Python</h3>
            <p className="text-base">Encode specialized medical logic such as diabetic patient behavior</p>
          </div>
          <div className="tool-card bg-white rounded-xl p-6 flex flex-col items-center text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="tool-icon w-20 h-20 flex items-center justify-center rounded-full mb-6 text-4xl bg-[#FDFBFB] text-[#464141]">🔌</div>
            <h3 className="font-playfair text-xl mb-4">Mockaroo / API</h3>
            <p className="text-base">Leverage external API-based dummy data sources</p>
          </div>
          <div className="tool-card bg-white rounded-xl p-6 flex flex-col items-center text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="tool-icon w-20 h-20 flex items-center justify-center rounded-full mb-6 text-4xl bg-[#EFEEFA] text-[#1E1B3F]">🖥️</div>
            <h3 className="font-playfair text-xl mb-4">Streamlit</h3>
            <p className="text-base">Build interactive simulation UI for configuration and visualization</p>
          </div>
        </div>

        <div className="anomaly-detector bg-[#E9E7F8] rounded-xl p-8 my-8">
          <h2 className="font-playfair text-3xl md:text-4xl text-[#2514BE] mb-6">Anomaly Detection Engine</h2>
          <p className="text-lg leading-relaxed mb-6">
            Our sophisticated anomaly detection system uses multiple methods to identify potential health concerns:
          </p>
          <div className="methods grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="method-card bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-playfair text-xl text-[#675BD2] mb-4">Threshold Rules</h3>
              <p className="text-base mb-2"><strong>Tools:</strong> Custom Python (if conditions)</p>
              <p className="text-base mb-2"><strong>How It Works:</strong> Flags values outside bounds (e.g., if glucose greater than 180).</p>
              <p className="text-base"><strong>Best For:</strong> Simple, interpretable alerts that require immediate attention.</p>
            </div>
            <div className="method-card bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-playfair text-xl text-[#675BD2] mb-4">Statistical Models</h3>
              <p className="text-base mb-2"><strong>Tools:</strong> statsmodels, scipy</p>
              <p className="text-base mb-2"><strong>How It Works:</strong> Uses Z-scores or IQR to detect statistical outliers in patient data.</p>
              <p className="text-base"><strong>Best For:</strong> General anomaly detection across large patient populations.</p>
            </div>
          </div>
        </div>

        <div className="alert-system bg-[#FDF7F4] rounded-xl p-8 my-8">
          <h2 className="font-playfair text-3xl md:text-4xl text-[#2514BE] mb-6">Alert System</h2>
          <p className="text-lg leading-relaxed mb-6">
            When anomalies are detected, our system ensures that healthcare providers are notified promptly:
          </p>
          <div className="alert-methods grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="alert-card bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-playfair text-xl text-[#675BD2] mb-4">Email Alerts</h3>
              <p className="text-base mb-2"><strong>Tools:</strong> smtplib, email, Haraka</p>
              <p className="text-base"><strong>How It Works:</strong> Sends detailed email notifications via Gmail/SMTP when an anomaly is detected.</p>
            </div>
            <div className="alert-card bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-playfair text-xl text-[#675BD2] mb-4">SMS Alerts</h3>
              <p className="text-base mb-2"><strong>Tools:</strong> Digimiles</p>
              <p className="text-base"><strong>How It Works:</strong> Integrates with Digimiles API to send urgent SMS alerts to stakeholders.</p>
            </div>
            <div className="alert-card bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-playfair text-xl text-[#675BD2] mb-4">Dashboard Alerts</h3>
              <p className="text-base mb-2"><strong>Tools:</strong> Next.js, Chart.js</p>
              <p className="text-base"><strong>How It Works:</strong> Highlights anomalies visually on the analytics dashboard in real time.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}