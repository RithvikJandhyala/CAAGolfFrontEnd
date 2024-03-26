import React from 'react';
import './App.css';
import App from './App'; 
import {  Route, Routes } from 'react-router-dom';
import Players from './pages/Players';

import AddScores from './pages/AddScores';
import AddPlayer  from './pages/AddPlayer';
import AllPlayers  from './pages/AllPlayers';
import EventScoring from './pages/EventScoring';

import Help from './pages/Help';
import AddUser from './pages/AddUser';
import AllUsers from './pages/AllUsers';
import Schools from './pages/Schools';
import AddSchool from './pages/AddSchool';
import EventSignUp from './pages/EventSignUp';
import Courses from './pages/Courses';
import AddCourse from './pages/AddCourse';
import AddEvent from './pages/AddEvent';
import PlayerEnroll from './pages/PlayerEnroll';


function RegisterRoutePaths() { 
  return (
       <Routes>
        <Route path="/" element={<App />} />
        <Route path="/home" element={<Players />} />
        <Route path = "/add-scores" element ={<AddScores />}/>
        <Route path = "/add-player" element ={<AddPlayer />}/>
        <Route path = "/add-user" element ={<AddUser />}/>
        <Route path = "/add-school" element ={<AddSchool />}/>
        <Route path = "/all-players" element ={<AllPlayers />}/> 
        <Route path = "/all-users" element ={<AllUsers />}/>
        <Route path = "/event-scoring" element ={<EventScoring />}/>
        <Route path = "/event-sign-up" element ={<EventSignUp />}/>
        <Route path = "/player-enroll" element ={<PlayerEnroll />}/>
        <Route path = "/add-event" element ={<AddEvent />}/>
        <Route path = "/courses" element ={<Courses />}/>
        <Route path = "/add-course" element ={<AddCourse />}/>
        <Route path = "/schools" element ={<Schools />}/>
        <Route path = "/help" element ={<Help/>}/>           
      </Routes> 
       
  );
}

export default RegisterRoutePaths;
