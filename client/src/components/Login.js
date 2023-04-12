import React, {useEffect,useState} from 'react';
import './Login.css';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

const Login = () => {

    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');

    useEffect(() => {
        document.getElementById('progress_bar').style.animation = 'animate 1s';
    },[]);

    
    
    const loginToAccount = async (e) => {
        e.preventDefault();


        var errorMsg = document.getElementById('login_error_msg');
        
        try {
            const response = await axios.post('http://localhost:3001/login',{
                email : email,
                password : password
            })

            localStorage.setItem('token',response.data.token);
        }
        catch (error){
            errorMsg.innerText = error.response.data.msg;
        }

        setEmail('');
        setPassword('');
    }

    

    return (
        <div className = 'login_form'>
            <form>
                <h1 className = 'form_heading'> Login to your account.  </h1>

                <div className = 'form_group'>
                    <label className = 'form_label'> Email </label> <br />
                    <input type = 'email' value = {email} className = 'form_input' onChange = {(event) => setEmail(event.target.value)}/>
                </div>

                <div className = 'form_group'>
                    <label className = 'form_label'> Password </label> <br />
                    <input type = 'password' value = {password} className = 'form_input' onChange = {(event) => setPassword(event.target.value)}/>
                </div>

                <div className = 'form_group'>
                    <input type = 'submit' onClick = {loginToAccount} className = 'form_submit_btn' value = 'Login' onChange = {(event) => setPassword(event.target.value)}/>

                    <p id = 'login_error_msg'> </p>
                </div>

                <div className = 'form_group password_reset'>
                    <p> Forgot Password ? </p>
                    <NavLink to = '/resetpassword'> Click here to reset your password </NavLink>
                </div>

                <div className = 'form_group password_reset'>
                    <NavLink to = '/register' className = 'create_account'> Create your account </NavLink>
                </div>

            </form>

            <div id = 'progress_bar'> </div>
        </div>
    )
}
export default Login;