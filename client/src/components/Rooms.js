import React from 'react';
import './Rooms.css';
import {NavLink} from 'react-router-dom';

const Rooms = () => {

    return (
        <div id = 'rooms'>

            <div className = 'room'>
                <NavLink to = '/chat?room=roomone' className = 'room_navlink'> <h1> Join Room 1 </h1> </NavLink>
            </div>

            <div className = 'room'>
                <NavLink to = '/chat?room=roomTwo' className = 'room_navlink'> <h1> Join Room 2 </h1> </NavLink>
            </div>

            <div className = 'room'>
                <NavLink to = '/chat?room=roomThree' className = 'room_navlink'> <h1> Join Room 3 </h1> </NavLink>
            </div>

        </div>
    )

}

export default Rooms;
