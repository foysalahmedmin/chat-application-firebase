import { doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebase.config';
import useAuth from '../../hooks/useAuth';

const ChatsUsers = () => {
    const { user } = useAuth()
    const [chats, setChats] = useState()
    useEffect(() => {
        if (user) {
            const unsub = onSnapshot(doc(db, "userChats", user.uid), (doc) => {
                setChats(doc.data())

                return () => {
                    unsub;
                }
            });
        }
    }, [user])
    console.log(Object.entries(chats))
    return (
        <div className='p-3'>
            {
                Object.entries(chats)?.map(chat => <div key={chat[0]} className='flex items-center gap-3'>
                    <img className='h-10 w-10 object-cover rounded-full' src={chat[1].userInfo.photoURL} alt="" />
                    <div>
                        <h3 className='font-semibold text-xl'>{chat[1].userInfo.displayName}</h3>
                        <p>{chat[1].userInfo.lastMassage?.text}</p>
                    </div>
                </div>)
            }
        </div>
    );
};

export default ChatsUsers;