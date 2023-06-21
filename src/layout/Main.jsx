import React from 'react';
import { Outlet } from 'react-router-dom';
import ChatsBar from '../pages/ChatsBar/ChatsBar';

const Main = () => {
    return (
        <div className='grid grid-cols-2'>
            <ChatsBar />
            <Outlet />
        </div>
    );
};

export default Main;