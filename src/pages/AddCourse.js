import React, {useState,useRef,useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import Navbar from '../components/Navbar';
import BarLoader from "react-spinners/BarLoader";
import CourseService from '../services/CourseService';

const AddCourse = () => {
    const [name,setName] = useState('')
    const [address,setAddress] = useState('')
    const navigate  = useNavigate();
    useEffect(()=>{
        if(localStorage.username === undefined){
            navigate("/");
        }
        if(localStorage.role != "Admin"){
            navigate("/home");
        }    
    });
    const inputName = useRef();  
    const inputAddress = useRef();
    const [loading,setLoading] = useState(false);
    const saveCourse = async(e) => {
        e.preventDefault();
        if (isValidForm()) {
            setLoading(true);
            // Trim the variables before constructing the user object
            const trimmedName = name.trim();
            const trimmedAddress = address.trim();
            const course = {
                name: trimmedName,
                address: trimmedAddress
            };
            await CourseService.saveCourse(course).then((response) => {
                localStorage.message = response.data;
                navigate('/courses');
            });
            setLoading(false);
        }
    };
  const isValidForm = () => {
    var valid = true;
        if(name.length < 1){
            inputName.current.style.color = "red";
            valid = false;
        }
        else {
            inputName.current.style.color = "black";
        }
        if(address.length < 1){
            inputAddress.current.style.color = "red";
            valid = false;
        }
        else {
            inputAddress.current.style.color = "black";
        }  
        return valid;
  }
  return (
    <div>
    <header>
        <Navbar /> 
     </header>
        <section>
        
        
           
     <br/> {loading?
                <div style={{marginBottom:0}}>
                    
                    <BarLoader
                        color={"#0d6efd"}
                        loading={loading}        
                        height = {4}
                        width = {200}
                        cssOverride={{marginLeft:'44%'}}          
                    />
                </div>
                :
                <></>    
            }<br/>
    <div className = "container" style={{paddingRight:'0.75rem',paddingLeft:'0.75rem',marginLeft: 'auto',marginRight:'auto'}}>
        <div className = "row">
            <div className = "card col-md-6 offset-md-3 offset-md-3">
                <div>
                    <h2 className = "text-center">Add Golf Course</h2>
                    <div className = "card-body">
                        <form action = "" >
                            <div  ref={inputName}>
                                <h5>Name:</h5>
                                    <input
                                        type = "text"
                                        placeholder = "Example: Golf Course"
                                        name = "Name"
                                       
                                        className = "form-control"
                                        value = {name}
                                        onChange = {(e) => setName(e.target.value)} 
                                        required />
                            </div>
                            <br/>
                            <div   ref={inputAddress}>
                                <h5>Address:</h5>
                                    <input
                                        type = "text"
                                        placeholder = "Example: 10320 E Dynamite Blvd, Scottsdale AZ 85262"
                                        name = "Address"
                                      
                                        className = "form-control"
                                        value = {address}
                                        onChange = {(e) => setAddress(e.target.value)} 
                                        required />
                            </div>
                            <br/>
                           
                            <button type="submit" className = "btn btn-primary mb-2 player-right player-left" 
                                     disabled = {loading}
                                     onClick = {(e) =>saveCourse(e)}>
                                Submit
                            </button>
                            <button className = "btn btn-primary mb-2 player-right"
                                    disabled = {loading}                                    
                                    onClick = {(e) =>navigate ('/courses')}>
                                Cancel
                            </button>
                        </form>

                    </div>
                </div>

            </div>

        </div>
        
    </div>
    </section>
    </div>
  )
}

export default AddCourse;