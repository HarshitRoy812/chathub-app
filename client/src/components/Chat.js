import React,{useEffect,useState} from 'react';
import './Chat.css';
import { useSearchParams,useNavigate} from 'react-router-dom';
import userJoined from './sound_effects/user_joined.mp3';
import messageSent from './sound_effects/message_sent.mp3';
import userDisconnected from './sound_effects/user_disconnected.mp3';
import { Buffer } from 'buffer';
import axios from 'axios';

const io = require('socket.io-client');

const ENDPOINT = 3001;
var socket;



const Chat = () => {

    const [searchParams] = useSearchParams();
    const [name,setName] = useState('');
    const [room,setRoom] = useState('');
    const [message,setMessage] = useState('');

    const navigate = useNavigate();

    useEffect(() => {

        socket = io(`http://localhost:${ENDPOINT}`);



        setName(searchParams.get('name'));
        setRoom(searchParams.get('room'));

        const userName = searchParams.get('name');
        const roomName = searchParams.get('room');




        socket.emit('join_room',roomName);
        socket.emit('user_joined',[userName,roomName]);
        

        socket.on('user_joined',(msg) => {
            var audio = new Audio(userJoined);
            audio.play();
            welcomeMessage(msg);
        })  

        socket.on('receive_message',(msg,user,time) => {
            var audio = new Audio(messageSent);
            audio.play();
            postMessage(msg,user,time);
        })

        socket.on('disconnected',(user) => {
            var audio = new Audio(userDisconnected);
            audio.play();
            leftRoomMessage(user);
        })

    },[]);



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

        if (message == ''){
            alert('Please enter a message to send !');
            return;
        }

        socket.emit('send_message',message);
        var audio = new Audio(messageSent);
        audio.play();
        postSelfMessage();
        setMessage('');
    }


    const postSelfMessage = async () => {
        var container = document.getElementById('chat_container');

        var div = document.createElement('div');
        div.className = 'textMessageSelf';

        var textMessage = document.createElement('p');
        textMessage.textContent = message;

        var user_name = document.createElement('p');
        user_name.textContent = 'You';
        user_name.className = 'message_username_self';

        const date = new Date();

        let time = date.getHours() + ":" + date.getMinutes();

        var cur_time = document.createElement('p');
        cur_time.textContent = time;
        cur_time.className = 'time_self';

        var firstDiv = document.createElement('div');
        firstDiv.className = 'first_div_self';
        firstDiv.appendChild(cur_time);
        firstDiv.appendChild(textMessage);

        var secondDiv = document.createElement('div');
        secondDiv.className = 'second_div_self';
        secondDiv.appendChild(user_name);

        const token = localStorage.getItem('token');

        var data;
        try {
            data = await axios.post('http://localhost:3001/getUserByName',{
            userName : name
            },{
                headers : {
                    'Authorization' : `Bearer ${token}`
                }
            })
        }
        catch (error){
            console.log(error);
        }


        var img = document.createElement('img');
        img.src = `data:image/jpeg;base64,${Buffer.from(data.data.msg.profilePic.data).toString('base64')}`;
        img.className = 'img';
       
        firstDiv.appendChild(img);

        div.appendChild(firstDiv);
        div.appendChild(secondDiv);

        container.appendChild(div);
    }

    const postMessage = async (msg,user,time) => {

        var container = document.getElementById('chat_container');

        var div = document.createElement('div');
        div.className = 'textMessage';

        var textMessage = document.createElement('p');
        textMessage.textContent = msg;
        textMessage.className = 'message';

        var user_name = document.createElement('p');
        user_name.textContent = user[0];
        user_name.className = 'message_username';

        var cur_time = document.createElement('p');
        cur_time.textContent = time;
        cur_time.className = 'time';

        var firstDiv = document.createElement('div');
        firstDiv.className = 'first_div_self';
        

        var secondDiv = document.createElement('div');
        secondDiv.className = 'second_div';
        secondDiv.appendChild(user_name);
        
        const token = localStorage.getItem('token');

        var data;
        try {
            data = await axios.post('http://localhost:3001/getUserByName',{
            userName : user[0]
            },{
                headers : {
                    'Authorization' : `Bearer ${token}`
                }
            })
        }
        catch (error){
            console.log(error);
        }

        var img = document.createElement('img');
        img.src = `data:image/jpeg;base64,${Buffer.from(data.data.msg.profilePic.data).toString('base64')}`;
        img.className = 'img_alt';

        firstDiv.appendChild(img);
        firstDiv.appendChild(textMessage);
        firstDiv.appendChild(cur_time);
        
        
        

        div.appendChild(firstDiv);
        div.appendChild(secondDiv);
        container.appendChild(div);
    }


    const leftRoomMessage = (user) => {
        var container = document.getElementById('chat_container');

        var div = document.createElement('div');
        div.className = 'disconnected_message';

        var p = document.createElement('p');

        p.textContent = user[0] + " has left the chat";

        div.append(p);
        container.append(div);

    }

    const leaveRoom = () => {
        socket.emit('clientDisconnect');
        navigate('/dashboard');
    }

    

    return (
        
        <div id = 'chat_main'>

            <div id = 'chat_header'>

                <h1> Welcome {name}, you have joined Room {room} !</h1>

                <button id = 'leaveroom_btn' onClick = {leaveRoom}> Leave Room <i class="fa-solid fa-right-from-bracket"></i> </button>

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