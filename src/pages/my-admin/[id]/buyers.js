import Image from "next/image";
import { Inter } from "next/font/google";
import Layout from "@/components/SuperAdmin/layout";
import UserBuyers from "@/components/SuperAdmin/UserBuyers";

const inter = Inter({ subsets: ["latin"] });

export default function myProfile() {
  return (
    <Layout
      className={`dark:bg-gray-900 dark:text-gray-300 ${inter.className}`}
      >
     <div className=" sm:ml-[81px] xl:ml-[340px] w-[100%] md:w-[70%] lg:w-[70%] xl:w-[75%] h-screen min-h-screen  text-[#16181C] overflow-y-auto no-scrollbar">
        <UserBuyers/>
      </div>
    </Layout>
  );
}
