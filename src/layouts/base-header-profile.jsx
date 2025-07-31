import { useLocation, useNavigate, NavLink } from 'react-router';
import logo from '../assets/images/Logo.png'
import defaultPhoto from '../assets/images/Profile Photo.png'
import { useDispatch, useSelector } from 'react-redux';
import background from '../assets/images/Background Saldo.png'
import { updateSee } from '../state/auth-reducer';

const Layout = ({ children }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    
    const auth = useSelector((state)=>state.auth)
    console.log(auth)
    const formatterIDR = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
    return (
    <>
        <header className=" p-4 border-b-2 border-black-600 mb-3">
            <div className="container mx-auto flex justify-between items-center">
                
                <NavLink to="/dashboard" className="ms-2 text text-2xl flex"><img src={logo} alt="" className='me-2' style={{width:'30px', aspectRatio:'1'}} /> Home</NavLink> 
                
                <nav>
                <ul className="flex space-x-4">
                    <li><NavLink to="/top-up" className={["font-medium hover:text-red-700", location.pathname == '/top-up'?'text-red-500':''].join(' ')}>Top Up</NavLink></li>
                    <li><NavLink to="/transaction" className={["font-medium hover:text-red-700", location.pathname == '/transaction'?'text-red-500':''].join(' ')}>Transaction</NavLink></li>
                    <li><NavLink to="/account" className={["font-medium hover:text-red-700", location.pathname == '/account'?'text-red-500':''].join(' ')}>Akun</NavLink></li>
                </ul>
                </nav>
            </div>
        </header>
        <div className="container mx-auto px-4 mb-2 md:px-0 ">
        <div className="grid grid-cols-12 px-4 mt-4 mb-3">
            <div className="col-span-12 sm:col-span-6 md:col-span-6 mb-3">
                <img src={auth.profile.includes('/null') ?defaultPhoto: auth.profile} className="w-14 h-14 rounded-full" alt="" />
                <p className='text-sm md:text-lg'>Selamat Datang,</p>
                <p className="font-medium text-2xl md:text-4xl">{auth.first_name} {auth.last_name}</p>
            </div>
            <div className="col-span-12 sm:col-span-6 md:col-span-6">
                <div className="w-full bg-red-500 p-4 rounded-lg" style={{backgroundImage:`url(${background})`, backgroundRepeat:'no-repeat', backgroundSize:'100% 100%'}}>
                <p className="text-white text-sm mb-3">Saldo Anda</p>
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