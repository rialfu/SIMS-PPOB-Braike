import { useState } from "react"
import { useDispatch,} from "react-redux"

import { useNavigate } from "react-router"
import Layout from '../layouts/base-header-profile'
import logo from '../assets/images/Logo.png'
import successIcon from '../assets/images/check.png'
import failedIcon from '../assets/images/cross.png'
import apiClient from "../parameter/axios-global";
import { logout, updateSaldo } from "../state/auth-reducer";

export default function dashboard() {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const [jumlah, setJumlah] =useState(0)
    const [isLoad, setIsload] = useState(false)
    const [confDialog, setConfDialog] = useState(false)
    const [messageDialog, setMessageDialog] = useState({'open':false, 'status':null, 'message':''})


    const handle = (e) => {
        if(isLoad) return;
        setConfDialog(true)
    }
    const process = async ()=>{
        if(jumlah < 10000 || jumlah > 1000000) return
        setIsload(true)
        setConfDialog(false)
        
        try{
            const res = await apiClient.post('/topup', {'top_up_amount':jumlah})
            setMessageDialog({open:true, status:true, message:''})
            setIsload(false)
        }catch(err){
            let data = err.response?.data || null
            if(data != null && data['status']== 108){
                localStorage.removeItem('authToken')
                dispatch(logout());
                return navigate('/')
            }
            let message = (data?.message ?? 'Something is wrong').replace('Parameter','')
            message = message.replace('top_up_amount','Top Up Amount')
            setMessageDialog({open:true, status:false, message})
            setIsload(false)
            return
        }
        try{
            const res3 =await apiClient.get('/balance', ) 
            const balance= res3.data.data['balance'] ?? 0
            dispatch(updateSaldo(balance))
        }catch(err){

        }
        
    }
    const changeValue = (val)=>{
        // console.log('change', val)
        val = val +''
        val = val.replace(/[^0-9]/g, '')
        // val = val.replace(/[a-zA-Z]/g,'')
        
        try{
            console.log('change', val)
            if( val == ''){ 
                setJumlah('')
                return;
            }
            setJumlah(parseInt(val))
            
            // val = parseInt(val)
            // console.log('change', val)
            // setJumlah(formatterIDR.format(val).replace(/\.\,/g, ''))
        }catch(err){
            console.log(err)
            setJumlah('')
        }
    }
    const formatterIDR = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
  return (
    
    <div>
      <Layout>
        <>
        <div className="mx-4">
            <p className="text-sm md:text-md">Silahkan Masukkan</p>
            <p className="text-lg md:text-2xl">Nominal Top Up</p>
            <div className="grid grid-cols-12 mt-4">
                <div className="col-span-12 md:col-span-8 sm:col-span-6">
                    <div className="relative flex items-center w-full mb-2">
                        
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
                            value={formatterIDR.format(jumlah).replace(/\.\,/g, '')} onChange={(e)=>changeValue(e.target.value)}
                            placeholder="Search anything..."
                            style={{height:'50px'}}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200 ease-in-out text-gray-700 placeholder-gray-400"
                        />
                    </div>
                    <button
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 disabled:opacity-50 disabled:bg-gray-500 disabled:cursor-not-allowed"
                        disabled={jumlah == '' || (jumlah < 10000) || (jumlah > 1000000)}
                        onClick={handle}
                    >
                        Submit
                    </button>
                </div>
                <div className="col-span-12 md:col-span-4 sm:col-span-6">
                    <div className="grid grid-cols-6">
                        {
                            [10000, 20000, 50000, 100000,250000, 500000].map((money, index)=>(
                                <div className="col-span-2 px-2 pb-2" style={{height:'50px'}}>
                                    <button  onClick={()=>changeValue(money+'')}
                                    className="w-full h-full text-sm md:text-lg bg-white-600 hover:bg-white-700  font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-white-500 focus:ring-opacity-75">
                                        {formatterIDR.format(money)}
                                    </button>
                                </div>
                                // <button className="col-span-2 text-lg" onClick={()=>setJumlah(money)}>
                                //     {formatterIDR.format(money)}
                                // </button>
                            ))
                        }
                      
                    </div>
                </div>

            </div>
        </div>
        <div id="confirmationModal1" className={["  inset-0 flex items-center justify-center modal-overlay bg-gray-500 bg-opacity-50", messageDialog.open?'fixed':'hidden'].join(' ')}>
            <div className="bg-white p-8 rounded-lg shadow-2xl max-w-sm w-full text-center">
            
                <div className="flex justify-center mb-4">
                    <img src={messageDialog.status===true? successIcon: failedIcon} style={{height:'50px', width:'50px'}} alt="" />
                </div>

                <p className="text-lg text-gray-700 mb-2">Top Up sebesar</p>
                <p id="modalAmount" className="text-2xl font-bold ">{formatterIDR.format(jumlah)}</p>
                <p>{messageDialog.status === true?'Berhasil!':'Gagal!'}</p>
                <p>{messageDialog.status === true?'':messageDialog.message}</p>
                <div className="flex flex-col space-y-3 mt-6">
                    
                    <p className="text-red-500 hover:text-red-700 cursor-pointer" onClick={()=>messageDialog.status===false? setMessageDialog({open:false, status:null, message:''}) : navigate('/dashboard')}>
                        Kembali ke beranda
                    </p>
                    
                </div>
            </div>
        </div>
        <div id="confirmationModal" className={["  inset-0 flex items-center justify-center modal-overlay bg-gray-500 bg-opacity-50", confDialog?'fixed':'hidden'].join(' ')}>
            <div className="bg-white p-8 rounded-lg shadow-2xl max-w-sm w-full text-center">
            
                <div className="flex justify-center mb-4">
                    <img src={logo} style={{height:'50px', width:'50px'}} alt="" />
                </div>

                <p className="text-lg text-gray-700 mb-2">Anda yakin untuk Top Up sebesar</p>
                <p id="modalAmount" className="text-2xl font-bold  mb-6">{formatterIDR.format(jumlah)} ?</p>

                <div className="flex flex-col space-y-3">
                    <p className="text-red-400 hover:text-red-700 cursor-pointer" onClick={()=>process()}>
                        Ya, lanjutkan Bayar
                    </p>
                    {/* <button
                        id="confirmButton"
                        className="w-full  text-red-500 font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
                    >
                        Ya, lanjutkan Top Up
                    </button> */}
                    <p className="text-gray-300 hover:text-gray-500 cursor-pointer" onClick={()=>setConfDialog(false)}>
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
