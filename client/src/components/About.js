import React,{useEffect,useState} from 'react';
import { NavLink } from 'react-router-dom';
import './About.css';

const About = () => {

    const [burgerMenu,setBurgerMenu] = useState(false);

    useEffect(() => {
        document.getElementById('progress_bar').style.animation = 'animate 1s';
    },[]);

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

                    {/* <i class="fa-solid fa-xmark menu_close"></i> */}
                    
                    <NavLink to = '/' className = 'nav_link burger'> Home </NavLink>
                    <NavLink to = '/about' className = 'nav_link burger'> About </NavLink>
                    <NavLink to = '/' className = 'nav_link burger'> Login </NavLink>
                    <NavLink to = '/register' className = 'nav_link burger'> Register </NavLink>
                
                </div>

            </nav>

            <div className = 'about_main'>

                <h1 className = 'about_heading'> About Us </h1>

                <div className = 'about_content'>

                    <img src = './images/about_logo.svg' className = 'about_img' alt = 'team work pic'/>
                    <img src = './images/about_logo_2.svg' className = 'about_img img_2' alt = 'team work pic'/>

                    <div className = 'about_para'>
                        We are a team of three members that hope to fulfil the demands of the users 
                        in order to create highly secured , quality-looking UI for chatting with their friends
                        and families. We have been working hard to keep the privacy of the users safe from others
                        and not to try to exploit any hint of privacy breach. We are keeping a strong grip on these three features
                        to keep our app stand out : 
                        <br />

                        <div className = 'about_sub_para'>
                            <h3> High-Quality UI </h3>
                            <p>
                                From users perspective, it is very important to keep the UI feel astonishing 
                                so as to not get bored away from chatting. Nowadays, people have a high demand
                                for great quality user experience and expect a lot from the app developers. A quality-looking
                                UI always keeps any application stand out from others.
                            </p>
                        </div>

                        <div className = 'about_sub_para'>
                            <h3> Strong Authentication </h3>
                            <p>
                                Apart from quality, it is also very important to look out for any type of security issues and concerns.
                                As a team , we have been working hard to enable and integrate strong authentication features in our app 
                                so as to protect the messages of our users from any kind of security breach.
                            </p>
                        </div>

                        <div className = 'about_sub_para'>
                            <h3> Ease of Use </h3>
                            <p>
                                Keeping things simple is always a great way to keep your application stand out. 
                                Users always desire smooth and easy to use application experience so that any user from 
                                a teenager to a grown up adult man, they would not have any problem using the application. 
                            </p>
                        </div>
                    </div>

                </div>

            </div>

            <div id = 'progress_bar'> </div>

            {// Illustration by <a href="https://icons8.com/illustrations/author/kP9rc8JiBCcz">Irene M. Ray</a> from <a href="https://icons8.com/illustrations">Ouch!</a>
            }

        </React.Fragment>
    )
}
export default About;