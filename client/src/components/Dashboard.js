import React,{useState,useEffect} from 'react';
import './Dashboard.css';
import axios from 'axios';
import { NavLink,useNavigate } from 'react-router-dom';
import {Buffer} from 'buffer';
import FriendsList from './FriendsList';
import Rooms from './Rooms';


const Dashboard = () => {

    const [data,setData] = useState([]);
    const [componentLoaded, setComponentLoaded] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {

        const fetchData = () => {

            const token = localStorage.getItem('token');

            axios.get('https://chathub-server.onrender.com/dashboard', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            })
            .then((response) => {
                setData(response.data.msg);
                setComponentLoaded(true);

            })
            .catch((error) => {
                navigate('/');
            });
        }
        
        fetchData();

    },[]);


    return (
        <>

        {
            componentLoaded && 

            
            <div className = 'header_div'>

                <div className = 'header_profile'>

                    <img id = 'profile_pic' src = {`data:image/jpeg;base64,${Buffer.from(data.profilePic.data).toString('base64')}`}/>

                    <h1 id = 'name'> {data.name} </h1> 

                    <p id = 'joined'> Joined {data.joinedAt} </p>

                    <p id = 'status'> <i className="fa-sharp fa-solid fa-circle indicator"></i>Online</p>
                    
            
                </div>

                <NavLink to = '/' id = 'nav_link'> <button id = 'log_out_btn'> Log Out <i className="fa-solid fa-power-off"></i> </button> </NavLink>
                    
            </div>

            
        }

        <div id = 'main'>
            {
                componentLoaded
                &&
                <>
                    <Rooms name = {data.name}/>

                    <FriendsList name = {data.name} />
                </>
            }
        </div>

        

        </>
    )
}

export default Dashboard;