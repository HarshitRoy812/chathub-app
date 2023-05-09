import React, {useState,useEffect} from 'react';
import './FriendsList.css';
import axios from 'axios';
import { Buffer } from 'buffer';
import {nanoid} from 'nanoid';
const io = require('socket.io-client');


function FriendsList(props) {

    var socket;
    const ENDPOINT = 3001;

    const [friend,setFriend] = useState(null);
    const [friendsList,setFriendsList] = useState([]);

    const searchFriend = async (e) => {

        e.preventDefault();

        const name = document.getElementById('friend_name');

        if (props.name == name.value){
            alert('Cannot add friend to self');
            return;
        }
        
        if (name.value == ''){
            alert('Please enter the name of the friend');
            return;
        }

        try {
            const token = localStorage.getItem('token');

            const data = await axios.post('https://chathub-server.onrender.com/searchFriend',{
                name : name.value
            },
            {
                headers : {
                    'Authorization' : `Bearer ${token}`
                }
            })
            
            setFriend(data.data.msg);
            

        }
        catch (error){
            alert(error.response.data.msg);
        }

    }


    const addFriend = async (e) => {     

        e.preventDefault();
 
        const token = localStorage.getItem('token');

        
        try {
            const data = await axios.put('https://chathub-server.onrender.com/friend',{
                friendData : friend
            },{
                headers : {
                    'Authorization' : `Bearer ${token}`
                }
            })

            displayFriendsList();
        }
        catch (error){
            console.log(error);
        }


    }

    const displayFriendsList = async () => {

        const token = localStorage.getItem('token');

        try {
            const data = await axios.get('https://chathub-server.onrender.com/friend',{
                headers : {
                    'Authorization' : `Bearer ${token}`
                }
            });

    
            setFriendsList(await Promise.all(
                data.data.msg.friends.map(async (ele,index) => {

                    const token = localStorage.getItem('token');

                    const data = await axios.post('https://chathub-server.onrender.com/getUser',{
                        userID : ele
                    },{
                        headers : {
                            'Authorization' : `Bearer ${token}`
                        }
                    })
    
                    return <div id = 'friend_div' key = {nanoid()}>
                        <img className = 'friends_list_img' src = {`data:image/jpeg;base64,${Buffer.from(data.data.msg.profilePic.data).toString('base64')}`}/> 
                        <div className = 'friend_sub_div'>
                            <h1> {data.data.msg.name} </h1>
                        </div>
                    </div>
                })
            ))

        }
        catch (error){
            console.log(error);
        }

        displayFriendsStatus();
    }


    const displayFriendsStatus = () => {
        

        var divs = document.querySelectorAll('#friend_div');

        for (let i = 0; i < divs.length; i++){
            const name = divs[i].innerText;


            socket.emit('get_status',name);
    
            socket.on('user_status',(status,user_name) => {
                if (user_name == name){

                    let p = document.createElement('p');
                    p.className = 'friend_status';
                    var subDiv = divs[i].getElementsByClassName('friend_sub_div');
                    subDiv[0].appendChild(p);

                    if (status){
                        p.innerHTML = '<i class="fa-sharp fa-solid fa-circle indicator"></i>Online';
                    }
                    else {
                        p.innerHTML = '<i class="fa-sharp fa-solid fa-circle indicator" id = "red"></i>Offline';
                }
                }

                
            })
            

        }
        
    }
    

    useEffect(() => {

        socket = io('https://chathub-server.onrender.com');

        displayFriendsList();

        
    },[]);
    

    return (
    
    <form className = 'friends_component' onSubmit = {searchFriend}>
        <div className = 'friends_list_form'>
            <input type = 'text' id = 'friend_name' className = 'form_input' placeholder = 'Search for a friend'/>
            <input type = 'submit' className = 'friends_btn' value = 'Search' />
        </div>

        {
            
            friend
            &&
            <div className = 'searched_friend'>
                <img id = 'friend_img' src = {`data:image/jpeg;base64,${Buffer.from(friend.profilePic.data).toString('base64')}`}/>
                <label> {friend.name} </label>
                <input type = 'button' onClick = {addFriend} className = 'add_friend_btn' value = '+'/>
            </div>
        }

        <div className = 'friends_list'>
            {
                <>
                    {friendsList}
                </>   
            }
            {
                !friendsList 
                &&
                <h1 className = 'friends_heading'> No friends in the list ! </h1>
            }
        </div>

    </form>
    

    )
}

export default FriendsList;