import React from 'react';
import './Rooms.css';
import {NavLink} from 'react-router-dom';

const Rooms = (props) => {

    return (
        <div id = 'rooms'>

            <div className = 'room'>
                <NavLink to = {`/chat?room=Alpha&name=${props.name}&img=${props.img}`} className = 'room_navlink'> <h1> Join Room Alpha</h1> </NavLink>
            </div>

            <div className = 'room'>
                <NavLink to = {`/chat?room=Beta&name=${props.name}&img=${props.img}`} className = 'room_navlink'> <h1> Join Room Beta </h1> </NavLink>
            </div>

            <div className = 'room'>
                <NavLink to = {`/chat?room=Alpha&name=${props.name}&img=${props.img}`} className = 'room_navlink'> <h1> Join Room 3 </h1> </NavLink>
            </div>

        </div>
    )

}

export default Rooms;
