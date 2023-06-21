import { useState } from "react";
import useAuth from "../../hooks/useAuth";

const Navbar = () => {
    const [showSignOut, setShowSignOut] = useState(false)
    const { user, SignOut } = useAuth()
    return (
        <nav className="flex justify-between bg-base-200 p-3">
            <div className='flex gap-1 items-center'>
                <img className="w-10" src='/ChatMinLogo.svg' alt="" />
                <p>
                    <span className="font-semibold">Chat</span><span className="font-bold text-xl text-primary">MiN</span>
                </p>
            </div>
            <div className=" h-auto flex justify-end items-center border-2 rounded-full gap-3 p-1">
                {
                    user && (
                        <>
                            {
                                showSignOut ?
                                    <button onClick={SignOut} className='btn btn-xs rounded-full'>Sign-Out</button>
                                    : <p className='uppercase rounded-full pl-3'>{user?.displayName}</p>
                            }
                            <img onClick={() => setShowSignOut(!showSignOut)} src={user?.photoURL} title={user?.displayName} className='w-7 h-7 rounded-full object-cover' alt="" />

                        </>
                    )
                }
            </div>
        </nav>
    );
};

export default Navbar;