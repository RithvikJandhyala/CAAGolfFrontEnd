import React from 'react';
import * as AiIcons from 'react-icons/ai';
import * as RiIcons from 'react-icons/ri';
import * as BsIcons from 'react-icons/bs';
import * as HiIcons from 'react-icons/hi';
import * as FaIcons from 'react-icons/fa';
import { FaChessBoard } from "react-icons/fa6";
import { BsCalendarEventFill } from "react-icons/bs";
import { FaGolfBall } from "react-icons/fa";
import { IoGolfSharp } from "react-icons/io5";


export const SidebarData = [
  {
    title: (localStorage.role !== 'Admin' )? 'My Players':' ',
    path: '/home',
    icon:    (localStorage.role !== 'Admin' )? <AiIcons.AiOutlineUser />:<></>,
    cName: (localStorage.role !== 'Admin' )? 'nav-text':' '
  },
  {
    title: 'All Players',
    path: '/all-players',
    icon:  <RiIcons.RiTeamLine />,
    cName: 'nav-text'
  },
  {
    title: 'Event Scoring',
    path: '/event-scoring',
    icon: <FaGolfBall />,
    cName: 'nav-text'
  },
  {
    title: (localStorage.role === "Admin")? 'Event Admin' : 'Event Sign Up' ,
    path: '/event-sign-up',
    icon: <BsCalendarEventFill />,
    cName: 'nav-text'
  },
  {
    title: (localStorage.role === 'Admin' )? 'Golf Courses':' ',
    path: '/courses',
    icon:  (localStorage.role === 'Admin' )? <IoGolfSharp />:<></>,
    cName: (localStorage.role === 'Admin' )? 'nav-text':' '
  },
  {
    title: (localStorage.role === 'Admin' )? 'User Management':' ',
    path: '/all-users',
    icon:  (localStorage.role === 'Admin' )? <HiIcons.HiOutlineUserCircle />:<></>,
    cName: (localStorage.role === 'Admin' )? 'nav-text':' '
  },
  {
    title: (localStorage.role === 'Admin' )? 'Schools':' ',
    path: '/schools',
    icon:  (localStorage.role === 'Admin' )? <FaIcons.FaSchool/>:<></>,
    cName: (localStorage.role === 'Admin' )? 'nav-text':' '
  },
  
];
