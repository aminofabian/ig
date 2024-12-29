'use client'
import AnalyticsCard from "@/components/AnalyticsCard";
import InstagramConnect from "@/components/instagram-user/InstagramConnect";
import UserProfile from "@/components/instagram-user/UserProfile";
import { InstagramUserData } from "@/types/instagram";
import { useState } from 'react';

export default function ProfilePage() {
  const [userData, setUserData] = useState<InstagramUserData | undefined>(undefined);

  console.log('ProfilePage userData:', userData);

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Instagram User Lookup
      </h1>
      <InstagramConnect 
        onUserData={(data) => {
          setUserData(data?.response?.body?.data?.user);
        }} 
      />
      <UserProfile user={userData} />

      <AnalyticsCard />
    </main>
  );
}