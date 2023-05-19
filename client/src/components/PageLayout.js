import React,{useState} from 'react';
import './PageLayout.css';
import {Outlet,NavLink} from 'react-router-dom';


const PageLayout = () => {
    
    const [burgerMenu,setBurgerMenu] = useState(false);

    const displayBurgerContent = () => {

        const burgerContent = document.getElementById('burger_menu_content');
        const burgerBar = document.getElementById('burger_bar');

        if (!burgerMenu){
            burgerContent.style.display = 'flex';
            burgerBar.style.transform = 'rotate(90deg)';
            setBurgerMenu(true);
        }
        else {
            burgerBar.style.transform = 'rotate(0deg)';
            burgerContent.style.display = 'none';
            setBurgerMenu(false);
        }
    }

    return (
        
        <React.Fragment>
            <nav className = 'nav_bar'>
                
                <NavLink to = '/'> <img src = './images/logo.png' className = 'logo' alt = 'logo'/> </NavLink>
                

                <ul className = 'nav_links'>
                    <NavLink to = '/' className = 'nav_link'> Home </NavLink>
                    <NavLink to = '/about' className = 'nav_link'> About </NavLink>
                    <NavLink to = '/' className = 'nav_link'> Login </NavLink>
                    <NavLink to = '/register' className = 'nav_link'> Register </NavLink>
                </ul>

                <div id = 'burger_menu' onClick = {displayBurgerContent}>
                        <i className="fa-solid fa-bars" id = 'burger_bar'></i>
                </div>
                
                <div id = 'burger_menu_content'>

                    
                    <NavLink to = '/' className = 'nav_link burger'> Home </NavLink>
                    <NavLink to = '/about' className = 'nav_link burger'> About </NavLink>
                    <NavLink to = '/' className = 'nav_link burger'> Login </NavLink>
                    <NavLink to = '/register' className = 'nav_link burger'> Register </NavLink>
                
                </div>

            </nav>

            <main>

                <div className = 'main'>
                    
                    <div className = 'main_sub'>
                        <h1 className = 'main_heading'> Welcome to <span> ChatHub. </span> <br />
                        Chat freely and socially. </h1>
                        <p className = 'main_para'> 
                        
                            Welcome to ChatHub which is an amazing website application to chat with your
                            friends and families. We provide strong authentication to keep your messages and privacy safe from 
                            others. We have a beautiful-looking user interface that makes our website one of the best. Our main motive 
                            is to make chatting more easier.
                            
                        </p> 
                        

                        <button className = 'main_about_btn'> <NavLink to = '/about' className = 'nav_link_btn'> CLICK HERE TO KNOW MORE ABOUT US </NavLink> </button>
                    </div>

                    <Outlet />

                </div>

                

            </main>

            
        </React.Fragment>

    )
}
export default PageLayout;