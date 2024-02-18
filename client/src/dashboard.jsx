import { useEffect, useState } from 'react';
import deadline from './assets/deadline.png';
import './index.css'
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios'

export default function Dashboard() {
    useEffect(() => {
        const collectIA = async () => {
            const response = await axios.post('http://localhost:5001/get-all-incomplete-assignments', { username: JSON.parse(Cookies.get('userInfo')).username });

            setNeedingAttentionTasks(response.data.remainingAssignments.sort((a, b) => a.due.localeCompare(b.due)).slice(0, 5));
        }

        collectIA();    
    }, []);

    const [needingAttentionTasks, setNeedingAttentionTasks] = useState([
        {name: 'Math HW', due: 'Today', id: 1},
        {name: 'HackSwift Submissions', due: 'Tomorrow', id: 2},
        {name: 'Chemistry of Life Booklet', due: '3 Days', id: 3},
        {name: 'Proyecto de Comidas', due: '5 Days', id: 4},
        {name: 'Brainstorm Java Projects', due: '2 Weeks', id: 5},
    ]);

    const subjectAssignments = [
        { name: 'Math', numOfAssignments: 2 },
        { name: 'Science', numOfAssignments: 3 },
        { name: 'English', numOfAssignments: 4 },
        { name: 'History', numOfAssignments: 5 },
        { name: 'Art', numOfAssignments: 6 },
        { name: 'PE', numOfAssignments: 7 },
        { name: 'Music', numOfAssignments: 8 },
    ]
    const navigate = useNavigate();

    return (
        <div className='w-10/12 mx-auto pt-5 pb-10'>
            <hr className='border-2 rounded-full' />
            <h1 className='text-3xl font-bold mt-5 mb-3'>Welcome, {Cookies.get('userInfo') && JSON.parse(Cookies.get('userInfo')).name}!</h1>
            <p className='mt-2 text-gray-500 text-lg'>View your projects and upcoming work.</p>
            <button className='px-5 py-2 bg-lapiz-lazuli mt-5 rounded-md hover:bg-opacity-85 transition-all duration-300 ease-in-out text-xl text-slate-100' onClick={() => navigate('/dashboard/profile')}>Manage Account</button>
            <div className='flex flex-wrap justify-between'>
                <div id='all-assignments' className='w-5/12 mt-20 flex flex-row h-full'>
                    <div className='px-10 py-5 bg-white shadow-lg shadow-lapiz-lazuli rounded-xl mx-auto cursor-pointer hover:scale-110 transition-all duration-300 ease-in-out' onClick={() => navigate(`/dashboard/past-assignments/${1}`)}>
                        <p className='text-lg font-semibold mb-3'>Past Assignments</p>
                        <p className='text-sm'>View previous completed assignments by you with their details.</p>
                    </div>
                </div>
                <div id='rates' className='bg-lapiz-lazuli rounded-xl w-6/12 mt-10 flex flex-row py-5 justify-evenly'>
                    <div className='bg-slate-300 flex flex-col px-3 py-3 rounded-xl w-52 items-center hover:scale-110 transition-all duration-300 ease-out'>
                        <div className='px-3 py-10 rounded-full bg-white w-28 text-center mb-3 mt-5 text-2xl shadow-lg shadow-gray-400'>89%</div>
                        <p className='text-xl text-black font-semibold'>Completion Rate</p>
                    </div>
                    <div className='bg-slate-300 flex flex-col px-3 py-3 rounded-xl w-52 items-center hover:scale-110 transition-all duration-300 ease-out'>
                        <div className='px-3 py-10 rounded-full bg-white w-28 text-center mb-3 mt-5 text-2xl shadow-lg shadow-gray-400'>89%</div>
                        <p className='text-xl text-black font-semibold'>Pass Rate</p>
                    </div>
                    <div className='bg-slate-300 flex flex-col px-3 py-3 rounded-xl w-52 items-center hover:scale-110 transition-all duration-300 ease-out'>
                        <div className='px-3 py-10 rounded-full bg-white w-28 text-center mb-3 mt-5 text-2xl shadow-lg shadow-gray-400'>89%</div>
                        <p className='text-xl text-black font-semibold'>On Time Rate</p>
                    </div>
                </div>
                <div id='needing-attention' className='w-5/12 mt-2'>
                    <h2 className='text-2xl font-bold py-5 w-full justify-between flex items-center'><span className='mr-auto'>Incomplete Work</span><span className='bg-turquoise cursor-pointer hover:bg-opacity-75 transition-all duration-300 ease-in-out px-4 py-2 rounded-lg font-semibold' onClick={() => navigate('/dashboard/to-do')}>See All &#10230;</span></h2>
                    <div id='tasks-list' className='bg-lapiz-lazuli rounded-xl'>
                        {needingAttentionTasks.map((task, index) => {
                            return (
                                <div className='w-full flex flex-row px-10 py-5 font-semibold text-lg' key={index}>
                                    <p className='mr-auto text-flax'>{task.name}</p>
                                    <p className='flex flex-row items-center justify-center text-flax'><img src={deadline} className='deadline-icon mr-2 text-flax w-10 h-10' alt='Deadline' />{task.due}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div id='subject-assignments-number' className='w-6/12 mt-10 py-5'>
                    <h2 className='text-2xl font-bold py-5 w-full'>Number of Assignments</h2>
                    <div className='flex flex-row justify-evenly'>
                        <div className='min-w-20 h-fit bg-gray-300 py-3 px-2 rounded-xl hover:bg-opacity-75 transition-all duration-300 ease-in-out cursor-pointer hover:scale-105'>
                            <p className='text-center font-semibold'>Math</p>
                            <p className='text-center'>1</p>
                        </div>
                        <div className='min-w-20 h-fit bg-gray-300 py-3 px-2 rounded-xl hover:bg-opacity-75 transition-all duration-300 ease-in-out cursor-pointer hover:scale-105'>
                            <p className='text-center font-semibold'>Science</p>
                            <p className='text-center'>2</p>
                        </div>
                        <div className='min-w-20 h-fit bg-gray-300 py-3 px-2 rounded-xl hover:bg-opacity-75 transition-all duration-300 ease-in-out cursor-pointer hover:scale-105'>
                            <p className='text-center font-semibold'>English</p>
                            <p className='text-center'>3</p>
                        </div>
                        <div className='min-w-20 h-fit bg-gray-300 py-3 px-2 rounded-xl hover:bg-opacity-75 transition-all duration-300 ease-in-out cursor-pointer hover:scale-105'>
                            <p className='text-center font-semibold'>History</p>
                            <p className='text-center'>4</p>
                        </div>
                        <div className='min-w-20 h-fit bg-gray-300 py-3 px-2 rounded-xl hover:bg-opacity-75 transition-all duration-300 ease-in-out cursor-pointer hover:scale-105'>
                            <p className='text-center font-semibold'>Art</p>
                            <p className='text-center'>5</p>
                        </div>
                        <div className='min-w-20 h-fit bg-gray-300 py-3 px-2 rounded-xl hover:bg-opacity-75 transition-all duration-300 ease-in-out cursor-pointer hover:scale-105'>
                            <p className='text-center font-semibold'>PE</p>
                            <p className='text-center'>6</p>
                        </div>
                        <div className='min-w-20 h-fit bg-gray-300 py-3 px-2 rounded-xl hover:bg-opacity-75 transition-all duration-300 ease-in-out cursor-pointer hover:scale-105'>
                            <p className='text-center font-semibold'>Music</p>
                            <p className='text-center'>7</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}