// app/profile/page.tsx
"use client";
import { useState } from 'react';
import Head from 'next/head';

const ProfileSettingsPage = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  // Mock user data (replace with real data from auth/user context or API)
  const user = {
    name: 'Jane Mwangi',
    email: 'jane.mwangi@healthcare.org',
    phone: '+254 712 345678',
    position: 'Community Health Officer',
    facility: 'Kibera Health Centre',
    location: 'Nairobi, Kenya',
  };

  return (
    <>
      <Head>
        <title>Profile & Settings | Digital Health</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="min-h-screen bg-gray-100 text-gray-800">
        {/* Header */}
        <header className="bg-blue-600 text-white py-4 shadow-md">
          <div className="max-w-5xl mx-auto px-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold">Digital Health Portal</h1>
            <p className="text-sm">Logged in as {user.name}</p>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-5xl mx-auto p-4 space-y-10">
          {/* Profile Section */}
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Profile Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold">Full Name</p>
                <p>{user.name}</p>
              </div>
              <div>
                <p className="font-semibold">Email</p>
                <p>{user.email}</p>
              </div>
              <div>
                <p className="font-semibold">Phone Number</p>
                <p>{user.phone}</p>
              </div>
              <div>
                <p className="font-semibold">Position</p>
                <p>{user.position}</p>
              </div>
              <div>
                <p className="font-semibold">Facility</p>
                <p>{user.facility}</p>
              </div>
              <div>
                <p className="font-semibold">Location</p>
                <p>{user.location}</p>
              </div>
            </div>
          </section>

          {/* Settings Section */}
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Settings</h2>

            {/* Notification Preferences */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Notification Preferences</h3>
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  checked={emailNotifications}
                  onChange={() => setEmailNotifications(!emailNotifications)}
                  className="mr-2"
                />
                <label htmlFor="emailNotifications">Email Notifications</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="smsNotifications"
                  checked={smsNotifications}
                  onChange={() => setSmsNotifications(!smsNotifications)}
                  className="mr-2"
                />
                <label htmlFor="smsNotifications">SMS Notifications</label>
              </div>
            </div>

            {/* Account Actions */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Account Settings</h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                Change Password
              </button>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500 py-6">
          &copy; {new Date().getFullYear()} Digital Health Platform. All rights reserved.
        </footer>
      </div>
    </>
  );
};

export default ProfileSettingsPage;
