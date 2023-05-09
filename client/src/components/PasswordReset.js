import React, {useEffect,useState,useRef} from 'react';
import './PasswordReset.css';
import axios from 'axios';
import emailjs from '@emailjs/browser';
import { useNavigate } from 'react-router-dom';

const PasswordReset = () => {

    useEffect(() => {
        document.getElementById('progress_bar').style.animation = 'animate 1s';
        setOTP(Math.floor(100000 + Math.random() * 600000));
    },[]);  

    const [email,setEmail] = useState('');
    const [otp,setOTP] = useState('');
    const [otp_ui,setOTPui] = useState(true);
    const [validation_ui,setValidation] = useState(false);
    const [changePassword_ui,setChangePassword] = useState(false);
    const [userotp,setUserOTP] = useState('');
    const navigate = useNavigate();

    const form = useRef();

    const generateOTP = async (e) => {
        
        e.preventDefault();

        var emailErr = document.getElementById('email_err');

        if (email === ''){
            emailErr.innerText = 'Please enter an email address';
            return;
        }
        

        try {
            const response = await axios.post('https://chathub-server.onrender.com/verifyEmail',{
                email : email
            })
            console.log(response);
        }
        catch (error){
            if (error.response.status === 404){
                emailErr.innerText = error.response.data.msg;
                return;
            }
        }


        emailjs.sendForm('service_dao0xr9','template_qb55s4p',form.current,'GgrFbc0tijRCUczZw')
        setValidation(true);
        setOTPui(false);
        setChangePassword(false);

    }

    const validateOTP = (e) => {
        
        e.preventDefault();

        const validateOTPMsg = document.getElementById('validate_otp_msg');

        var userOTP = parseInt(userotp);
        if (userOTP === otp){
            setOTPui(false);
            setValidation(false);
            setChangePassword(true);
        }
        else {
            validateOTPMsg.innerText = 'Incorrect OTP';
        }   
    }

    const [newPassword,setNewPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('');

    const changePassword = async (e) => {
        e.preventDefault();

        var changePasswordMsg = document.getElementById('change_password_msg');
        var successMsg = document.getElementById('password_change_success');

        if (newPassword === '' || confirmPassword === ''){
            changePasswordMsg.innerText = 'Please fill all the details';
            return;
        }

        if (newPassword !== confirmPassword) {
            changePasswordMsg.innerText = 'Passwords do not match!';
            return;
        }

        try {
            const response = await axios.post('https://chathub-server.onrender.com/changePassword',{
                email : email,
                password : newPassword
            })
            successMsg.innerText = response.data.msg;
        }
        catch (error){
            return;
        }

        setTimeout(() => {
            navigate('/');
        },1000);
    }



    return (
        
        <React.Fragment>

            <div className = 'password_reset_form'>

                <h1 className = 'heading'> Reset your password </h1>

                <form ref = {form} onSubmit = {generateOTP}>

                    {
                    
                    otp_ui && 
                    
                    <div className = 'form_group_password'>
                        
                        <label> Enter your E-Mail </label> <br />
                        <input type = 'email' name = 'user_email' onChange = {(e) => setEmail(e.target.value)} id = 'email' className = 'form_input'/>
                        <textarea className = 'inputtext' value = {otp} name = 'message' />
                        <input className = 'inputtext' type = 'text' name = 'from_name' value = 'ChatHub Team' />
                        
                        <p id = 'email_err'> </p>

                        <input type = 'submit' className = 'otp_btn' value = 'SEND OTP' />

                    </div>


                    }

                    

                </form>

                {
                
                validation_ui && 
                
                <form onSubmit = {validateOTP}>
                    <div className = 'validate_otp_div'>
                        <label className = 'validate_otp_label'> Enter the OTP </label> <br />

                        <input type = 'text' id = 'validate_top_input' value = {userotp} onChange = {(e) => setUserOTP(e.target.value)} className = 'otp_input' maxLength = '6'/>

                        <p id = 'validate_otp_msg'> </p>
                        <p id = 'pw_change_success'> </p>

                        <input type = 'submit' className = 'validate_btn' value = 'Validate OTP'/>
                    </div>
                </form>
                
                }

                {
                    changePassword_ui

                    &&
                    
                    <form onSubmit = {changePassword}>

                        <div className = 'change_password_form'>
                            <div>
                                <label> Enter a new Password </label> <br />
                                <input type = 'password' onChange = {(e) => setNewPassword(e.target.value)} className = 'form_input'/>
                            </div>

                            <div>
                                <label> Confirm Password </label> <br />
                                <input type = 'password' onChange = {(e) => setConfirmPassword(e.target.value)} className = 'form_input'/>
                            </div>

                            <p id = 'password_change_success'> </p>

                            <input type = 'submit' className = 'change_pw_btn' value = 'Change Password' />
                        </div>

                    </form>
                }
            
            
            </div>

            <div id = 'progress_bar'> </div>

        </React.Fragment>

        
    )
}
export default PasswordReset;