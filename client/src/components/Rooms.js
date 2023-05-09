import React, { useEffect, useState } from 'react';
import './Rooms.css';
import {NavLink} from 'react-router-dom';

const io = require('socket.io-client');
const ENDPOINT = 3001;
var socket;


const Rooms = (props) => {

    const [userCount1,setUserCount1] = useState(0);
    const [userCount2,setUserCount2] = useState(0);
    const [userCount3,setUserCount3] = useState(0);

    useEffect(() => {
        socket = io('https://chathub-server.onrender.com');

        socket.emit('getUserCountAlpha');
        socket.emit('getUserCountBeta');
        socket.emit('getUserCountTetra');

        socket.on('user_count_1',(count) => {
            setUserCount1(count);
        })
        socket.on('user_count_2',(count) => {
            setUserCount2(count);
        })
        socket.on('user_count_3',(count) => {
            setUserCount3(count);
        })
    
    },[]);

    

    return (
        <div id = 'rooms'>

            <div className = 'room'>
                <NavLink to = {`/chat?room=Alpha&name=${props.name}`} className = 'room_navlink'> <h1> Join Room Alpha</h1> </NavLink>
                {
                    userCount1 >= 0
                    &&
                    <div className = 'user_count_div'>
                        <i class="fa-sharp fa-solid fa-circle indicator"></i>
                        <p className = 'user_count'> {userCount1} users are online </p>
                    </div>
                }
            </div>

            <div className = 'room'>
                <NavLink to = {`/chat?room=Beta&name=${props.name}`} className = 'room_navlink'> <h1> Join Room Beta </h1> </NavLink>

                {
                    userCount2 >= 0
                    &&
                    <div className = 'user_count_div'>
                        <i class="fa-sharp fa-solid fa-circle indicator"></i>
                        <p className = 'user_count'> {userCount2} users are online </p>
                    </div>
                }
            </div>

            <div className = 'room'>
                <NavLink to = {`/chat?room=Tetra&name=${props.name}`} className = 'room_navlink'> <h1> Join Room Tetra </h1> </NavLink>

                {
                    userCount3 >= 0
                    &&
                    <div className = 'user_count_div'>
                        <i class="fa-sharp fa-solid fa-circle indicator"></i>
                        <p className = 'user_count'> {userCount3} users are online </p>
                    </div>
                }

            </div>

        </div>
    )

}

export default Rooms;
