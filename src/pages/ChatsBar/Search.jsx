import React, { useState } from 'react';
import { FaSearch } from "react-icons/fa";
import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from '../../firebase/firebase.config';
import useAuth from '../../hooks/useAuth';

const Search = () => {
    const { user } = useAuth()
    const [username, setUsername] = useState('')
    const [finedUser, setFinedUser] = useState(null)
    const [err, setErr] = useState('')
    const searchInputValue = (e) => setUsername(e.target.value)
    const searchHandle = async () => {
        const q = query(collection(db, "users"), where("displayName", "==", username));
        try {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                setFinedUser(doc.data());
            });
        } catch (error) {
            console.log(error)
            setErr(error)
        }
    }
    const selectHandler = async () => {
        const combinedId = user.uid > finedUser.uid
            ? user.uid + finedUser.uid
            : finedUser.uid + user.uid ;

        try{
            const res = await getDoc(doc(db, 'chats', combinedId))
            if(!res.exists()) {
                await setDoc(doc(db, 'chats', combinedId), {massages: []})
                await updateDoc(doc(db, 'userChats', user.uid), {
                    [combinedId+".userInfo"]: {
                        uid:finedUser.uid,
                        displayName: finedUser.displayName,
                        photoURL: finedUser.photoURL
                    },
                    [combinedId+".date"]: serverTimestamp()
                })
                await updateDoc(doc(db, 'userChats', finedUser.uid), {
                    [combinedId+".userInfo"]: {
                        uid: user.uid,
                        displayName: user.displayName,
                        photoURL: user.photoURL
                    },
                    [combinedId+".date"]: serverTimestamp()
                })
            }
        }catch (error){
            console.log(error)
            setErr(error)
        }
        setUsername(null)
        setFinedUser(null)
    }
    return (
        <div className={`${finedUser && 'border-b-2'} p-3`}>
            <div className="mb-3">
                <span className="relative">
                    <input onChange={searchInputValue} value={username} type='text' placeholder="Search User" name="SearchUser" className="input border-0 border-primary border-b-2 rounded-none w-full pr-10" required />
                    <div className="absolute right-3 top-0 bottom-0 my-auto">
                        <p onClick={searchHandle} className="swap-off fill-current text-xl">
                            <FaSearch />
                        </p>
                    </div>
                </span>
                {/* {errors.password && <span>{errors.password.message}</span>} */}
            </div>
            <div>
                {
                    finedUser && (
                        <div onClick={selectHandler} className='flex items-center gap-3'>
                            <img className='h-10 w-10 object-cover rounded-full' src={finedUser?.photoURL} alt="" />
                            <div>
                                <h3 className='font-semibold text-xl'>{finedUser?.displayName}</h3>
                                <p>Massage</p>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default Search;

/* 
usersChats:{
    userUID: {
        combinedID: {
            userInfo: {
                dn, img, id
            },
            lastMessage: '',
            data: 12/12/2023
        }
    }
}
*/