import React, { useContext, useState } from 'react'
import { TailSpin } from 'react-loader-spinner';
import { Link, useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import {query, where, getDocs} from 'firebase/firestore';
import { usersRef } from '../firebase/firebase';
import bcrypt from 'bcryptjs';
import {Appstate} from '../App';

const Login = () => {
  const navigate=useNavigate();
  const useAppstate=useContext(Appstate);
  const [form,setForm]=useState({
    mobile:"",
    password:""
  });
  const [loading,setLoading]=useState(false);
  
  const login = async()=>{
    setLoading(true);
    try {
      const quer = query(usersRef, where('mobile','==',form.mobile));
      const querySnapshot= await getDocs(quer);
      querySnapshot.forEach((doc)=>{
        const _data=doc.data();
        const isUser = bcrypt.compareSync(form.password,_data.password);
        if(isUser){
          useAppstate.setLogin(true);
          useAppstate.setUserName(_data.name);
          swal({
            title:"Review Added",
            icon:"success",
            button:false,
            timer:3000
          })
          navigate('/');
        }else{
          swal({
            title:"Invalid Details",
            icon:"error",
            button:false,
            timer:3000
        })
        }
      })

      
    } catch (error) {
      swal({
        title:error.message,
        icon:"error",
        button:false,
        timer:3000
    })
    }
    setLoading(false);
  }

  return (
    <div class="container px-5 py-8 mx-auto w-full md:w-1/3">
      <div class="flex flex-col text-center w-full mb-4">
          <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-white">Login</h1>
                        
       </div>
      <div class="p-2 w-full">
        <div class="relative">
            <label for="email" class="leading-7 text-sm text-yellow-600">Mobile No</label>
            <input type={"number"} id="email" 
            value={form.mobile}
            onChange={(e)=>setForm({...form,mobile: e.target.value})}
            name="email" 
            class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
        </div>
    </div>
    <div class="p-2 w-full">
        <div class="relative">
            <label for="email" class="leading-7 text-sm text-yellow-600">Password</label>
            <input type={"password"} id="email" 
            value={form.password}
            onChange={(e)=>setForm({...form,password: e.target.value})}
            name="email" 
            class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
        </div>
    </div>
    <div class="p-2 w-full">
        <button 
        onClick={login}
        class="flex mx-auto text-white bg-yellow-600 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">
            {loading ?  <TailSpin height={25} color='white'/> : 'Login'}
        </button>
    </div>
    <div class='p-4 text-center'>
      <p>Create New Account...<Link to={'/signup'}><span class='text-blue-500'>Sign Up</span></Link></p>
    </div>
    
    </div>
  )
}

export default Login