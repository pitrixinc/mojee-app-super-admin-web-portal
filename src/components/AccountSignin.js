import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import {getDoc, doc} from 'firebase/firestore';
import { auth, db } from '../firebase.config';
import { toast } from 'react-toastify';
import Link from 'next/link';


const AccountSignin = () => {
    const router = useRouter()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
  
   
  
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            // Check if user exists in Firestore
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              // Redirect to the appropriate page based on user type
              let returnUrl;
              if (userData.isSuperAdmin) {
                returnUrl = `/my-admin/${user.uid}/dashboard`;
              } else if (userData.isMiniAdmin) {
                returnUrl = `/dashboard/${user.uid}/dashboard`;
              } else if (userData.isCreator) {
                returnUrl = `/account/${user.uid}/dashboard`;
              } else if (userData.isDonor) {
                returnUrl = `/account/${user.uid}/dashboard`;
              } else {
                returnUrl = '/';
              }
              toast.warning("You are already signed in")
              router.push(returnUrl);
            }
          }
        });
    
        // Cleanup subscription on unmount
        return () => unsubscribe();
      }, [router]);

      const signIn = async (e) => {
        e.preventDefault();
        if(!email){
          toast.info("Please enter you email address");
          return;
        }

        if(!password){
          toast.info("Please enter your password");
          return;
        }

        setLoading(true)
    
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          // Fetch user data from Firestore
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            // Redirect to the appropriate page based on user type
            let returnUrl;
            if (userData.isSuperAdmin) {
              returnUrl = `/my-admin/${user.uid}/dashboard`;
            } else if (userData.isMiniAdmin) {
              returnUrl = `/dashboard/${user.uid}/dashboard`;
            } else if (userData.isCreator) {
              returnUrl = `/account/${user.uid}/dashboard`;
            } else if (userData.isDonor) {
              returnUrl = `/account/${user.uid}/dashboard`;
            } else {
              returnUrl = '/';
            }
            toast.success('Signed in successfully');
            router.push(returnUrl);
            setLoading(false)
          } else {
            toast.error('User data not found');
          }
        } catch (error) {
          toast.error('Failed to sign in: ' + error.message);
        }
      };


  return (
    <div class="bg-sky-100 flex justify-center items-center h-screen">
  
<div class= "lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
  <h1 class="text-2xl font-semibold mb-4">Login</h1>
  <form onSubmit={signIn}>
  <div class="mb-4 bg-sky-100">
      <label for="username" class="block text-gray-600">Email</label>
      <input type="text"  value={email}
            onChange={(e) => setEmail(e.target.value)} id="username" name="username" class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" autocomplete="off" />
    </div>
    <div class="mb-4">
      <label for="password" class="block text-gray-800">Password</label>
      <input type="password"  value={password}
            onChange={(e) => setPassword(e.target.value)} id="password" name="password" class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" autocomplete="off"/>
    </div>
   
   {loading ? (
    <button type="button" disabled class="bg-red-400 hover:bg-blue-500 text-white font-semibold rounded-md py-2 px-4 w-full cursor-not-allowed">Signing In</button>
    ) : (
      <button type="submit"  class="bg-red-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full">Sign In</button>
    )}
  </form>
</div>

<div class="w-1/2 h-screen hidden lg:block">
  <img src="https://www.foodiv.com/wp-content/uploads/2023/06/online-ordering-business.jpg" alt="Placeholder Image" class="object-cover w-full h-full"/>
</div>
</div>



  )
}

export default AccountSignin