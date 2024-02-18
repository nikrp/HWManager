import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import './index2.css'
import swap from './assets/swap.png';
import axios from 'axios';
import Cookies from "js-cookie";

export default function IncompleteAssignments() {
    const [afterDate, setAfterDate] = useState('');
    const [beforeDate, setBeforeDate] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState({});
    const [needingAttentionTasksMain, setNeedingAttentionTasksMain] = useState([]);
    const [needingAttentionTasks, setNeedingAttentionTasks] = useState([]);
    const [createTaskModal, setCreateTaskModal] = useState(false);


    const handleAfterDateChange = (event) => {
        setAfterDate(event.target.value);
    };

    const handleBeforeDateChange = (event) => {
        setBeforeDate(event.target.value);
    };

    useEffect(() => {
        updateItems();
    }, [afterDate, beforeDate]);

    useEffect(() => {
        const collectIA = async () => {
            const response = await axios.post('http://localhost:5001/get-all-incomplete-assignments', { username: JSON.parse(Cookies.get('userInfo')).username });

            console.log("data:", response.data);

            setNeedingAttentionTasksMain(response.data.remainingAssignments);
            setNeedingAttentionTasks(response.data.remainingAssignments);
        }

        collectIA();
    }, []);

    const params = useParams();
    const navigate = useNavigate();
    const [subjects, setSubjects] = useState([{name: 'Math', checked: true}, {name: 'Science', checked: true}, {name: 'ELA', checked: true}, {name: 'History', checked: true}, {name: 'Art', checked: true}, {name: 'Music', checked: true}, {name: 'PE', checked: true}, {name: 'Programming', checked: true}, {name: 'Spanish', checked: true}]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    today.setDate(today.getDate() + 1);
    today.setHours(0, 0, 0, 0);

    const dayAfterTmrw = new Date(today);
    today.setDate(today.getDate() + 2);
    today.setHours(0, 0, 0, 0);

    const fiveDays = new Date(today);
    today.setDate(today.getDate() + 4);
    today.setHours(0, 0, 0, 0);

    const twoWeeks = new Date(today);
    today.setDate(today.getDate() + 13);
    today.setHours(0, 0, 0, 0);

    const openModal = (taskIndex) => {
        setModalOpen(true);
        setSelectedAssignment(needingAttentionTasksMain[taskIndex]);
    }

    useEffect(() => {
        if (modalOpen) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
    
        return () => {
            document.body.classList.remove('overflow-hidden');
        };
    }, [modalOpen]);
    
    const updateItems = () => {
        const filteredTasks = needingAttentionTasksMain.filter(task =>
            subjects.find(subject => subject.name === task.subject && subject.checked) &&
            (!afterDate || new Date(task.due) >= new Date(afterDate)) &&
            (!beforeDate || new Date(task.due) <= new Date(beforeDate))
        );
    
        const copyOfFilteredTasks = [...filteredTasks];
    
        setNeedingAttentionTasks(copyOfFilteredTasks);
    };

    const completeAssignment = async (taskId) => {
        const response = await axios.post('http://localhost:5001/complete-assignment', {username: JSON.parse(Cookies.get('userInfo')).username, taskId: taskId});

        console.log(response.data);

        setNeedingAttentionTasksMain(response.data.remainingAssignments);
        setNeedingAttentionTasks(response.data.remainingAssignments);
        setModalOpen(false);
    }
    
    return (
        <div className="w-5/6 mx-auto pb-10 mt-10">
            <h2 className="text-2xl font-bold w-full text-turquoise cursor-pointer hover:text-keppel transition-all duration-300 ease-in-out" onClick={() => navigate('/dashboard')}>&#8592; Back to the Dashboard</h2>
            <h2 className="text-3xl font-bold w-full text-center mb-10 text-lapiz-lazuli">Incomplete Assignments</h2>
            <div className="flex flex-row">
                <div className="w-1/4">
                    <div className="border-2 border-slate-800 rounded-lg py-5 px-5">
                        <h2 className="text-2xl font-semibold px-5 mb-3">Filters</h2>
                        <div className="ml-5">
                            <h3 className="text-xl px-5 mb-1 mt-3">Subjects</h3>
                            {subjects.map((subject, index) => {
                                useEffect(() => {
                                    updateItems();
                                }, [subjects]);                 
                                return (
                                    <div key={index} className="flex flex-row items-center ml-5">
                                        <div className="inline-flex items-center">
                                            <label className="relative flex items-center p-3 rounded-full cursor-pointer" htmlFor="checkbox">
                                            <input
                                                onChange={() => {
                                                    setSubjects((prevSubjects) =>
                                                        prevSubjects.map((subj, idx) =>
                                                            idx === index ? { ...subj, checked: !subj.checked } : subj
                                                        )
                                                    );
                                                }}                                    
                                                type="checkbox"
                                                className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-500 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:bg-gray-900 checked:before:bg-gray-900 hover:before:opacity-10"
                                                id="checkbox"
                                                checked={subject.checked}
                                            />

                                                <span className="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" stroke-width="1">
                                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                                    </svg>
                                                </span>
                                            </label>
                                        </div>
                                        <p>{subject.name}</p>
                                    </div>
                                );
                            })}
                            <h3 className="text-xl px-5 mb-1 mt-3">Due Date</h3>
                            
                            <div className="mb-5 ml-7">
                                <p htmlFor='after'>After</p>
                                <input
                                    type="date"
                                    name="after"
                                    value={afterDate}
                                    onChange={handleAfterDateChange}
                                    className="border rounded-lg border-lapiz-lazuli px-5 py-3 text-xl flex items-center"
                                />
                            </div>

                            <div className="ml-7">
                                <p htmlFor='before'>Before</p>
                                <input
                                    type="date"
                                    name="before"
                                    value={beforeDate}
                                    onChange={handleBeforeDateChange}
                                    className="border rounded-lg border-lapiz-lazuli px-5 py-3 text-xl flex items-center"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-3/4 px-5">
                    <div className="flex flex-row">
                        <p className="ml-5 mb-5 text-2xl font-semibold italic mr-auto">Found {needingAttentionTasks.length} Assignments</p>
                        <img src={swap} alt="Reverse Order" title="Reverse List Order" className="w-10 h-10 mr-6 cursor-pointer rounded-lg" onClick={() => {const mapReverse1 = needingAttentionTasks.slice(0).reverse().map(element => {return element;});setNeedingAttentionTasks(mapReverse1)}}/>
                    </div>
                    <div className="container">
                        <ul className="responsive-table">
                            <li className="table-header">
                                <div className="col col-1">Assignment Name</div>
                                <div className="col col-2">Subject</div>
                                <div className="col col-3">Due Date</div>
                                <div className="col col-4">Priority</div>
                            </li>
                            {needingAttentionTasks.map((task, index) => {
                                console.log(task.priorityColor);
                                return (
                                    <li className="table-row cursor-pointer hover:scale-105 transition-all duration-300 ease-out" key={index} onClick={() => {openModal(index)}}>
                                        <div className="col col-1" data-label="Assignment Name">{task.name}</div>
                                        <div className="col col-2" data-label="Subject">{task.subject}</div>
                                        <div className="col col-3" data-label="Due Date">{task.due.toString().substring(0, 15)}</div>
                                        <div className={`col col-4 ${task.priority === "Safe" ? 'text-green-400' : task.priority === "Urgent" ? 'text-red-400' : 'text-yellow-400'} font-semibold`} data-label="Due Date">{task.priority}</div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
            {modalOpen && <div className="z-20 fixed w-screen h-screen bg-black bg-opacity-20 top-0 right-0 left-0 bottom-0 scroll-m-0 flex items-center justify-center">
                <div className="bg-white rounded-xl px-10 py-10 min-w-96 min-h-96 max-w-[440px] max-h-[440px]">
                    <p><span className="font-semibold">Assignment Name:</span> {selectedAssignment.name}</p>
                    <p className={`${selectedAssignment.priorityColor}`}><span className={`font-semibold text-black`}>Priority:</span> {selectedAssignment.priority}</p>
                    <p><span className="font-semibold">Subject:</span> {selectedAssignment.subject}</p>
                    <p><span className="font-semibold">Due Date:</span> {selectedAssignment.due.toString().substring(0, 15)}</p>
                    <p><span className="font-semibold">Points:</span> {selectedAssignment.points}</p>
                    <p><span className="font-semibold">Assignment Description:</span> {selectedAssignment.description}</p>
                    <div className="flex justify-evenly mt-10">
                        <button onClick={() => {
                            setModalOpen(false);
                        }} className="bg-red-500 px-5 py-2 rounded-lg hover:bg-opacity-75 transition-all duration-200 ease-in-out text-lg">Close</button>
                        <button onClick={() => completeAssignment(selectedAssignment.id)} className="bg-green-500 px-5 py-2 rounded-lg hover:bg-opacity-75 transition-all duration-200 ease-in-out text-lg">Complete Assignment</button>
                    </div>
                </div>
            </div>}
            <div className="flex items-end justify-end w-fit right-2 bottom-2 fixed bg-flax rounded-full"><div className="bg-flax text-9xl font-bold rounded-full max-w-36 flex justify-center items-center pb-5 ml-auto px-10 cursor-pointer hover:bg-yellow-500 transition-all duration-300 ease-in-out" onClick={() => setCreateTaskModal(!createTaskModal)}>+</div></div>
            {createTaskModal && (
            <div className="fixed right-40 bottom-40 rounded-xl bg-slate-300 min-w-96 min-h-96 px-5 py-5">
                <input type="text" placeholder="Assignment Name" className="px-5 py-3 text-lg rounded-lg focus:outline-none focus:bg-slate-100 w-3/6 mr-5 mb-5" />
                <select name="priorities" id="priorities" className="px-3 py-2 rounded-xl mt-5 text-lg w-5/12 mb-5" defaultValue='Urgent'>
                    <option value='Safe'>Safe</option>
                    <option value='Important'>Important</option>
                    <option value='Urgent'>Urgent</option>
                </select>
                <input type="date" className="ml-5 px-3 py-2 text-lg rounded-lg w-5/12 mr-5"/>
                <input type="text" placeholder="Subject" className="px-5 py-3 text-lg rounded-lg w-3/6 focus:outline-none focus:bg-slate-100" />
            </div>)}
        </div>
    );
}