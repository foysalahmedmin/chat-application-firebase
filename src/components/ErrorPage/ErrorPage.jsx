import React from 'react';
import { Link, useRouteError } from 'react-router-dom';
import errorImage from '../../assets/404PageImg.svg'

const ErrorPage = () => {
    const { error } = useRouteError()
    return (
        <section className='flex items-center h-screen p-16 bg-gray-100 text-gray-900'>
            <div className='container flex flex-col items-center justify-center px-5 mx-auto my-8'>
                <img className='mx-auto xl:max-w-xl w-full' src={errorImage} alt="" />
                <div className='max-w-md text-center'>
                    <p className='text-xl pt-5 font-semibold md:text-3xl text-red-800 mb-8'>
                        {error?.message}
                    </p>
                    <Link to='/'>
                        <button className='primary-btn'>Back to Home-Page</button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default ErrorPage;