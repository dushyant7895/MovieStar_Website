import React, { useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { Link } from "react-router-dom";
import { getAuth,RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import app from '../firebase/firebase'
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";
import { addDoc } from "firebase/firestore";
import { usersRef } from "../firebase/firebase";
import bcrypt from 'bcryptjs';


const auth=getAuth(app);

const Signup = () => {
  const navigate = useNavigate();
  const [form,setForm]=useState({
    name:"",
    mobile:"",
    password:""
  });
  const [loading,setLoading]=useState(false);
  const [otpSent,setOtpSent]=useState(false);
  const [OTP, setOTP]=useState("");

  const generateRecaptha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'invisible',
      'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        
      }
    });
  }

  const requestOtp = () => {
    setLoading(true);
    generateRecaptha();
    let appVerifier = window.recaptchaVerifier;
      signInWithPhoneNumber(auth, `+91${form.mobile}`, appVerifier).then(confirmationResult => {
        window.confirmationResult = confirmationResult;
        swal({
          text: "OTP Sent",
          icon: "success",
          buttons: false,
          timer: 3000,
        });
      
        setOtpSent(true);
        setLoading(false);
      }).catch((error) => {
        console.log(error)
      })
}
  
  const verifyOTP = ()=>{
    try {
      setLoading(true);
      window.confirmationResult.confirm(OTP).then((result) => {
        uploadData();
        swal({
          text: "Sucessfully Registered",
          icon: "success",
          buttons: false,
          timer: 3000,
        });
        navigate('/login');
        setLoading(false); 
      })
    } catch (error) {
      console.log(error);
    }
  }
  const uploadData = async () => {
    try {
      const salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(form.password, salt);
      await addDoc(usersRef, {
        name: form.name,
        password: hash,
        mobile: form.mobile
      });
    } catch(err) {
      console.log(err);
    }
  }

  return (
    <div class="container px-5 py-8 mx-auto w-full md:w-1/3">
      <div class="flex flex-col text-center w-full mb-4">
          <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-white">Signup</h1>             
       </div>
       { otpSent ?
        <> 
          <div class="p-2 w-full">
        <div class="relative">
            <label for="email" class="leading-7 text-sm text-yellow-600">OTP</label>
            <input  
            id="message"
            name="message" 
            value={OTP}
            onChange={(e)=>setOTP(e.target.value)}
            class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
        </div>
    </div>
    <div class="p-2 w-full">
        <button 
        onClick={verifyOTP}
        class="flex mx-auto text-white bg-yellow-600 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">
            {loading ?  <TailSpin height={25} color='white'/> : 'Confirm OTP'}
        </button>
    </div>
    </>
       :
       <>
       <div class="p-2 w-full">
        <div class="relative">
            <label for="email" class="leading-7 text-sm text-yellow-600">User Name</label>
            <input type="text" id="name" 
            value={form.name}
            onChange={(e)=>setForm({...form,name: e.target.value})}
            name="email" 
            class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
        </div>
    </div>
      <div class="p-2 w-full">
        <div class="relative">
            <label for="email" 
            class="leading-7 text-sm text-yellow-600">Mobile No</label>
            <input
            type={"number"}
            id="message"
            name="message"
            value={form.mobile}
            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
            class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          />
          </div>
    </div>
    <div class="p-2 w-full">
        <div class="relative">
            <label for="email" class="leading-7 text-sm text-yellow-600">Password</label>
            <input 
            type={"password"} 
            id="email" 
            value={form.password}
            onChange={(e)=>setForm({...form,password: e.target.value})}
            name="email" 
            class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
        </div>
    </div>
    <div class="p-2 w-full">
        <button class="flex mx-auto text-white bg-yellow-600 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
        onClick={requestOtp}
        >
            {loading ?  <TailSpin height={25} color='white'/> : 'Request OTP'}
        </button>
    </div>
    
    </>
     }
     <div class='p-4 text-center'>
      <p>Have Already Account...<Link to={'/login'}><span class='text-blue-500'>Login</span></Link></p>
    </div>
     <div id='recaptcha-container'></div>
    </div>
  )
}

export default Signup