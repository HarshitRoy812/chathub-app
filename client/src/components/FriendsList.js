import React, {useState,useEffect} from 'react';
import './FriendsList.css';
import axios from 'axios';
import { Buffer } from 'buffer';

function FriendsList() {

    const [friend,setFriend] = useState(null);
    const [friendsList,setFriendsList] = useState([]);

    const searchFriend = async (e) => {

        e.preventDefault();

        const name = document.getElementById('friend_name');
        
        if (name.value == ''){
            alert('Please enter the name of the friend');
            return;
        }

        try {
            const token = localStorage.getItem('token');

            const data = await axios.post('http://localhost:3001/searchFriend',{
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
            const data = await axios.put('http://localhost:3001/friend',{
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
            const data = await axios.get('http://localhost:3001/friend',{
                headers : {
                    'Authorization' : `Bearer ${token}`
                }
            });

    
            setFriendsList(await Promise.all(
                data.data.msg.friends.map(async (ele,index) => {

                    const token = localStorage.getItem('token');

                    const data = await axios.post('http://localhost:3001/getUser',{
                        userID : ele
                    },{
                        headers : {
                            'Authorization' : `Bearer ${token}`
                        }
                    })
    
                    return <div className = 'friend_div' key = {1}>
                        <img className = 'friends_list_img' src = {`data:image/jpeg;base64,${Buffer.from(data.data.msg.profilePic.data).toString('base64')}`}/> 
                        <h1> {data.data.msg.name} </h1>
                    </div>
                })
            ))

        }
        catch (error){
            console.log(error);
        }

    }
    

    useEffect(() => {
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
                <input type = 'button' onClick = {addFriend} className = 'add_friend_btn' value = 'Add'/>
            </div>
        }

        <div className = 'friends_list'>
            {
                friendsList   
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