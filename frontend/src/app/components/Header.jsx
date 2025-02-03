'use client';
import {useEffect, useState} from "react";
import Link from 'next/link';
import {usePathname} from "next/navigation";
import useAxios from "../hooks/useAxois";
import toast from "react-hot-toast";
import {useAuth} from "../context/AuthContext";

export default function Header() {
    const {pathname} = usePathname();
    const [isModalOpen, setModalOpen] = useState(false);
    const [isRegistering, setRegistering] = useState(false);
    const {data, sendRequest, loading, error} = useAxios();
    const {isAuthenticated,setIsAuthenticated} = useAuth();

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const [registerData, setRegisterData] = useState({})
    const [loginData, setLoginData] = useState({})

    const toggleModal = () => setModalOpen(!isModalOpen);
    const switchForm = () => setRegistering(!isRegistering);
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    const handleLogin = () => {
        sendRequest({method: 'POST', endpoint: `/djangoapp/login`, data: loginData}).then((value) => {
            if (value?.status === 'Authenticated') {
                sessionStorage.setItem('username', value.userName);
                toast.success('You logged in successfully!');
                setModalOpen(false)
                setIsAuthenticated(true)
            } else {
                toast.error('Username or password is incorrect!');
            }
        })
    }

    const handleRegister = () => {
        sendRequest({method: 'POST', endpoint: `/djangoapp/register`, data: registerData}).then((value) => {
            if (value?.status === 'Authenticated') {
                sessionStorage.setItem('username', value.userName);
                toast.success('You logged in successfully!');
                setModalOpen(false)
                setIsAuthenticated(true)
            } else {
                toast.error(value?.error);
            }
        })
    }

    const handleLogout = () => {
        sessionStorage.removeItem('username');
        setIsAuthenticated(false)
        setDropdownOpen(false)
        toast('You logged out successfully!');
    }


    return (
        <>
            <header className={`text-white w-full z-50 ${pathname === '/' ? 'absolute pt-10' : 'py-2 bg-black'}`}>
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link href={'/frontend/public'}>
                        <h1 className="xl:text-xl text-md font-bold">DEALERSHIP</h1>
                    </Link>
                    {/*<nav className="space-x-8">*/}
                    {/*    <a href="/" className="hover:text-yellow-500">Home</a>*/}
                    {/*    <a href="/about" className="hover:text-yellow-500">About Us</a>*/}
                    {/*    <a href="/contact" className="hover:text-yellow-500">Contact Us</a>*/}
                    {/*</nav>*/}
                    {!isAuthenticated
                        ? (
                            <button
                                onClick={toggleModal}
                                className="bg-yellow-500 text-black px-4 py-2 rounded xl:text-md text-sm"
                            >
                                Login / Register
                            </button>
                        ) : (
                            <div className={'relative'}>
                                <img src={'/assets/images/user.svg'} onClick={toggleDropdown} alt="user"
                                     className={'w-10 h-10 bg-white rounded-full p-2 cursor-pointer'}/>
                                {dropdownOpen && (
                                    <div
                                        className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                                        role="menu"
                                        aria-orientation="vertical"
                                        aria-labelledby="menu-button"
                                    >
                                        <div className="py-1" role="none">
                                            <button
                                                onClick={handleLogout}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                                role="menuitem"
                                            >
                                                Log out
                                            </button>
                                        </div>
                                    </div>
                                )}
                        </div>
                        )}
                </div>
            </header>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-gray-200 w-96 rounded-lg shadow-lg p-6 relative">

                        {/* Close Button */}
                        <button
                            onClick={toggleModal}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                        >
                            &times;
                        </button>

                        {/* Form */}
                        {isRegistering ? (
                            <div>
                                <h2 className="text-xl font-bold mb-4">Register</h2>
                                <form>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">username</label>
                                        <input
                                            type="text"
                                            onChange={e => {
                                                setRegisterData({...registerData, userName: e.target.value})
                                            }}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                            placeholder="Enter your firstname"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">firstname</label>
                                        <input
                                            type="text"
                                            onChange={e => {
                                                setRegisterData({...registerData, firstName: e.target.value})
                                            }}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                            placeholder="Enter your firstname"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">lastname</label>
                                        <input
                                            type="text"
                                            onChange={e => {
                                                setRegisterData({...registerData, lastName: e.target.value})
                                            }}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                            placeholder="Enter your lastname"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Email</label>
                                        <input
                                            type="email"
                                            onChange={e => {
                                                setRegisterData({...registerData, email: e.target.value})
                                            }}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Password</label>
                                        <input
                                            type="password"
                                            onChange={e => {
                                                setRegisterData({...registerData, password: e.target.value})
                                            }}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                            placeholder="Create a password"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleRegister}
                                        className="w-full bg-yellow-500 text-black py-2 rounded-lg hover:bg-yellow-600"
                                    >
                                        Register
                                    </button>
                                </form>
                                <p className="text-sm mt-4 text-center">
                                    Already have an account?{" "}
                                    <button
                                        onClick={switchForm}
                                        className="text-yellow-500 hover:underline"
                                    >
                                        Login
                                    </button>
                                </p>
                            </div>
                        ) : (
                            <div>
                                <h2 className="text-xl font-bold mb-4">Login</h2>
                                <form>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Username</label>
                                        <input
                                            type="text"
                                            onChange={e => {
                                                setLoginData({...loginData, userName: e.target.value})
                                            }}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                            placeholder="Enter your username"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Password</label>
                                        <input
                                            type="password"
                                            onChange={e => {
                                                setLoginData({...loginData, password: e.target.value})
                                            }}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                            placeholder="Enter your password"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleLogin}
                                        className="w-full bg-yellow-500 text-black py-2 rounded-lg hover:bg-yellow-600"
                                    >
                                        Login
                                    </button>
                                </form>
                                <p className="text-sm mt-4 text-center">
                                    Don’t have an account?{" "}
                                    <button
                                        onClick={switchForm}
                                        className="text-yellow-500 hover:underline"
                                    >
                                        Register
                                    </button>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
