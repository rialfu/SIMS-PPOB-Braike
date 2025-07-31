import { useEffect, useRef, useState } from "react"
import apiClient from "../parameter/axios-global"
import Layout from '../layouts/base-header'
import defaultPhoto from '../assets/images/Profile Photo.png'
import { logout, updateProfile } from "../state/auth-reducer"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router"

export default function history() {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const auth = useSelector((state)=>state.auth)
    const MAX_FILE_SIZE_KB = 100; // Ukuran maksimum dalam KB
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_KB * 1024; // Konversi ke Bytes
    const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png'];
    const [control, setControl] = useState({'isLoad':false, readonly: true})
    const fileInputRef = useRef(null);
    const [profile, setProfile] = useState({'email':null, 'first_name':null, 'last_name':null, 'profile':null})
    const processLogout = ()=>{
        localStorage.removeItem('authToken')
        dispatch(logout());
        navigate('/')
    }
    
    
    const getProfile =async()=>{
        setControl({...control, isLoad:true})
        try{

            const res= await apiClient.get('/profile')
            const dataProfile = res.data.data
            setProfile({
                email: dataProfile['email'],
                first_name: dataProfile['first_name'],
                last_name: dataProfile['last_name'],
                profile:dataProfile['profile_image'],
            })
            dispatch(updateProfile({
                email: dataProfile['email'],
                first_name: dataProfile['first_name'],
                last_name: dataProfile['last_name'],
                profile:dataProfile['profile_image'],
            })) 
           setControl({...control, isLoad:false, readonly:true})

        }catch(err){
            console.log(err)
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
    const openFile = ()=>{
        fileInputRef.current.click();
    }
    const processUpdate = async ()=>{
        setControl({...control, isLoad:true})
        try{
            const res= await apiClient.put('/profile/update',{first_name:profile.first_name, last_name:profile.last_name})
            const dataProfile = res.data.data
            setProfile({
                email: dataProfile['email'],
                first_name: dataProfile['first_name'],
                last_name: dataProfile['last_name'],
                profile:dataProfile['profile_image'],
            })
            dispatch(updateProfile({
                email: dataProfile['email'],
                first_name: dataProfile['first_name'],
                last_name: dataProfile['last_name'],
                profile:dataProfile['profile_image'],
            }))
            console.log('final') 
            setControl({isLoad:false, readonly: true})
        }catch(err){
            console.log(err)
            let data = err.response?.data || null
            if(data != null && data['status']== 108){
                localStorage.removeItem('authToken')
                dispatch(logout());
                return navigate('/')
            }
            alert(data?.message ?? 'Something is wrong')
            setControl({...control, isLoad:false, })
        }
       
    }
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            if(file.size > MAX_FILE_SIZE_BYTES){
                event.target.value = null;
                alert('Maksimal File 100KB')
                return
            }
            if (!ALLOWED_FILE_TYPES.includes(file.type)) {
                event.target.value = null;
                alert('File hanya mendukung JPG dan PNG')
                return;
            }
            const formData = new FormData();
            formData.append('file',file)
            try{
                const res= await apiClient.put('/profile/image', formData, {headers:{'Content-Type':'multipart/form-data'}})
                getProfile()
            }catch(err){
                let data = err.response?.data || null
                if(data != null && data['status']== 108){
                    localStorage.removeItem('authToken')
                    dispatch(logout());
                    return navigate('/')
                }
                let message= data?.message ?? 'Something is wrong'
                message = message.replace('Field','').replace('file', 'File')
                alert(message)
                // console.log(err)
            }
            return
            const reader = new FileReader();
            reader.onload = async(e) => {
                const arrayBuffer = e.target.result;
                console.log(arrayBuffer)
                event.target.value = null;
            };
            reader.onerror = () => {
                alert('Something is wrong, file cant process')
                console.error('Error membaca file:', reader.error);
            };
            reader.readAsArrayBuffer(file); 
            
        } else {

            // setSelectedFileName('');
            // setFileContent('');
            // setError('Tidak ada file dipilih.');
        }
    };
    useEffect(()=>{
        getProfile()
    },[])
    return (<>
        <Layout>
            <div className="md:max-w-4xl w-full mx-auto px-4 md:px-0">
                <div className="flex justify-center flex-col items-center ">
                    <div className="relative w-28 h-28">
                        <img src={auth.profile.includes('/null') ?defaultPhoto: auth.profile} className="w-full rounded-full" alt="" />
                        <div className="absolute border border-black bg-white rounded-full p-1" style={{bottom:0, right:0}} onClick={()=>openFile()}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 20H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M16.5 3.5C17.0523 2.94772 17.9477 2.94772 18.5 3.5L20.5 5.5C21.0523 6.05228 21.0523 6.94772 20.5 7.5L11 17L3 21L7 13L16.5 3.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <input type="file" name="" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                    </div>
                    
                    <p className="font-medium text-4xl mt-4">{auth.first_name} {auth.last_name}</p>
                    
                </div>
                <div className="mb-4">
                    <p className="text-lg">Email</p>
                    <div className="relative">
                        <input
                            value={profile.email === null ? auth.email:profile.email}
                            onChange={(e)=>setProfile({...profile, email:e.target.value})}
                            type="email"
                            id="email"
                            name="email"
                            placeholder="masukan email anda"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-700 placeholder-gray-400"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path></svg>
                        </div>
                    </div>
                </div>
                <div className="mb-4">
                    <p className="text-lg">Nama Depan</p>
                    <div className="relative">
                        <input
                            value={profile.first_name === null ? auth.first_name:profile.first_name}
                            onChange={(e)=>setProfile({...profile, first_name:e.target.value})}
                            type="text"
                            readOnly={control.readonly}
                            name="first_name"
                            placeholder="masukan nama depan"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-700 placeholder-gray-400"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
                                <path d="M18 21C18 17.6863 15.3137 15 12 15C8.68629 15 6 17.6863 6 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="mb-4">
                    <p className="text-lg">Nama Belakang</p>
                    <div className="relative">
                        <input
                            value={profile.last_name === null ? auth.last_name :profile.last_name }
                            onChange={(e)=>setProfile({...profile, last_name:e.target.value})}
                            type="text"
                            readOnly={control.readonly}
                            name="last_name"
                            placeholder="masukan nama belakang"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-700 placeholder-gray-400"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
                                <path d="M18 21C18 17.6863 15.3137 15 12 15C8.68629 15 6 17.6863 6 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="mb-4">
                    {
                        control.readonly === false ? (
                        <button
                            onClick={()=>processUpdate()}
                            type="submit"
                            className="mb-3 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-300"
                        >
                            Simpan
                        </button>):(<></>)
                    }
                    {
                        control.readonly === false ? (<button
                        type="submit"
                        onClick={()=>setControl({...control, readonly:true})}
                        className="mb-3 w-full border-red-500 border text-red-500 font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-300"
                    >
                        Batalkan
                    </button>):(<></>)
                    }
                    {
                        control.readonly ? (
                        <button
                            onClick={()=>setControl({...control, readonly:false})}
                            type="submit"
                            className="mb-3 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-300"
                        >
                            Edit Profile
                        </button>):(<></>)
                    }
                    
                    {
                        control.readonly ? (<button
                        type="submit"
                        onClick={()=>processLogout()}
                        className="mb-3 w-full border-red-500 border text-red-500 font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-300"
                    >
                        Logout
                    </button>):(<></>)
                    }
                    
                </div>
            </div>
            
           
            
            
        </Layout>
       

    </>)
}
