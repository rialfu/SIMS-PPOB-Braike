import Header from './header'
const Layout = ({ children }) => {
    return (
        <>
            <Header/>
            
            <div className="container mx-auto">
                {children}
            </div>
            
        </>
    
    );
};

export default Layout;