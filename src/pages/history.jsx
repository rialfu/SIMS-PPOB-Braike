import { useEffect, useState } from "react"
import apiClient from "../parameter/axios-global"
import Layout from '../layouts/base-header-profile'
import { logout } from "../state/auth-reducer"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router"

export default function history() {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [history, setHistory] = useState([])
    const [control, setControl] = useState({'isLoad':false, 'offset':0, 'limit':5, 'isNext':false})
    const getHistory =async()=>{
        setControl({...control, isLoad:true})
        try{

            const res= await apiClient.get('/transaction/history',{params:{
                limit:control.limit,
                offset:control.offset
            }})
            const data = res.data.data.records
            console.log(data)
            setHistory([...history, ...data])
            setControl({isLoad:false, offset:control.offset+control.limit, limit:control.limit, isNext:(data.length ==control.limit) })
            // console.log(res)
        }catch(err){
            let data = err.response?.data || null
            if(data != null && data['status']== 108){
                localStorage.removeItem('authToken')
                dispatch(logout());
                return navigate('/')
            }
            setControl({...control, isLoad:false})
            alert(data?.message ?? 'Something is wrong')
            return
        }
        
    }
    const formatterIDR = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
    function changeTime(date){
        date = new Date(date)
        const options = {
            year: 'numeric',
            month: 'long',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'shortOffset', 
            hour12: false 
        };
        return date.toLocaleString('id-ID', options).replace('pukul','').replace('GMT+7','WIB').replace('GMT+8','WITA').replace('GMT+9','WIT');
    }
    useEffect(()=>{
        getHistory()
    },[])
    return (<>
        <Layout>
            <div className="pb-4 mt-3 mx-4">
                <p className="font-medium text-xl mb-3">Semua Transaksi</p>
                {history.map((data,index)=><div className="flex p-3 justify-between border rounded-md mb-4">
                    <div>
                        <p className={['text-lg md:text-2xl font-medium', data.transaction_type === 'PAYMENT'?'text-red-500':'text-green-500'].join(' ')}>{data.transaction_type === 'PAYMENT'?'-':'+'} {formatterIDR.format(data.total_amount) }</p>
                        <p className="text-sm md:text-lg">{changeTime(data.created_on)}</p>
                    </div>
                    <p className="text-sm md:text-lg">{data.description}</p>
                    
                </div>)}
                {control.isNext?
                <p className="text-center mt-4 text-red-500 font-medium cursor-pointer" onClick={()=>getHistory()}>Load More</p>:
                <>
                
                </>}
            </div>
            
        </Layout>
       

    </>)
}
