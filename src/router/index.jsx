import { createBrowserRouter, RouterProvider,redirect, data, Navigate } from "react-router";
// import { useSelector } from "react-redux";
import { store } from "../state/store";
import { logout, login } from "../state/auth-reducer";
import apiClient from '../parameter/axios-global'
import Dashboard from '../pages/dashboard'
import Login from '../pages/login'
import Register from '../pages/register'
import TopUp from '../pages/topup'
import Buy from '../pages/buy'
import History from '../pages/history'
import Account from '../pages/account'

const nonAuth = async ({request})=>{
    const {auth} = store.getState()
    const token = localStorage.getItem('authToken')
    console.log('non', token)
    if(token !== null){
        try{
            const res = await apiClient.get('/profile', )
            return redirect('/dashboard')
        }catch(err){
            let data = err.response?.data || null
            if(data['status']== 108){
                localStorage.removeItem('authToken')
                store.dispatch(logout());
                
            }
        }
    }
    if(token === null  && auth.token !== null){
        store.dispatch(logout());
    }
}
const authLoader = async ({request})=>{
    // const token =localStorage.getItem('token')
    // if(token  === null || token === undefined){
    //     store.dispatch(logout())
    //     redirect('/')
    // }
    const {auth} = store.getState()
    
    if(auth.token === null){
        const token = localStorage.getItem('authToken')
        if(token == null){
            store.dispatch(logout());
            return redirect('/')
        } 
        try{
            const res = await apiClient.get('/profile', ) 
            const dataProfile = res.data.data
            const res3 =await apiClient.get('/balance', ) 
            const balance= res3.data.data['balance'] ?? 0
            console.log(res3.data.data, dataProfile)
            store.dispatch(login({
                token,
                email: dataProfile['email'],
                first_name: dataProfile['first_name'],
                last_name: dataProfile['last_name'],
                profile:dataProfile['profile_image'],
                balance,
            }))
        }catch(err){
            console.log(err)
            let data = err.response?.data || null
            if(data['status']== 108){
                localStorage.removeItem('authToken')
                store.dispatch(logout());
                return redirect('/')
            }
        }
        const fullUrl = request.url;
        
        const url = new URL(fullUrl);

        const pathname = url.pathname;
        if(pathname == '/dashboard'){
            let services =[]
            let banner = []
            try{
                const resService = await apiClient.get('/services')
                services = [...(resService.data?.data || [] )]
            }catch(err){
                console.log('erro',err)
            }
            try{
                const resBanner = await apiClient.get('/banner')
                banner = [...(resBanner.data?.data || [] )]
            }catch(err){
                console.log('erro',err)
            }
            return {services, banner}
            
        }
        console.log(request)
        
    }
}
const router = createBrowserRouter([
    {
        path: '/',
        element: <Login />,
        loader:nonAuth,
    },
    {
        path: '/dashboard',
        element: <Dashboard />,
        loader: authLoader, // Pasang loader di sini
    },
    {
        path: '/register',
        element: <Register />,
        loader:nonAuth,
    },
    {
        path: '/top-up',
        element: <TopUp />,
        loader: authLoader,
    },
    {
        path: '/buy/:param',
        element: <Buy />,
        loader: authLoader,
    },
    {
        path: '/transaction',
        element: <History />,
        loader: authLoader,
    },
    {
        path: '/account',
        element: <Account />,
        loader: authLoader,
    },
    {
        path:'*',
        element:<Navigate to="/" replace/>
    }
]);
const AppRouter = () => {
    return <RouterProvider router={router} />;
};
export default AppRouter;
