import defaultPhoto from '../assets/images/Profile Photo.png'
import { useDispatch, useSelector } from 'react-redux';
import background from '../assets/images/Background Saldo.png'
import { updateSaldo, updateSee } from '../state/auth-reducer';
import Header from './header'
import { formatterIDR } from '../parameter/tools';
import { useState } from 'react';
import apiClient from '../parameter/axios-global';
const Layout = ({ children }) => {
    const dispatch = useDispatch()
    const [statusData, setStatusData] = useState({
        'isLoad':false,
        // 'statusMoney':{
        //     'isLoad':false,
        // }
    })
    const auth = useSelector((state)=>state.auth)
    const reloadMoney = async()=>{
        if(statusData.isLoad) return;
        setStatusData({isLoad:true})
        try{
            const res3 =await apiClient.get('/balance', ) 
            let balance = res3.data?.data['balance'] ?? 0
            dispatch(updateSaldo(balance))
        }catch(err){
            
        }
        setStatusData({...statusData, isLoad:false})
    }
    return (
    <>
        <Header/>
        <div className="container mx-auto px-4 mb-2 md:px-0 ">
            <div className="grid grid-cols-12 px-4 mt-4 mb-3">
                <div className="col-span-12 sm:col-span-6 md:col-span-6 mb-3">
                    <img src={auth.profile.includes('/null') ?defaultPhoto: auth.profile} className="w-14 h-14 rounded-full" alt="" />
                    <p className='text-sm md:text-lg'>Selamat Datang,</p>
                    <p className="font-medium text-2xl md:text-4xl">{auth.first_name} {auth.last_name}</p>
                </div>
                <div className="col-span-12 sm:col-span-6 md:col-span-6">
                    <div className="w-full bg-red-500 p-4 rounded-lg" style={{backgroundImage:`url(${background})`, backgroundRepeat:'no-repeat', backgroundSize:'100% 100%'}}>
                    <div className="flex">
                        <p className="text-white text-sm mb-3">Saldo Anda </p>
                        <p class="ms-2 text-white text-sm hover:text-gray-300 cursor-pointer" onClick={reloadMoney}>{statusData.isLoad? 'Please wait':'reload?'}</p>    
                    </div>
                    
                    <p className="text-4xl text-white mb-5">{auth.see ? formatterIDR.format(auth.balance):`Rp *******`}</p>
                    <div className="flex">
                        <p className="text-white text-md mb-2 me-2 cursor-pointer " onClick={()=>dispatch(updateSee(!auth.see))}>{auth.see? 'Tutup Saldo':'Lihat Saldo'} </p>
                        {/* <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"></path><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"></path><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"></path><path d="m2 2 20 20"></path></svg> */}
                    </div>
                    
                    </div>
                </div>
            </div>
            {children}
        </div>
        
    </>
    
    );
};

export default Layout;