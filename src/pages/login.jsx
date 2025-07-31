import axios from "axios"
import React from "react"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { login } from "../state/auth-reducer"
import { NavLink, redirect, useNavigate } from "react-router"
import apiClient from '../parameter/axios-global'
// useNavigate

import gambar from '../assets/images/Illustrasi Login.png'
import logo from '../assets/images/Logo.png'
import errorIcon from '../assets/images/cross.png'


export default function Login() {
  const dispatch = useDispatch();
  const navigate= useNavigate()
  const [config, setConfig] = useState({
    'show':false,
    'isLoad':false,
    'errorMessage':{
      'email':'',
      'password':'',
      'another':'',
    }
  })
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  // const [errorMessage, setErrorMessage] = useState({
  //   'email':'',
  //   'password':'',
   
  // })

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleLogin = async (e) => {
    if(config.isLoad) return;
    let messages = {
      'email':'',
      'password':'',
      'another':'',
    }
    let isError = false;
    if(email === ''){
      messages['email'] = 'Email harus diisi'
      isError = true
    }
    if(password === ''){
      messages['password'] = 'Email harus diisi'
      isError = true
    }
    
    // setErrorMessage({...errorMessage, ...messages})
    
    if(isError){ 
      setConfig({...config, errorMessage: messages})
      return
    }
    setConfig({...config,isLoad:true,  errorMessage: messages})
    try{
      const res = await apiClient.post('/login', {'email':email, 'password':password})
      const token = res.data.data['token']
      localStorage.setItem('authToken', token)
      const res2 =await apiClient.get('/profile', ) 
      const dataProfile = res2.data.data
      const res3 =await apiClient.get('/balance', ) 
      const balance= res3.data.data['balance'] ?? 0
      

      dispatch(login({
        token,
        email: dataProfile['email'],
        first_name: dataProfile['first_name'],
        last_name: dataProfile['last_name'],
        profile:dataProfile['profile_image'],
        balance
      }))
      
      navigate('/dashboard')
      return
      
    }catch(err){
      console.log(err)
      if(err.code ==='ERR_NETWORK'){
        setConfig({...config, isLoad:false, errorMessage:{...messages, another:'Internet Connection Loss'}, show:true})
        return
      }
      let data = err.response?.data || null
      if(data !== null){
        if(data['message'] !== undefined){
          if(data['status'] === 103){
            setConfig({...config, isLoad:false, errorMessage:{...messages, password:data['message']}, show:true})
            return
            // setErrorMessage({...errorMessage, password:data['message']})
          }else if(data['status'] === 108){
            localStorage.removeItem("authToken")
            setConfig({...config, isLoad:false, errorMessage:{...messages, another:'Failed login karena akses outdate'}, show:true})
            return
            // alert('Failed login karena akses outdated')
          }
          setConfig({...config, isLoad:false, errorMessage:{...messages, another:data['message']}, show:true})
          // alert(data['message'])
          return
        }
        
      }
      setConfig({...config, isLoad:false, errorMessage:{...messages, another:'Internet Connection Loss'}, show:true})
    }
    
    // Handle login logic here
    console.log("Login attempt:", { email, password })
  }

  return (
    <>
    <div className="" style={{height:'100vh'}}>
      <div className="flex w-full h-full ">

        <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8">
            <div className="max-w-sm w-full space-y-6">
                <div className="flex items-center justify-center mb-6 ">
                   
                   <img src={logo} alt="" style={{width:'30px', aspectRatio:'1'}} /> <span className="ms-2 text-xl font-semibold text-gray-800">SIMS PPOB</span>
                </div>

                <h1 className="text-2xl font-semibold text-gray-800 leading-tight text-center">
                    Masuk atau buat akun <br/> untuk memulai
                </h1>

                <div className="relative">
                    <input
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        type="email"
                        id="email"
                        name="email"
                        placeholder="masukan email anda"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-700 placeholder-gray-400"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path></svg>
                    </div>
                </div>

                <div className="relative">
                    <input
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        type="password"
                        id="password"
                        name="password"
                        placeholder="masukan password anda"
                        className={['w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg  focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-700 placeholder-gray-400', config.errorMessage['password'] !== ''  ? 'border-red-500':''].join(' ')}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm0-11V7a4 4 0 018 0v2"></path></svg>
                    </div>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
                        
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={config.isLoad}
                    onClick={handleLogin}
                    className="w-full bg-red-500 disabled:bg-red-300 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-300"
                >
                    Masuk
                </button>

                <p className="text-center text-sm text-gray-600">
                    belum punya akun? registrasi <NavLink to="/register" className="text-red-500 hover:underline font-medium">di sini</NavLink>
                </p> 
            </div>
        </div>

        <div className="hidden w-1/2 bg-red-100 md:flex items-center justify-center relative overflow-hidden">
            <img src={gambar} alt="" style={{objectFit:'fill', width:'100%'}} />

        </div>

    </div>
    </div>
    <div id="confirmationModal1" className={["  inset-0 flex items-center justify-center modal-overlay bg-gray-500 bg-opacity-50", config.show?'fixed':'hidden'].join(' ')}>
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-80 md:max-w-sm w-full text-center">
        <div className="flex justify-center mb-4">
          <img src={errorIcon} style={{height:'50px', width:'50px'}} alt="" />
        </div>

        <p className="text-lg text-gray-700 mb-2">Alert</p>
        <p>{config.errorMessage.email!='' ?config.errorMessage.email:config.errorMessage.password != ''? config.errorMessage.password:config.errorMessage.another }</p>

        <div className="flex flex-col space-y-3">
          <p className="text-red-500 hover:text-red-700 cursor-pointer" onClick={()=>setConfig({...config, show:false})}>
              Close
          </p>
        </div>
      </div>
    </div>
    </>
  )
}
