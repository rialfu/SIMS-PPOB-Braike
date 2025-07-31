import { useLocation } from "react-router"
import { NavLink } from "react-router"
import logo from '../assets/images/Logo.png'
const Header =()=>{
    const location = useLocation()
    return (
        <header className=" p-4 border-b-2 border-black-600 mb-3">
            <div className="container mx-auto flex justify-between items-center">
                
                <NavLink to="/dashboard" className="ms-2 text text-lg md:text-2xl flex"><img src={logo} alt="" className='me-2' style={{width:'30px', aspectRatio:'1'}} /> Home</NavLink> 
                
                <nav>
                <ul className="flex space-x-4">
                    <li><NavLink to="/top-up" className={["font-medium text-sm md:text-lg hover:text-red-700", location.pathname == '/top-up'?'text-red-500':''].join(' ')}>Top Up</NavLink></li>
                    <li><NavLink to="/transaction" className={["font-medium text-sm md:text-lg hover:text-red-700", location.pathname == '/transaction'?'text-red-500':''].join(' ')}>Transaction</NavLink></li>
                    <li><NavLink to="/account" className={["font-medium text-sm md:text-lg hover:text-red-700", location.pathname == '/account'?'text-red-500':''].join(' ')}>Akun</NavLink></li>
                </ul>
                </nav>
            </div>
        </header>
    )
}
export default Header;