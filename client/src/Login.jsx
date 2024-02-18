import { useState } from "react";
import axios from 'axios';
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
    const [formData, setFormData] = useState({
        username: {
            value: '',
            errors: '',
        },
        password: {
            value: '',
            errors: '',
        },
    });
    const [credError, setCredError] = useState('');
    const navigate = useNavigate();

    const verifyCreds = async () => {
        const response = await axios.post('http://localhost:5001/login', { username:formData.username.value, password:formData.password.value });
        
        if (response.data.error) {
            setCredError('Username or Password is Invalid!');
        } else {
            setCredError('');
            await Cookies.set('userInfo', JSON.stringify(response.data));
            await Cookies.set('loggedIn', true);
            onLogin('true'); // Trigger the callback to update the parent state
            navigate('/dashboard');
        }
    }

    const onChange = (e) => {
        setFormData({...formData, [e.target.name]: {...formData[e.target.name], value:e.target.value}});
    }

    return (
        <div className="w-2/6 min-h-screen justify-center mx-auto flex-col">
            <div className="shadow-2xl px-20 py-5 rounded-xl bg-slate-100 flex justify-center flex-col items-center">
                <h2 className="text-3xl font-bold mb-10">Login</h2>
                {credError && <p className="text-red-400 mb-1 mt-1">{credError}</p>}
                <div id="login-form" className="w-5/6 mb-5">
                    <div className="w-full mb-5">
                        <p htmlFor="username" className="text-lg font-semibold mb-1">Username</p>
                        <input type="text" name="username" value={formData.username.value} placeholder="BillyBobJoe" className="bg-slate-200 px-5 py-2 rounded-lg w-full focus:outline-none focus:bg-slate-300 focus:bg-opacity-90" onChange={onChange}/>
                        {formData.username.errors !== '' ? <p className="text-red-400 ml-1 mt-1">{formData.username.errors}</p> : null}
                    </div>
                    <div className="w-full">
                        <p htmlFor="password" className="text-lg font-semibold mb-1">Password</p>
                        <input type="password" name="password" value={formData.password.value} placeholder="••••••••••" className="bg-slate-200 px-5 py-2 rounded-lg w-full focus:outline-none focus:bg-slate-300 focus:bg-opacity-90 placeholder:text-slate-600" onChange={onChange}/>
                    </div>
                </div>
                <button className="bg-green-400 hover:bg-green-200 mx-auto px-6 py-2 rounded-lg transition-all duration-500 ease-in-out text-xl" onClick={verifyCreds}>Login</button>
            </div>
        </div>
    )
}
