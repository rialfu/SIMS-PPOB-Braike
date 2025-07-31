import axios from "axios"
import React from "react"
import { useState } from "react"
// import { Eye, EyeOff, Mail, Lock } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent } from "@/components/ui/card"
// import Image from "next/image"
import gambar from '../assets/images/Illustrasi Login.png'
import logo from '../assets/images/Logo.png'

export default function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confPassword, setConfPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [errorMessage, setErrorMessage] = useState({
    'email':'',
    'firstName':'',
    'lastName':'',
    'password':'',
    'confPassword':''
  })
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handle = async (e) => {
    e.preventDefault()
    let isFalse = false;
    let messages = {
      'email':'',
      'firstName':'',
      'lastName':'',
      'password':'',
      'confPassword':''
    }
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(email === ''){
      messages['email'] = 'email harus diisi'
      isFalse = true;

    }else if(!pattern.test(email)){
      messages['email'] = 'email harus berformat email'
      isFalse = true;
    }
    if(firstName === ''){
      messages['firstName'] = 'First Name harus diisi'
      isFalse = true;

    }
    if(lastName === ''){
      messages['lastName'] = 'Last Name harus diisi'
      isFalse = true;

    }
    if(password === ''){
      messages['password'] = 'password harus diisi'
      isFalse = true;
    }else if(password.length < 8){
      messages['password'] = 'password minimal 8 karakter'
      isFalse = true;
    }
    if(confPassword !== password){
      messages['confPassword'] = 'password tidak sama'
      isFalse = true;
    }
    setErrorMessage({...errorMessage, ...messages})
    // console.log()
    if(isFalse){
      return
    }
    console.log('tidak stop')
    try{
      const res = await axios.post('https://take-home-test-api.nutech-integrasi.com/registration', {'email':email, 'password':password, 'first_name':firstName, 'last_name':lastName})
    }catch(err){
      console.log(err)
      let data = err.response.data ?? null
      if(data !== null){
        
        if(data['message'] !== undefined){
          if(err.status === 400){
            let pos = data['message'].split(' ')
            if(pos[1].toLowerCase() === 'email' || data['message'].toLowerCase().includes('email')){
              setErrorMessage({...messages, email:data['message'].replace('Parameter ','')})
              return
            }
            if(pos[1].toLowerCase() === 'first_name' || data['message'].toLowerCase().includes('first_name')){
              setErrorMessage({...messages, firstName:data['message'].replace('first_name', 'first name').replace('Parameter ','')})
              return
            }
            if(pos[1].toLowerCase() === 'last_name' ||data['message'].toLowerCase().includes('last_name')){
              setErrorMessage({...messages, lastName:data['message'].replace('last_name', 'last name').replace('Parameter ','')})
              return
            }
            if(pos[1].toLowerCase() === 'password' || data['message'].toLowerCase().includes('password')){
              setErrorMessage({...messages, password:data['message'].replace('Parameter ','')})
              return
            }


          }
          alert(data['message'])
          return
        }
        
      }
      alert('Something is wrong')
    }
    
    // Handle login logic here
    console.log("Login attempt:", { email, password })
  }

  return (
    <div className="" style={{height:'100vh'}}>
      <div className="flex w-full h-full ">

        <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8">
            <div className="max-w-sm w-full space-y-6">
                <div className="flex items-center justify-center mb-6 ">
                   
                   <img src={logo} alt="" style={{width:'30px', aspectRatio:'1'}} /> <span className="ms-2 text-xl font-semibold text-gray-800">SIMS PPOB {errorMessage['confPassword']}</span>
                </div>

                <h1 className="text-2xl font-semibold text-gray-800 leading-tight text-center">
                    Lengkapi data untuk <br/> membuat akun
                </h1>
                <div>
                  <div className="relative">
                      <input
                          value={email}
                          onChange={e=>setEmail(e.target.value)}
                          type="email"
                          id="email"
                          name="email"
                          placeholder="masukan email anda"
                          className={['w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg  focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-700 placeholder-gray-400', errorMessage['email'] !== ''  ? 'border-red-500':''].join(' ')}
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path></svg>
                      </div>
                  </div>
                  <p className="text-right text-red-500 text-sm">{errorMessage['email']}</p>
                </div>
                <div>
                <div className="relative">
                    <input
                        value={firstName}
                        onChange={e=>setFirstName(e.target.value)}
                        type="text"
                        id="text"
                        name="first_name"
                        placeholder="nama depan"
                        className={['w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg  focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-700 placeholder-gray-400', errorMessage['firstName'] !== ''  ? 'border-red-500':''].join(' ')}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    </div>
                </div>
                <p className="text-right text-red-500 text-sm">{errorMessage['firstName']}</p>
                </div>
                
                <div>
                  <div className="relative">
                      <input
                          value={lastName}
                          onChange={e=>setLastName(e.target.value)}
                          type="text"
                          id="text"
                          name="last_name"
                          placeholder="nama belakang"
                          className={['w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg  focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-700 placeholder-gray-400', errorMessage['lastName'] !== ''  ? 'border-red-500':''].join(' ')}
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                      </div>
                  </div>
                  <p className="text-right text-red-500 text-sm">{errorMessage['lastName']}</p>
                </div>
                
                <div>
                  <div className="relative">
                    <input
                        value={password}
                        onChange={e=>setPassword(e.target.value)}
                        type={showPassword ? 'text':'password'}
                        id="password"
                        name="password"
                        placeholder="buat password"
                        className={['w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg  focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-700 placeholder-gray-400', errorMessage['password'] !== ''  ? 'border-red-500':''].join(' ')}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm0-11V7a4 4 0 018 0v2"></path></svg>
                    </div>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
                        
                        {showPassword? 
                          <svg onClick={()=>setShowPassword(!showPassword)} className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 .989-3.123 3.423-5.64 6.31-7.253M12 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.04 4.04M15 12a3 3 0 11-6 0 3 3 0 016 0zm-3 0V9"></path></svg>: 
                          <svg onClick={()=>setShowPassword(!showPassword)} className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>}
                    </div>
                  </div>
                  <p className="text-right text-red-500 text-sm">{errorMessage['password']}</p>
                </div>
                
                <div>
                  <div className="relative">
                      <input
                          value={confPassword}
                          onChange={e=>setConfPassword(e.target.value)}
                          type={showPassword ? 'text':'password'}
                          id="confpassword"
                          name="confpassword"
                          placeholder="konfirmasi password"
                          className={['w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg  focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-700 placeholder-gray-400', errorMessage['confPassword'] !== ''  ? 'border-red-500':''].join(' ')}
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm0-11V7a4 4 0 018 0v2"></path></svg>
                      </div>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
                        
                        {showPassword? 
                          <svg onClick={()=>setShowPassword(!showPassword)} className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 .989-3.123 3.423-5.64 6.31-7.253M12 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.04 4.04M15 12a3 3 0 11-6 0 3 3 0 016 0zm-3 0V9"></path></svg>: 
                          <svg onClick={()=>setShowPassword(!showPassword)} className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>}
                    </div>
                      <br />
                      
                  </div>
                  <p className="text-right text-red-500 text-sm">{errorMessage['confPassword']}</p>
                </div>
                
                <button
                    type="submit"
                    onClick={handle}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-300"
                >
                    Registrasi
                </button>

                <p className="text-center text-sm text-gray-600">
                    sudah punya akun? login <a href="/" className="text-red-500 hover:underline font-medium">di sini</a>
                </p>
            </div>
        </div>

        <div className="w-1/2 bg-red-100 hidden md:flex items-center justify-center relative overflow-hidden">
            <img src={gambar} alt="" style={{objectFit:'fill', width:'100%'}} />
{/*             
            <div className="w-4/5 h-4/5 bg-red-200 rounded-full flex items-center justify-center text-gray-600 text-lg font-semibold opacity-0">
                
            </div>
            
            <div className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4 w-3/4 h-3/4 bg-red-300 rounded-full opacity-70 blur-xl"></div>
            <div className="absolute top-0 left-0 transform -translate-x-1/4 -translate-y-1/4 w-1/2 h-1/2 bg-blue-300 rounded-full opacity-50 blur-xl"></div>
            <div className="absolute top-1/4 left-1/4 w-1/5 h-1/5 bg-green-300 rounded-full opacity-60 blur-xl"></div>

            <div className="absolute z-10 w-3/4 h-3/4 flex items-center justify-center text-gray-700 text-2xl font-bold">
                            </div> */}
        </div>

    </div>
    </div>
     
  )
}
