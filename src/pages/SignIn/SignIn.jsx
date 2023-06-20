import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import Social from "../Social/Social";

const SignIn = () => {
    const navigate = useNavigate()
    const [passShow, setPassShow] = useState(false)
    const { SignIn } = useAuth()
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const onSubmit = data => {
        SignIn(data?.email, data?.password)
            .then(result => {
                const user = result.user
                if (user) {
                    navigate("/", { replace: true })
                    reset()
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Signed-In Successfully',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            })
    }
    const pssShowHandler = (event) => {
        if (event.target.checked) {
            setPassShow(true);
        } else {
            setPassShow(false);
        }
    }
    return (
        <section className={`min-h-screen`}>
            <div className="container">
                <div className="hero py-10 min-h-screen items-center">
                    <div className="card flex-shrink-0 w-full bg-base-200 py-5 max-w-sm">
                        <h1 className="text-center font-bold py-5 text-2xl">
                            SIGN-IN
                        </h1>
                        <form onSubmit={handleSubmit(onSubmit)} className="card-body p-5">
                            <div className="form-control mb-5">
                                <input type="text" {...register("email", { required: true })} placeholder="email" className="input input-bordered" required />
                            </div>
                            <div className="form-control mb-5">
                                <span className="relative">
                                    <input type={passShow ? 'text' : 'password'} {...register("password", { required: true })} placeholder="password" name="password" className="input input-bordered w-full pr-10" required />
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
                                <input type="submit" value="LogIn" className="primary-btn" />
                            </div>
                        </form>
                        <p className='text-secondary text-center'>
                            New here? <Link to='/signUp' className='text-primary'>Create a new account.</Link>
                        </p>
                        <Social />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SignIn;