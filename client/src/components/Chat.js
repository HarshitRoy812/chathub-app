import React,{useEffect,useState} from 'react';
import './Chat.css';
import { useSearchParams,NavLink} from 'react-router-dom';
import userjoined from './user_joined.mp3';
import { Buffer } from 'buffer';
const io = require('socket.io-client');

const ENDPOINT = 3001;
const socket = io(`http://localhost:${ENDPOINT}`);

const Chat = () => {

    const [searchParams] = useSearchParams();
    const [name,setName] = useState('');
    const [room,setRoom] = useState('');
    const [image,setImage] = useState([]);
    const [message,setMessage] = useState('');

    
    

    useEffect(() => {

        setName(searchParams.get('name'));
        setRoom(searchParams.get('room'));
        setImage(searchParams.get('img'));

        const userName = searchParams.get('name');
        const userImage = searchParams.get('img');
        const roomName = searchParams.get('room');
        
        socket.emit('join_room',roomName);
        socket.emit('user_joined',[userName,userImage,roomName]);
        

        socket.on('user_joined',(msg) => {
            var audio = new Audio(userjoined);
            audio.play();
            welcomeMessage(msg);
        })  

        socket.on('recieve_message',(msg,user) => {
            postMessage(msg,user);
        })

    },[ENDPOINT]);



    const welcomeMessage = (msg) => {   
        var container = document.getElementById('chat_container');

        var div = document.createElement('div');
        div.className = 'welcome_message';
        
        var p = document.createElement('p');
        p.textContent = msg;

        div.appendChild(p);
        container.appendChild(div);
    }    

    const sendMessage = (e) => {

        e.preventDefault();

        socket.emit('send_message',message);
        setMessage('');
    }


    const postMessage = (msg,user) => {

        var container = document.getElementById('chat_container');

        var div = document.createElement('div');
        div.className = 'textMessage';

        var textMessage = document.createElement('p');
        textMessage.textContent = msg;

        // var img = document.createElement('img');
        // img.src = `data:image/jpeg;base64,${Buffer.from(user[1]).toString('base64')}`;
        
        div.appendChild(textMessage);
        //div.appendChild(img);


        container.appendChild(div);
        

    }

    

    

    return (
        
        <div id = 'chat_main'>

            <div id = 'chat_header'>

                <h1> Welcome {name}, you have joined Room {room} !</h1>

                <button id = 'leaveroom_btn'> <NavLink to = '/dashboard' className = 'leaveroom_link'> Leave Room <i class="fa-solid fa-right-from-bracket"></i>  </NavLink> </button>

            </div>

            <div id = 'chat_UI'>

                <div id = 'chat_container'>



                </div>
            

                <form onSubmit = {sendMessage}>
                    <div id = 'chat_utils'>
                    
                    <input type = 'text' value = {message} className = 'chat_message' onChange = {(e) => setMessage(e.target.value)} className = 'chat_message' />
                    <input type = 'submit' className = 'send_message_btn' value = 'Send Message' />
                
                    </div>
                </form>

            </div>  

        </div>

    )

}

export default Chat;