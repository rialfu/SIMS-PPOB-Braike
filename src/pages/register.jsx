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
import { NavLink } from "react-router"
import apiClient from "../parameter/axios-global"

export default function Register() {
  const [confDialog, setConfDialog] = useState(false)
  const [formData, setFormData] = useState({
    'isi':{
      'email':'',
      'password':'',
      'confPassword':'',
      'firstName':'',
      'lastName':'',
    },
    'see':false,
    'isLoad':false,
    'errorMessage':{
      'email':'',
      'firstName':'',
      'lastName':'',
      'password':'',
      'confPassword':''
    }
  })
  
  const togglePasswordVisibility = () => {
    
    setFormData({...formData, 'see': !formData.see})
  }

  const handle = async (e) => {
    if(formData.isLoad) return;
    let isFalse = false;
    let messages = {
      'email':'',
      'firstName':'',
      'lastName':'',
      'password':'',
      'confPassword':''
    }
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    console.log(formData.isi)
    if(formData.isi.email === ''){
      messages['email'] = 'email harus diisi'
      isFalse = true;

    }else if(!pattern.test(formData.isi.email)){
      messages['email'] = 'email harus berformat email'
      isFalse = true;
    }
    if(formData.isi.firstName === ''){
      messages['firstName'] = 'First Name harus diisi'
      isFalse = true;

    }
    if(formData.isi.lastName === ''){
      messages['lastName'] = 'Last Name harus diisi'
      isFalse = true;

    }
    if(formData.isi.password === ''){
      messages['password'] = 'password harus diisi'
      isFalse = true;
    }else if( formData.isi.password.length < 8){
      messages['password'] = 'password minimal 8 karakter'
      isFalse = true;
    }
    if(formData.isi.confPassword != formData.isi.password){
      messages['confPassword'] = 'password tidak sama'
      isFalse = true;
    }
    console.log(messages, formData.isi.confPassword != formData.isi.password)
    if(isFalse){
      setFormData({...formData, 'errorMessage':messages})
      return
    }
    setFormData({...formData, 'isLoad':true, errorMessage:messages})
    console.log({...formData})
    try{
      const res = await apiClient.post('/registration', {'email':formData.isi.email, 'password':formData.isi.password, 'first_name':formData.isi.firstName, 'last_name':formData.isi.lastName})
      setConfDialog(true)
      setFormData({...formData, isLoad:false})
    }catch(err){
      if(err.code ==='ERR_NETWORK'){
        alert("Internet Connection Loss")
        setFormData({...formData, isLoad:false})
        return
      }
      console.log(err)
      
      
      let data = err.response.data ?? null
      if(data !== null){
        
        if(data['message'] !== undefined){
          if(err.status === 400){
            let pos = data['message'].split(' ')
            if(pos[1].toLowerCase() === 'email' || data['message'].toLowerCase().includes('email')){
              setFormData({...formData, isLoad:false, errorMessage:{...messages, email:data['message'].replace('Parameter ','')}})
              // setFormData({...formData})
              return
            }
            if(pos[1].toLowerCase() === 'first_name' || data['message'].toLowerCase().includes('first_name')){
              setFormData({...formData, isLoad:false, errorMessage:{...messages, firstName:data['message'].replace('first_name', 'first name').replace('Parameter ','')}})
              
              return
            }
            if(pos[1].toLowerCase() === 'last_name' ||data['message'].toLowerCase().includes('last_name')){
              setFormData({...formData, isLoad:false, errorMessage:{...messages, lastName:data['message'].replace('last_name', 'last name').replace('Parameter ','')}})
              
              return
            }
            if(pos[1].toLowerCase() === 'password' || data['message'].toLowerCase().includes('password')){
              setFormData({...formData, isLoad:false, errorMessage:{...messages, password:data['message'].replace('Parameter ','')}})
             
              return
            }


          }
          alert(data['message'])
          setFormData({...formData, isLoad:false})
          return
        }
        
      }
      alert('Something is wrong')
      setFormData({...formData, isLoad:false})
    }
    
  }

  return (
    <>
      
    
    <div className="" style={{height:'100vh'}}>
      <div className="flex w-full h-full ">

        <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8">
            <div className="max-w-sm w-full space-y-6">
                <div className="flex items-center justify-center mb-6 ">
                   
                   <img src={logo} alt="" style={{width:'30px', aspectRatio:'1'}} /> <span className="ms-2 text-xl font-semibold text-gray-800">SIMS PPOB {formData.errorMessage.confPassword}</span>
                </div>

                <h1 className="text-2xl font-semibold text-gray-800 leading-tight text-center">
                    Lengkapi data untuk <br/> membuat akun
                </h1>
                <div>
                  <div className="relative">
                      <input
                          value={formData.isi.email}
                          onChange={(e)=>setFormData({...formData, isi:{...(formData.isi), email:e.target.value}})}
                          
                          type="email"
                          id="email"
                          name="email"
                          placeholder="masukan email anda"
                          className={['w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg  focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-700 placeholder-gray-400', formData.errorMessage['email'] !== ''  ? 'border-red-500':''].join(' ')}
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path></svg>
                      </div>
                  </div>
                  <p className="text-right text-red-500 text-sm">{formData.errorMessage.email}</p>
                </div>
                <div>
                <div className="relative">
                    <input
                        value={formData.isi.firstName}
                        onChange={(e)=>setFormData({...formData, isi:{...(formData.isi), firstName:e.target.value}})}
                        
                        type="text"
                        id="text"
                        name="first_name"
                        placeholder="nama depan"
                        className={['w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg  focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-700 placeholder-gray-400', formData.errorMessage['firstName'] !== ''  ? 'border-red-500':''].join(' ')}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    </div>
                </div>
                <p className="text-right text-red-500 text-sm">{formData.errorMessage.firstName}</p>
                </div>
                
                <div>
                  <div className="relative">
                      <input
                          value={formData.isi.lastName}
                          onChange={(e)=>setFormData({...formData, isi:{...(formData.isi), lastName:e.target.value}})}
                          
                          type="text"
                          id="text"
                          name="last_name"
                          placeholder="nama belakang"
                          className={['w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg  focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-700 placeholder-gray-400', formData.errorMessage['lastName'] !== ''  ? 'border-red-500':''].join(' ')}
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                      </div>
                  </div>
                  <p className="text-right text-red-500 text-sm">{formData.errorMessage.lastName}</p>
                </div>
                
                <div>
                  <div className="relative">
                    <input
                        value={formData.isi.password}
                        onChange={(e)=>setFormData({...formData, isi:{...(formData.isi), password:e.target.value}})}
                        type={formData.see? 'text':'password'}
                        
                        id="password"
                        name="password"
                        placeholder="buat password"
                        className={['w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg  focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-700 placeholder-gray-400', formData.errorMessage['password'] !== ''  ? 'border-red-500':''].join(' ')}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm0-11V7a4 4 0 018 0v2"></path></svg>
                    </div>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
                        
                        { formData.see ?
                          <svg 
                            onClick={togglePasswordVisibility}
                            
                            className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 .989-3.123 3.423-5.64 6.31-7.253M12 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.04 4.04M15 12a3 3 0 11-6 0 3 3 0 016 0zm-3 0V9"></path></svg>: 
                          <svg 
                            
                            onClick={togglePasswordVisibility}
                            className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>}
                    </div>
                  </div>
                  <p className="text-right text-red-500 text-sm">{formData.errorMessage.password}</p>
                </div>
                
                <div>
                  <div className="relative">
                      <input
                          value={formData.isi.confPassword}
                          onChange={(e)=>setFormData({...formData, isi:{...(formData.isi), confPassword:e.target.value}})}
                          type={formData.see? 'text':'password'}
                          
                          id="confpassword"
                          name="confpassword"
                          placeholder="konfirmasi password"
                          className={['w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg  focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-700 placeholder-gray-400', formData.errorMessage['confPassword'] !== ''  ? 'border-red-500':''].join(' ')}
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm0-11V7a4 4 0 018 0v2"></path></svg>
                      </div>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
                        
                        {
                          formData.see?
                          <svg 
                            onClick={togglePasswordVisibility}
                            className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 .989-3.123 3.423-5.64 6.31-7.253M12 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.04 4.04M15 12a3 3 0 11-6 0 3 3 0 016 0zm-3 0V9"></path></svg>: 
                          <svg 
                            onClick={togglePasswordVisibility}
                            className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>}
                    </div>
                      <br />
                      
                  </div>
                  <p className="text-right text-red-500 text-sm">
                      {formData.errorMessage.confPassword}  
                  </p>
                </div>
                
                <button
                    disabled={formData.isLoad}
                    type="submit"
                    onClick={handle}
                    className="w-full bg-red-500 hover:bg-red-600 text-white disabled:bg-red-300 font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-300"
                >
                    Registrasi
                </button>

                <p className="text-center text-sm text-gray-600">
                    sudah punya akun? login <NavLink className="text-red-500 hover:underline font-medium" to="/">di sini</NavLink> 
                </p>
            </div>
        </div>

        <div className="w-1/2 bg-red-100 hidden md:flex items-center justify-center relative overflow-hidden">
            <img src={gambar} alt="" style={{objectFit:'fill', width:'100%'}} />
        </div>

    </div>
    </div>
      <div id="confirmationModal1" className={["  inset-0 flex items-center justify-center modal-overlay bg-gray-500 bg-opacity-50", confDialog?'fixed':'hidden'].join(' ')}>
        <div className="bg-white p-8 rounded-lg shadow-2xl max-w-80 md:max-w-sm w-full text-center">
          <div className="flex justify-center mb-4">
            <img src={logo} style={{height:'50px', width:'50px'}} alt="" />
          </div>

          <p className="text-lg text-gray-700 mb-2">Sukses</p>
          

          <div className="flex flex-col space-y-3">
            <p className="text-red-500 hover:text-red-700 cursor-pointer" onClick={()=>setConfDialog(false)}>
                Close
            </p>
          </div>
        </div>
      </div>
    </>
     
  )
}
