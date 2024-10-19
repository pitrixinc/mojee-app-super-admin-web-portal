import Image from "next/image";
import { Inter } from "next/font/google";

import AccountSignin from "@/components/AccountSignin";

const inter = Inter({ subsets: ["latin"] });

const Signin = () => {
  return (
    <div
    className={` ${inter.className}`}
  >
   <AccountSignin/>
  </div>
  )
}

export default Signin