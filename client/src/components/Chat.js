import React,{useEffect,useState} from 'react';
import './Chat.css';
import { useSearchParams,useNavigate} from 'react-router-dom';
import userJoined from './sound_effects/user_joined.mp3';
import messageSent from './sound_effects/message_sent.mp3';
import userDisconnected from './sound_effects/user_disconnected.mp3';
import { Buffer } from 'buffer';
import axios from 'axios';

const io = require('socket.io-client');

var socket;



const Chat = () => {

    const [searchParams] = useSearchParams();
    const [name,setName] = useState('');
    const [room,setRoom] = useState('');
    const [message,setMessage] = useState('');
    const navigate = useNavigate();



    useEffect(() => {
        
        socket = io('http://localhost:3001');



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


        socket.emit('get_users','Alpha');

        socket.on('users',(users) => {
            updateUsers(users);
        });

        socket.on('receive_video',async (msg,user,time) => {

            const blob = new Blob([msg],{type : 'video/mp4'});

            const videoURL = URL.createObjectURL(blob);

            const videoElement = document.createElement('video');
            videoElement.src = videoURL;
            videoElement.controls = true;
            videoElement.className = 'video_msg';

            var container = document.getElementById('chat_container');

            var div = document.createElement('div');
            div.className = 'textMessage';

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

            var a = document.createElement('a');
            a.href = videoURL;
            a.download = 'video.mp4';

            var button = document.createElement('button');
            button.className = 'file_download_btn';
            button.innerHTML = '<i class="fa-solid fa-download"></i>';
            a.appendChild(button);

            firstDiv.appendChild(img);
            firstDiv.appendChild(videoElement);
            firstDiv.appendChild(a);
            firstDiv.appendChild(cur_time);

            div.appendChild(firstDiv);
            div.appendChild(secondDiv);

            container.appendChild(div);
            container.scrollTop = container.scrollHeight;
            
        })

        socket.on('receive_pic',async (msg,user,time) => {
            
            var img_src;

            const blob = new Blob([msg.body],{type : msg.type})

            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                img_src = reader.result;
            }



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


            var img_msg = document.createElement('img');

            img_msg.src = img_src;
            img_msg.className = 'img_msg';

            var a = document.createElement('a');
            a.href = img_src;
            a.download = 'image.png';

            var button = document.createElement('button');
            button.className = 'file_download_btn';
            button.innerHTML = '<i class="fa-solid fa-download"></i>';
            a.appendChild(button);

            firstDiv.appendChild(img);
            firstDiv.appendChild(img_msg);
            firstDiv.appendChild(a);
            firstDiv.appendChild(cur_time);

            div.appendChild(firstDiv);
            div.appendChild(secondDiv);
            container.appendChild(div);
            container.scrollTop = container.scrollHeight;

        })

        socket.on('receive_audio',async (msg,user,time) => {

            const blob = new Blob([msg],{type : 'audio/,mp3'});

            const objectURL = URL.createObjectURL(blob);

            const audioElement = document.createElement('audio');
            audioElement.src = objectURL;
            audioElement.className = 'audio_element';
            audioElement.controls = true;

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

            var a = document.createElement('a');
            a.href = objectURL;
            a.download = 'audio.mp3';

            var button = document.createElement('button');
            button.className = 'file_download_btn';
            button.innerHTML = '<i class="fa-solid fa-download"></i>';
            a.appendChild(button);

            firstDiv.appendChild(img);
            firstDiv.appendChild(audioElement);
            firstDiv.appendChild(a);
            firstDiv.appendChild(cur_time);

            div.appendChild(firstDiv);
            div.appendChild(secondDiv);
            container.appendChild(div);
            container.scrollTop = container.scrollHeight;

        })

    },[searchParams]);

    const updateUsers = (users) => {

        var usersDiv = document.getElementById('users');

        usersDiv.innerHTML = '';
    
            users.forEach(async (user) => {
    
                var data;
                var token = localStorage.getItem('token');
                try {
                    data = await axios.post('http://localhost:3001/getUserByName',{
                        userName : user
                    },{
                        headers : {
                            'Authorization' : `Bearer ${token}`
                        }
                    })
                    
                }
                catch (err){
                    console.log(err);
                }
    
                let p = document.createElement('p');
                let img = document.createElement('img');
    
                img.src = `data:image/jpeg;base64,${Buffer.from(data.data.msg.profilePic.data).toString('base64')}`;
                img.className = 'users_img';
    
                p.className = 'user_name';
                p.textContent = user;
    
                let childDiv = document.createElement('div');
                childDiv.className = 'room_users_childdiv';
    
                childDiv.appendChild(img);
                childDiv.appendChild(p);
    
                usersDiv.appendChild(childDiv);
            })
    }



    

    const welcomeMessage = (msg) => {   
        var container = document.getElementById('chat_container');

        var div = document.createElement('div');
        div.className = 'welcome_message';
        
        var p = document.createElement('p');
        p.textContent = msg;

        div.appendChild(p);
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    }    

    const sendMessage = (e) => {

        e.preventDefault();

        if (message === ''){
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

        container.scrollTop = container.scrollHeight;
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

        
        container.scrollTop = container.scrollHeight;
    }


    const leftRoomMessage = (user) => {
        var container = document.getElementById('chat_container');

        var div = document.createElement('div');
        div.className = 'disconnected_message';

        var p = document.createElement('p');

        p.textContent = user[0] + " has left the chat";

        div.append(p);
        container.append(div);
        container.scrollTop = container.scrollHeight;

    }

    const leaveRoom = () => {
        socket.emit('clientDisconnect');
        navigate('/dashboard');
    }


    
    const sendPic = async (e) => {

        const picMessage = {
            type : 'file',
            body : e.target.files[0],
            mimeType : e.target.files[0].type,
            fileName : e.target.files[0].name
        }


        socket.emit('send_pic',picMessage);

        var img_msg = document.createElement('img');
        img_msg.className = 'img_msg';

        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onloadend = () => {
            img_msg.src = reader.result;
        }
        
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
        firstDiv.appendChild(img_msg);

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
        container.scrollTop = container.scrollHeight;


    }

    const sendVideo = (e) => {
        
        const file = e.target.files[0];
        
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        
        var videoData;

        reader.onload = async (e) => {
            videoData = e.target.result;
            const blob = new Blob([videoData],{type : 'video/mp4'});

            const videoURL = URL.createObjectURL(blob);

            const videoElement = document.createElement('video');
            videoElement.src = videoURL;
            videoElement.controls = true;
            videoElement.className = 'video_msg';

            var container = document.getElementById('chat_container');

            var div = document.createElement('div');
            div.className = 'textMessageSelf';


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
            firstDiv.appendChild(videoElement);

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

            container.scrollTop = container.scrollHeight;

            socket.emit('send_video',videoData);
        }  
    }

    const sendAudio = (e) => {

        const file = e.target.files[0];
        const reader = new FileReader();

        reader.readAsArrayBuffer(file);

        reader.onload = async () => {
            const buffer = reader.result;
            

            socket.emit('send_audio',buffer);

            const blob = new Blob([buffer],{type : 'audio/,mp3'});

            const objectURL = URL.createObjectURL(blob);

            const audioElement = document.createElement('audio');

            audioElement.src = objectURL;
            audioElement.controls = true;
            audioElement.className = 'audio_element';
            

            var container = document.getElementById('chat_container');

            var div = document.createElement('div');
            div.className = 'textMessageSelf';


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
            firstDiv.appendChild(audioElement);

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
            container.scrollTop = container.scrollHeight;

        }

        reader.onerror = (err) => {
            console.log(err);
        }

    }



    return (
        
        <div id = 'chat_main'>

            <div id = 'chat_header'>

                <h1> Welcome {name}, you have joined Room {room} !</h1>

                <button id = 'leaveroom_btn' onClick = {leaveRoom}> Leave Room <i className="fa-solid fa-right-from-bracket"></i> </button>

            </div>

            <div id = 'chat_sub_main'>
                

                <div id = 'room_users'>

                    <h1> Room Users </h1>

                    <div id = 'users'>

                    </div>

                </div>

                <div id = 'chat_UI'>

                    <div id = 'chat_container'>



                    </div>


                    <form onSubmit = {sendMessage}>
                        <div id = 'chat_utils'>
                        
                        {/* File handler for sending pics */}
                        <input type = 'file' accept = 'image/png, image/jpeg' id = 'message_pic' onChange = {(e) => sendPic(e)} className = 'chat_file'/>
                        <label htmlFor = 'message_pic' className = 'message_pic_label'> <i className="fa-solid fa-camera"></i> </label>

                        {/* File handler for sending videos */}                
                        <input type = 'file' accept = 'video/mp4, video/webm, video/ogg' className = 'chat_file' id = 'message_video' onChange = {(e) => sendVideo(e)} />
                        <label htmlFor = 'message_video' className = 'message_pic_label video'> <i className="fa-solid fa-video"></i> </label>

                        {/* File handler for sending audios */}
                        <input type = 'file' accept = 'audio/mp3' className = 'chat_file' id = 'message_audio' onChange = {(e) => sendAudio(e)} />
                        <label htmlFor = 'message_audio' className = 'message_pic_label audio'> <i class="fa-solid fa-music"></i> </label>
                        
                        <input type = 'text' value = {message} className = 'chat_message' onChange = {(e) => setMessage(e.target.value)}/>
                        <input type = 'submit' className = 'send_message_btn' value = 'Send Message' />

                        </div>
                    </form>

                    <div id = 'video_div'>

                    </div>

                </div>

            </div>  

        </div>

    )

}

export default Chat;