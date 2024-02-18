import { useEffect, useState, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { IoIosNotifications } from "react-icons/io";
import { BiMessageSquareDetail } from "react-icons/bi";
import { FaSignOutAlt } from "react-icons/fa";
import logo from './assets/stuf.png'

export default function Navigation({ isLoggedIn, setIsLoggedIn }) {
    const navigate = useNavigate();
    const [profilePopup, setProfilePopup] = useState(false);
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const [notificationPopup, setNotificationPopup] = useState(false);
    const notifications = [
        { from:'WorkTracker', msg: "You have 5 assignments due today!", date: new Date() },
        { from:'WorkTracker', msg: "A group project is due this week!", date: new Date() },
        { from:'WorkTracker', msg: "You have 8 assignments due today!", date: new Date() },
        { from:'WorkTracker', msg: "A group project is due this week!", date: new Date() },
        { from:'WorkTracker', msg: "You have 10 assignments due today!", date: new Date() },
        { from:'WorkTracker', msg: "A group project is due this week!", date: new Date() },
        { from:'WorkTracker', msg: "You have 10 assignments due today!", date: new Date() },
        { from:'WorkTracker', msg: "A group project is due this week!", date: new Date() },
    ]

    useEffect(() => {
        setIsLoggedIn(Cookies.get('loggedIn'));
        console.log(typeof isLoggedIn);
    }, [isLoggedIn]);

    const signOut = async () => {
        await Cookies.set('loggedIn', false);
        await Cookies.remove('userInfo');
        await setIsLoggedIn('false');
        forceUpdate();
        navigate('/');
    }

    return (
        <div className="h-2/12 w-full flex flex-row px-64 py-5 items-center">
            <h2 className="mr-auto text-4xl font-bold cursor-pointer hover:text-slate-800 flex flex-row" onClick={() => navigate('/', { replace: true })}><img src={logo} alt='WorkTrackerLogo' className='w-14 h-11 mr-5'/>WorkTracker</h2>
            { Cookies.get('loggedIn') === 'false' ? (
                <div>
                    <button className="rounded-lg bg-green-400 text-black px-5 py-1 text-xl mr-5 hover:bg-green-200 transition-all duration-300 ease-in-out font-semibold" onClick={() => navigate('/register')}>Register</button>
                    <button className="rounded-lg border-2 border-green-400 text-black px-5 text-xl py-1 hover:bg-green-200 transition-all duration-300 ease-in-out font-semibold" onClick={() => navigate('/login', { replace: true })}>Login</button>
                </div>
            ) : (
                <div className='flex flex-row items-center'>
                    <IoIosNotifications size={35} fill='black' className='mr-5 cursor-pointer' onClick={() => setNotificationPopup(!notificationPopup)}/>
                    {notificationPopup && <div><div className='bg-slate-200 shadow-xl px-4 py-4 absolute rounded-md right-[565px] top-[68px] rotate-45'> </div><div className='min-w-[500px] max-w-[500px] min-h-96 max-h-96 overflow-scroll absolute top-20 right-[350px] bg-slate-200 shadow-xl px-4 bg-opacity-95rounded-md text-black font-semibold rounded-lg py-4'><p className='text-xl mb-5'>Messages</p>{notifications.map((msgData, index) => {
                        return (
                            <div key={index} className='mb-3'>
                                <div className='flex flex-row'>
                                    <p className='font-semibold mr-auto'>From: {msgData.from}</p>
                                    <p>{msgData.date.toString().substring(0, 15)}</p>
                                </div>
                                <p className='line-clamp-1 font-normal mb-3'>{msgData.msg}</p>
                                <hr className='border border-gray-300'/>
                            </div>
                        );
                    })}</div></div>}
                    <BiMessageSquareDetail size={35} fill='black' className='mr-5 opacity-0'/>
                    <div onClick={() => navigate('/dashboard')} className='ml-5 flex flex-row items-center cursor-pointer group mr-10' onMouseEnter={() => setProfilePopup(true)} onMouseLeave={() => setProfilePopup(false)}>
                        <div className={`min-w-10 min-h-5 rounded-full bg-slate-500 px-4 py-2 text-xl text-white mr-3 group-hover:bg-slate-400 transition-all duration-300 ease-in-out`}>Y</div>
                        <p className='text-xl font-semibold text-black group-hover:text-opacity-60 transition-all duration-300 ease-in-out'>{Cookies.get('userInfo') && JSON.parse(Cookies.get('userInfo')).name}</p>
                        {profilePopup && <div><div className='bg-black px-4 py-4 absolute rounded-md right-[340px] top-[68px] rotate-45'> </div><p className='absolute top-20 right-[275px] bg-slate-950 bg-opacity-95 px-5 py-2 rounded-md text-white font-semibold'>View Dashboard</p></div>}
                    </div>
                    <button title='Sign Out' onClick={signOut}><FaSignOutAlt size={35} fill='red' className='hover:opacity-50 transition-all duration-300 ease-in-out' /></button>
                </div>
            )}
        </div>
    )
}