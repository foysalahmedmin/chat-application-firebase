import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Social from "../Social/Social";
import { useState } from "react";
import { db, storage } from "../../firebase/firebase.config";
import { doc, setDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

const SignUp = () => {
    const navigate = useNavigate()
    const [passShow, setPassShow] = useState(false)
    const { SignUp, UpdateProfile } = useAuth()
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const onSubmit = data => {
        if (data) {
            console.log(data, data.photoFile[0])
            SignUp(data?.email, data?.password)
                .then(result => {
                    const createdUser = result.user
                    console.log(createdUser)
                    if (createdUser) {
                        const date = new Date().getTime()
                        const storageRef = ref(storage, `${data.name + date}`);
                        uploadBytesResumable(storageRef, data.photoFile[0])
                            .then(() => {
                                getDownloadURL(storageRef)
                                    .then(async (downloadURL) => {
                                        console.log('File available at', downloadURL);
                                        if (downloadURL) {
                                            try{
                                                await setDoc(doc(db, "users", createdUser.uid), {
                                                    uid: createdUser.uid,
                                                    displayName: data.name,
                                                    email: data.email,
                                                    photoURL: downloadURL,
                                                });
                                                await setDoc(doc(db, "userChats", createdUser.uid), {});
                                                await updateProfile(createdUser, {
                                                    displayName: data.name,
                                                    photoURL: downloadURL
                                                })
                                                    .then(() => {
                                                        reset()
                                                    })
                                                navigate("/");
                                            } catch(err){
                                                console.log(err)
                                            }
                                        }
                                    });
                            })
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Signed-Up Successfully',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    }

                })
        }

    }
    const pssShowHandler = (event) => {
        if (event.target.checked) {
            setPassShow(true);
        } else {
            setPassShow(false);
        }
    }

    return (
        <section className={`min-h-screen `}>
            <div className="container">
                <div className="hero py-10 min-h-screen items-center">
                    <div className="card flex-shrink-0 w-full max-w-sm py-5 bg-base-200">
                        <h1 className="text-center font-bold py-5 text-2xl">
                            SIGN-UP
                        </h1>
                        <form onSubmit={handleSubmit(onSubmit)} className="card-body p-5">
                            <div className="form-control mb-5">
                                <input type="text" {...register("name", { required: true })} placeholder="Name" name="name" className="input input-bordered" required />
                            </div>
                            <div className="form-control mb-5">
                                <input type="file" {...register("photoFile", { required: true })} name="photoFile" className="input input-bordered" required />
                            </div>
                            <div className="form-control mb-5">
                                <input type="email" {...register("email", { required: true })} placeholder="email" name="email" className="input input-bordered" required />
                            </div>
                            <div className="form-control mb-5">
                                <span className="relative">
                                    <input type={passShow ? 'text' : 'password'} {...register("password", {
                                        required: true,
                                        pattern: {
                                            value: /^(?=.*[A-Z])(?=.*[@#$%^&+=])(?=.*[a-z])(?=.*\d).{6,}$/,
                                            message: 'Password must be spacial at least a spacial character and capital latter'
                                        },
                                        minLength: {
                                            value: 6,
                                            message: 'Password must be at least 6 characters long'
                                        }
                                    })} placeholder="password" name="password" className="input input-bordered w-full pr-10" required />
                                    <label className="swap swap-rotate absolute right-3 top-0 bottom-0 my-auto">
                                        <input onClick={pssShowHandler} type="checkbox" />
                                        <p className="swap-off fill-current text-xl">
                                            <FaEye />
                                        </p>
                                        <p className="swap-on fill-current text-xl">
                                            <FaEyeSlash />
                                        </p>
                                    </label>
                                </span>
                                {errors.password && <span>{errors.password.message}</span>}
                            </div>
                            <div className="form-control mt-5">
                                <input type="submit" value="Sign-Up" className="primary-btn" />
                            </div>
                        </form>
                        <p className='text-secondary text-center'>
                            Already registered? <Link to='/signIn' className='text-primary'>Go to SignIn.</Link>
                        </p>
                        <Social />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SignUp;