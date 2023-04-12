import React from 'react';
import './App.css';
import PageLayout from './components/PageLayout';
import Login from './components/Login';
import Register from './components/Register';
import About from './components/About';
import PasswordReset from './components/PasswordReset';
import {BrowserRouter,Routes,Route} from 'react-router-dom';

const App = () => {
    return (
        <React.Fragment>


        <BrowserRouter>
            <Routes>
                <Route path = "/" element = {<PageLayout />}>
                    <Route index element = {<Login />} />
                    <Route path = '/register' element = {<Register />} />
                    <Route path = '/resetpassword' element = {<PasswordReset />} />
                </Route>  
                <Route path = '/about' element = {<About />}>
                    
                </Route>

            </Routes>
        </BrowserRouter>

        <div id = 'progress_bar'>

        </div>

        </React.Fragment>
    )
}

export default App;