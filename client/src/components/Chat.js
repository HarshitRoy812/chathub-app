import React,{useEffect} from 'react';
import './Chat.css';
import queryString from 'query-string';
import { useSearchParams } from 'react-router-dom';

const Chat = () => {

    const [searchParams] = useSearchParams();

    useEffect(() => {
        
        
        console.log(searchParams.get('room'));

    },[]);

    return (
        <h1> a </h1>
    )

}

export default Chat;