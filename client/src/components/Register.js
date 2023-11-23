import React,{useEffect,useState} from 'react';
import './Register.css';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

const Register = () => {    

    useEffect(() => {
        document.getElementById('progress_bar').style.animation = 'animate 1s';
    },[]);

    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [file,setFile] = useState(null);

    const [data,setData] = useState([]);



    const [passwordVisible,togglePassword] = useState(false);
    

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        
        formData.append('name',name);
        formData.append('email',email);
        formData.append('password',password);
        formData.append('profile_pic',file);

        var errorMsg = document.getElementById('error_msg');

        try {
            const response = await axios({
                method : "POST",
                url : "http://localhost:3001/register",
                data : formData,
                headers : {"Content-Type" : "multipart/form-data"}
            });

            setData(response.data.data);
        }
        catch (error){
            errorMsg.innerText = error.response.data.msg;
        }   

        setName('');
        setEmail('');
        setPassword('');
    }

    const showPassword = () => {
        togglePassword(true);

        const password = document.getElementById('password');
        password.type = 'text';

    }
    
    const hidePassword = () => {
        togglePassword(false);

        const password = document.getElementById('password');
        password.type = 'password';
    }

    return (
        <div className = 'registration_form' id = 'register_form'>
            <form onSubmit = {handleRegisterSubmit}>
                <h1 className = 'form_heading'> Register your account. </h1>

                <div className = 'form_row'>
                    <div className = 'form_group'>
                        <label className = 'form_label'> Name </label> <br />
                        <input type = 'text' value = {name} onChange = {(event) => setName(event.target.value)} className = 'form_input' />
                    </div>

                    <div className = 'form_group'>
                        <label className = 'form_label'> Email </label> <br />
                        <input type = 'email' value = {email} onChange = {(event) => setEmail(event.target.value)} className = 'form_input' />
                    </div>
                </div>

                <div className = 'form_row'>
                    <div className = 'form_group'>
                        <label className = 'form_label'> Password </label> <br />
                        <input type = 'password' value = {password} id = 'password' onChange = {(event) => setPassword(event.target.value)} className = 'form_input' />
                        
                        {
                            !passwordVisible ? <i className="fa-solid fa-eye-slash password_toggle" onClick = {showPassword}></i> : <i className="fa-solid fa-eye password_toggle" onClick = {hidePassword}></i>
                        }
                    </div>

                    <div className = 'form_group'>

                        <label className = 'form_label'> Upload Your Pic </label> <br /> <br />
                        <input type = 'file' id = 'pic' name = 'profile_pic' onChange = {(e) => setFile(e.target.files[0])} className = 'file_input' />
                        <label htmlFor = 'pic' className = 'file_label'> Choose file </label>
        
                    </div>
                    
                </div>


                <div className = 'form_row'>
                    <input type = 'submit' className = 'form_submit_btn register_submit_btn' value = 'Register' /> 

                    <p id = 'error_msg'> </p>
                </div>

                <NavLink to = '/' className = 'register_navlink'> Have an account? Click here to login </NavLink>

            </form>

            <div id = 'progress_bar'> </div>
        </div>
    )
}

export default Register;