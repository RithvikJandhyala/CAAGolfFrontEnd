import React,{useEffect} from 'react'
import Navbar from '../components/Navbar';
import CoursesReactTable from '../components/reactTables/CoursesReactTable';
import {useNavigate} from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Courses=()=>{
    const navigate=useNavigate();
    useEffect(()=>{
        if(localStorage.username === undefined){
            navigate("/");
        }
        if(localStorage.role !== "Admin"){
            navigate("/home");
        }
        else{
            //window.location.reload(true);
        }
         // show any toast messages
         if(localStorage.message !== undefined && localStorage.message.length > 0 && localStorage.role === "Admin"){
            toast.success(localStorage.message, {
                position: toast.POSITION.TOP_CENTER
            });
            localStorage.message ="";
        }
    }); 
    return(
        <div> 
            <header>
                <Navbar /> 
            </header>
            <section>
                <ToastContainer/>
                <CoursesReactTable/>
            </section>
    
        </div>
    )
}

export default Courses;