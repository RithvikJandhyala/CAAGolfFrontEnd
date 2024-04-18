import React, {useState,useRef,useEffect} from 'react'
import EventService from '../services/EventService'
import {useNavigate} from 'react-router-dom'
import Navbar from '../components/Navbar';
import DatePicker from "react-datepicker";
import TimePicker from 'react-time-picker';
import BarLoader from "react-spinners/BarLoader";
import SchoolService from '../services/SchoolService';
import CourseService from '../services/CourseService';
import Select from 'react-select';
import CurrencyInput from 'react-currency-input-field';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';

const AddEvent = () => {
  const [eventDate,setEventDate] = useState(new Date());
  const [time,setTime] = useState('10:00')
  const [golfCourse,setGolfCourse] = useState('')
  const [fee,setFee] = useState(0.00)
  const [hostSchool,setHostSchool] = useState('')
  const [teeTimes,setTeeTimes] = useState('')
  const [division,setDivision] = useState('')

  const optionsSchools = [];
  const optionsCourses = [];
  const navigate  = useNavigate();
    useEffect(()=>{
        if(localStorage.username === undefined){
            navigate("/");
        }
        if(localStorage.role === "Admin"){
            navigate("/home");
        }      
    });

  
    const inputEventDate = useRef();  
    const inputTime = useRef();
  const inputGolfCourse = useRef();
  const inputTeeTimes = useRef();
  const inputDivision = useRef();
  const inputFee = useRef();
  
  
  const [loading,setLoading] = useState(false);
  const saveEvent = async(e) => {
        e.preventDefault();   
        if(isValidForm()){
            setLoading(true);
            const convEventDate = eventDate.toLocaleDateString();
            const time12 = new Date(`2000-01-01T${time}:00`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });         
            const doubleFee = parseFloat(fee);
            const event = {
                eventDate: convEventDate,
                time: time12,
                golfCourse,
                hostSchool: localStorage.school,
                teeTimes,
                division,
                fee: doubleFee
            }
            await EventService.saveEvent(event).then((response) => {                     
                localStorage.message = response.data;
                navigate ('/event-sign-up');
            })
            setLoading(false);             
        }
  };
  const isValidForm = () => {
    var valid = true;
        if(eventDate.length < 1){
            inputEventDate.current.style.color = "red";
            valid = false;
        }
        else {
            inputEventDate.current.style.color = "black";
        }

        if(time === null||time.length < 1){
            inputTime.current.style.color = "red";
            valid = false;
        }
        else {
            inputTime.current.style.color = "black";
        }
        if(golfCourse.length < 1){
            inputGolfCourse.current.style.color = "red";
            valid = false;
        }
        else {
            inputGolfCourse.current.style.color = "black";
        }
        if(division.length < 1){
            inputDivision.current.style.color = "red";
            valid = false;
        }
        else {
            inputDivision.current.style.color = "black";
        }
        if(teeTimes < 1 || teeTimes === null){
            inputTeeTimes.current.style.color = "red";
            valid = false;
        }
        else {
            inputTeeTimes.current.style.color = "black";
        }
        if(fee < 0 || fee === null){
            inputFee.current.style.color = "red";
            valid = false;
        }
        else {
            inputFee.current.style.color = "black";
        }
        
        return valid;
  }
  SchoolService.getSchools().then((response) => {           
    for(var i = 0; i < response.data.length; i++) 
    {
        optionsSchools.push({
            value: response.data[i].name,
            label: response.data[i].name,
        });
    }
    
});

CourseService.getCourses().then((response) => {           
    for(var i = 0; i < response.data.length; i++) 
    {
        optionsCourses.push({
            value: response.data[i].name,
            label: response.data[i].name,
        });
    }
});

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
                    <h2 className = "text-center">Add Event</h2>
                    <div className = "card-body">
                        <form action = "" >
                            <div ref={inputEventDate}>
                                <h5 className = "form-label">Event Date:</h5> 
                                <DatePicker selected={eventDate} onChange={(date) => setEventDate(date)} className = "form-control" style={{width: '20%'}} onKeyDown={(e) => {e.preventDefault();}}/>
                            </div>
                            <br/>
                            <div ref={inputTime}  >
                                <h5 className="form-label">Time:</h5>
                                <TimePicker
                                    style={{ width: '200px'}} // Adjust the width as needed
                                    value={time}
                                    onChange={(newTime) => setTime(newTime)}                                    
                                />
                            </div>                            
                            <br/>
                            <div ref={inputGolfCourse}>
                                <h5>Golf Course:</h5>
                                <Select
                                    type = "text"
                                    placeholder = "Select Golf Course"
                                    //name={`player${index}Id`} 
                                                               
                                    onChange = {(e) =>{ setGolfCourse(e.label) }} 
                                    options={optionsCourses}
                                /> 
                            </div>
                            <br/>
                            <div ref={inputDivision}>
                                <h5>Division:</h5>                    
                                    <input type="radio" value="JH"  name="division" onChange = {(e) => setDivision(e.target.value)} /> Junior High
                                    <br/>
                                    <input type="radio" value="HS" name="division" onChange = {(e) => setDivision(e.target.value)} /> High School
                                    <br/>
                                    <input type="radio" value="JH-HS" name="division" onChange = {(e) => setDivision(e.target.value)} /> Junior High & High School
                                    <br/>
                            </div>
                            <br/>
                            <div ref={inputFee}>
                                <h5>Fee</h5>
                                <CurrencyInput
                                    id="validation-example-2-field"
                                    placeholder="Enter Fee (Ex: $0.00)"
                                    decimalsLimit={2}
                                    className="form-control"
                                    onValueChange={(e) => {
                                        console.log(e); // Log the event object to check its structure
                                        setFee(e); // Update fee state directly
                                    }}
                                    prefix={'$'}
                                    step={10}
                                />
                            </div>
                            <br/>
                            <div ref={inputTeeTimes}>
                                <h5># Slots</h5>
                                    <input
                                        type = "number"
                                        min = "1"
                                        placeholder = "# Slots"
                                        name = "teeTimes"
                                        className = "form-control"
                                        value = {teeTimes}
                                        onChange = {(e) => setTeeTimes(e.target.value)} 
                                        required />
                            </div>
                            <br/>
                            <button type="submit" className = "btn btn-primary mb-2 player-right player-left" 
                                     disabled = {loading}
                                     onClick = {(e) =>saveEvent(e)}>
                                Submit
                            </button>
                            <button className = "btn btn-primary mb-2 player-right"
                                    disabled = {loading}                                    
                                    onClick = {(e) =>navigate ('/event-sign-up')}>
                                Cancel
                            </button>
                        </form>
                        <div>
                            <h1>{fee}</h1>
                        </div>

                    </div>
                </div>

            </div>

        </div>
        
    </div>
    
    </section>
    </div>
  )
}

export default AddEvent;