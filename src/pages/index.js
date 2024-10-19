import React from 'react'
import { Inter } from "next/font/google";
import AccountSignin from '@/components/AccountSignin';


const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div
      className={` ${inter.className}`}
    >
      <AccountSignin/>
    </div>
  );
}
