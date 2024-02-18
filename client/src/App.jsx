import './output.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './Home';
import Navigation from './Navigation';
import Login from './Login';
import Dashboard from './dashboard';
import PastAssignments from './PastAssignments';
import Profile from './Profile';
import IncompleteAssignments from './IncompleteAssignments';
import Register from './Register';

import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState('false');
  return (
    <Router>
      <Navigation isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
      <Routes>
        <Route path='/' index element={<Home />} />
        <Route path='/login' index element={<Login onLogin={setIsLoggedIn}/>} />
        <Route path='/register' index element={<Register/>} />
        <Route path='/dashboard' index element={<Dashboard />} />
        <Route path='/dashboard/past-assignments/:sectionNum' index element={<PastAssignments />} />
        <Route path='/dashboard/profile' index element={<Profile />} />
        <Route path='/dashboard/to-do' index element={<IncompleteAssignments />} />
      </Routes>
    </Router>
  )
}

export default App
