import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const [editting, setEditting] = useState(false);
    const [formData, setFormData] = useState({
        username: Cookies.get('userInfo') && JSON.parse(Cookies.get('userInfo')).username,
        email: Cookies.get('userInfo') && JSON.parse(Cookies.get('userInfo')).email,
        name: Cookies.get('userInfo') && JSON.parse(Cookies.get('userInfo')).name,
    });
    const navigate = useNavigate();

    const updateInformation = async () => {
        if (formData.username.length <= 5) {
            alert("Username has to be greater than 5 characters!");
        } else if (!validateEmail(formData.email)) {
            alert("Email must follow the format of an actual email!");
        } else {
            const response = await axios.post("http://localhost:5001/updateInformation", {newData: formData, oldData: JSON.parse(Cookies.get('userInfo'))});

            console.log(response.data);
        }
    }

    const validateEmail = (email) => {
        return String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
      };

    return (
        <div className="w-4/6 px-10 mt-10 mb-10 mx-auto">
            <h2 className="text-2xl font-bold w-full mb-10 text-turquoise cursor-pointer hover:text-keppel transition-all duration-300 ease-in-out" onClick={() => navigate('/dashboard')}>&#8592; Back to the Dashboard</h2>
            <div className="flex flex-row mb-7"><h2 className="text-4xl font-bold mr-auto">Account Information</h2>{!editting && <button onClick={() => setEditting(true)} className="bg-light-coral font-semibold px-5 py-2 rounded-lg text-xl hover:bg-opacity-75 transition-all duration-300 ease-in-out">Edit Information</button>}</div>
            <div id="account-information" className="w-full">
                <div className="flex flex-row w-full">
                    <div class="bg-slate-500 mr-10 rounded-full text-7xl text-white flex-shrink-0 max-w-36 max-h-36 min-w-36 min-h-36 text-center flex items-center justify-center">Y</div>
                    <div class="flex flex-row flex-wrap">
                        <div class="mr-5">
                            <p class="text-lg" htmlFor="username">Username</p>
                            <input onChange={(e) => setFormData({...formData, [e.target.name]:e.target.value})} type="text" name="username" id="username" value={formData.username} readOnly={!editting} class="focus:outline-none border-2 border-gray-800 px-5 py-2 rounded-lg text-xl"/>
                        </div>
                        <div class="mr-5">
                            <p class="text-lg" htmlFor="email">Email</p>
                            <input onChange={(e) => setFormData({...formData, [e.target.name]:e.target.value})} type="email" name="email" id="email" value={formData.email} readOnly={!editting} class="focus:outline-none border-2 border-gray-800 px-5 py-2 rounded-lg text-xl"/>
                        </div>
                        <div>
                            <p class="text-lg" htmlFor="name">Name</p>
                            <input onChange={(e) => setFormData({...formData, [e.target.name]:e.target.value})} type="text" name="name" id="name" value={formData.name} readOnly={!editting} class="focus:outline-none border-2 border-gray-800 px-5 py-2 rounded-lg text-xl"/>
                        </div>
                        {editting && <div className='mt-5'><button onClick={() => updateInformation()} className='mr-5 bg-lapiz-lazuli text-white font-semibold px-4 py-2 rounded-lg hover:bg-opacity-75 transition-all duration-300 ease-in-out'>Save Information</button><button onClick={() => setEditting(false)} className='bg-gray-500 rounded-lg text-black font-semibold px-4 py-2 hover:bg-opacity-75 transition-all duration-300 ease-in-out'>Cancel</button></div>}
                        <div className="w-full">
                            <p className="text-3xl font-semibold mt-10 text-center mb-8">Assignments Completed</p>
                            <div className="flex flex-row justify-evenly">
                                <div className="bg-lapiz-lazuli px-10 py-10 rounded-3xl hover:scale-110 transition-all duration-300 ease-out">
                                    <p className="text-3xl text-center font-semibold text-white">1978</p>
                                    <p className="text-2xl text-center text-white">On Time</p>
                                </div>
                                <div className="bg-lapiz-lazuli px-10 py-10 rounded-3xl hover:scale-110 transition-all duration-300 ease-out">
                                    <p className="text-3xl text-center font-semibold text-white">46</p>
                                    <p className="text-2xl text-center text-white">Overdue</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}