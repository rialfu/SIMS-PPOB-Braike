import React, { useEffect } from "react"

import { useState } from "react"
import { useDispatch,} from "react-redux"
import apiClient from "../parameter/axios-global";
import { useLoaderData, useNavigate, useParams, } from "react-router"
import Layout from '../layouts/base-header-profile'
import { logout, updateSaldo } from "../state/auth-reducer";
import imageDefault from '../assets/images/Listrik.png'
import logo from '../assets/images/Logo.png'
import successIcon from '../assets/images/check.png'
import failedIcon from '../assets/images/cross.png'
import { formatterIDR } from "../parameter/tools";

export default function dashboard() {
    const navigate= useNavigate()
    const dispatch  = useDispatch()

    const [formData, setFormData] = useState({
        'isLoad': true,
        'category': null,
        'confDialog':false,
        'messageDialog':{
            'open':false,
            'status':null,
            'message':'',
        }
    })
    const { param } = useParams();

    async function getService() {
        try{
            const resService = await apiClient.get('/services')
            let dataService = [...(resService.data?.data || [] )]
            const single = dataService.find((data)=>data.service_code.toLowerCase() == param.toLocaleLowerCase())
            if(single == undefined){
                navigate('/dashboard')
                return
            }
            setFormData({...formData, isLoad:false, category:single})
            return
            // console.log(single)
            // setCategory(single)
        }catch(err){
            console.log(err)
            let data = err.response?.data || null
            if(data != null && data['status']== 108){
                localStorage.removeItem('authToken')
                dispatch(logout());
                return navigate('/')
            }
            
            alert('something is wrong')
            navigate('/dashboard')
        }
        setFormData({...formData, isLoad:false,category:null})
        // setIsLoad(false)
    }
    useEffect( ()=>{
        getService()
    }, [])
    const handle = (e) => {
        if(formData.isLoad) return;
        setFormData({...formData, confDialog:true})
        // setConfDialog(true)
    }
    const processUpdateSaldo =async ()=>{
        try{
            const res3 =await apiClient.get('/balance', ) 
            let balance = res3.data.data['balance'] ?? 0
            dispatch(updateSaldo(balance))
        }catch(err){
            let data = err.response?.data || null
            if(data['status']== 108){
                localStorage.removeItem('authToken')
                store.dispatch(logout());
                return redirect('/')
            }
        }
    }
    const process = async ()=>{
        setFormData({...formData, isLoad:true, confDialog:false})
        // setIsLoad(true)
        // setConfDialog(false)
        try{
            const res = await apiClient.post('/transaction',{"service_code":formData.category?.service_code ?? ''})
            await processUpdateSaldo()
            setFormData({...formData, isLoad:false, confDialog:false, messageDialog:{open:true, status:true, message:''}})
            return;
            // setMessageDialog({open:true, status:true, message:''})
            // setIsLoad(false)
        }catch(err){
            let data = err.response?.data || null
            if(data != null && data['status']== 108){
                localStorage.removeItem('authToken')
                dispatch(logout());
                return navigate('/')
            }
            setFormData({...formData, isLoad:false, confDialog:false, messageDialog:{open:true, status:false, message:data?.message ?? 'Something is wrong'}})
            // setMessageDialog({open:true, status:false, message:(data?.message ?? 'Something is wrong')})
            // setIsLoad(false)
            return
        }
        
        
        
    }
    
  return (
    
    <div>
      <Layout>
        <>
        {

        }
        <div className="mx-4">
            <p className="text-lg font-normal">PemBayaran</p>
            <div className="flex items-center mb-5">
                <img src={formData.category != null? formData.category.service_icon : imageDefault} style={{height:'40px', width:'40px'}} alt="" />
                <p className="mx-2 text-lg font-semibold">{formData.category?.service_name ?? ''}</p>
            </div>
            <div className="relative flex items-center w-full mb-4">
                        
                <div className="absolute left-3 text-gray-400">
                    
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="5" y="3" width="14" height="18" rx="2" ry="2"></rect>
                            <rect x="8" y="6" width="8" height="3" rx="1" ry="1"></rect>
                            <rect x="8" y="11" width="2" height="2" rx="0.5" ry="0.5"></rect>
                            <rect x="11" y="11" width="2" height="2" rx="0.5" ry="0.5"></rect>
                            <rect x="14" y="11" width="2" height="2" rx="0.5" ry="0.5"></rect>
                            <rect x="8" y="14" width="2" height="2" rx="0.5" ry="0.5"></rect>
                            <rect x="11" y="14" width="2" height="2" rx="0.5" ry="0.5"></rect>
                            <rect x="14" y="14" width="2" height="2" rx="0.5" ry="0.5"></rect>
                            <rect x="8" y="17" width="2" height="2" rx="0.5" ry="0.5"></rect>
                            <rect x="11" y="17" width="2" height="2" rx="0.5" ry="0.5"></rect>
                            <rect x="14" y="17" width="2" height="2" rx="0.5" ry="0.5"></rect>
                        </svg>
                    
    
                </div>

                <input
                    type="text"
                    value={formatterIDR.format(formData.category != null ? formData.category.service_tariff:0).replace(/\.\,/g, '')} 
                    placeholder="Search anything..."
                    readOnly="true"
                    style={{height:'50px'}}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg transition duration-200 ease-in-out text-gray-700 placeholder-gray-400"
                />
            </div>
            <button
                className="w-full disabled:bg-red-300 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 disabled:opacity-50 disabled:bg-gray-500 disabled:cursor-not-allowed"
                disabled={formData.isLoad}
                onClick={handle}
            >
                Bayar
            </button>
        </div>
        <div id="confirmationModal" className={["  inset-0 flex items-center justify-center modal-overlay bg-gray-500 bg-opacity-50", formData.messageDialog.open?'fixed':'hidden'].join(' ')}>
            <div className="bg-white p-8 rounded-lg shadow-2xl max-w-80 md:max-w-sm w-full text-center">
            
                <div className="flex justify-center mb-4">
                    <img src={formData.messageDialog.status===true? successIcon: failedIcon} style={{height:'50px', width:'50px'}} alt="" />
                </div>

                <p className="text-lg text-gray-700 mb-2">Pembayaran {formData.category?.service_name ?? ''} sebesar</p>
                <p id="modalAmount" className="text-2xl font-bold ">{formatterIDR.format(formData.category != null ? formData.category.service_tariff:0).replace(/\.\,/g, '')}</p>
                <p>{formData.messageDialog.status === true?'Berhasil!':'Gagal!'}</p>
                <p>{formData.messageDialog.status === true?'':formData.messageDialog.message}</p>
                <div className="flex flex-col space-y-3 mt-6">
                    
                    <p className="text-red-500 hover:text-red-700 cursor-pointer" onClick={()=>formData.messageDialog.status===false? setFormData({...formData, messageDialog:{open:false, status:null, message:''}}) : navigate('/dashboard')}>
                        Kembali ke beranda
                    </p>
                    
                </div>
            </div>
        </div>
        <div id="confirmationModal1" className={["  inset-0 flex items-center justify-center modal-overlay bg-gray-500 bg-opacity-50", formData.confDialog?'fixed':'hidden'].join(' ')}>
            <div className="bg-white p-8 rounded-lg shadow-2xl max-w-80 md:max-w-sm w-full text-center">
            
                <div className="flex justify-center mb-4">
                    <img src={logo} style={{height:'50px', width:'50px'}} alt="" />
                </div>

                <p className="text-lg text-gray-700 mb-2">Beli {formData.category?.service_name ?? ''} senilai</p>
                <p id="modalAmount" className="text-2xl font-bold  mb-6">{formatterIDR.format(formData.category != null ? formData.category.service_tariff:0).replace(/\.\,/g, '')} ?</p>

                <div className="flex flex-col space-y-3">
                    <p className="text-red-500 hover:text-red-700 cursor-pointer" onClick={()=>process()}>
                        Ya, lanjutkan Bayar
                    </p>
                    <p className="text-gray-300 hover:text-gray-500 cursor-pointer" onClick={()=>setFormData({...formData, confDialog:false})}>
                        Batalkan
                    </p>
                    
                </div>
            </div>
        </div>
        </>
      </Layout>
    </div>
  )
}
