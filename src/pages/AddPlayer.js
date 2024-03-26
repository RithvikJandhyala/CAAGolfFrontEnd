import React, {useState,useRef,useEffect} from 'react'
import PlayerService from '../services/PlayerService'
import {useNavigate} from 'react-router-dom'
import Navbar from '../components/Navbar';
import BarLoader from "react-spinners/BarLoader";

const AddPlayer = () => {
  const [playerName,setPlayerName] = useState('')
  const [school,setSchool] = useState(localStorage.school)
  const [division,setDivision] = useState('')
  const navigate  = useNavigate();
    useEffect(()=>{
        if(localStorage.username === undefined){
            navigate("/");
        }
        if(localStorage.role == "Admin"){
            navigate("/all-players");
        }    
    });

  const inputName = useRef();
  const inputDivision = useRef();
  
  const [loading,setLoading] = useState(false);
  const savePlayer = async(e) => {
        e.preventDefault();   
        if(isValidForm()){
            var name = playerName.trim();
            setLoading(true);         
            const player = {name,school,division}
            await PlayerService.createPlayer(player).then((response) => {                     
                localStorage.message = response.data;
                navigate ('/home');
            })
            setLoading(false);             
        }
  };
  const isValidForm = () => {
    var valid = true;
        if(division.length < 1){
            inputDivision.current.style.color = "red";
            valid = false;
        }
        else {
            inputDivision.current.style.color = "black";
        }
        if (playerName.length < 1) {
            inputName.current.style.borderColor = "red";
            valid = false;
        } else {
            inputName.current.style.borderColor = "black";
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
                    <h2 className = "text-center">Add Player</h2>
                    <div className = "card-body">
                        <form action = "" >
                         
                            <br/>
                            <h5>Division:</h5>
                            <div className = "form-group mb-2" ref={inputDivision}>                         
                                    <input type="radio" value="JH"  name="division" onChange = {(e) => setDivision(e.target.value)} /> Junior High
                                    <br/>
                                    <input type="radio" value="HS" name="division" onChange = {(e) => setDivision(e.target.value)} /> High School
                                    <br/>                           
                            </div>
                            <br/>
                                        <div>
                                            <h5>Name:</h5>
                                            <input
                                                type = "text"
                                                placeholder = "Example: John Doe"
                                                name = "playerName"
                                                ref={inputName}
                                                className = "form-control"
                                                value = {playerName}
                                                onChange = {(e) => setPlayerName(e.target.value)} 
                                                required />
                                        </div>                         
                            <br/>
                                <div className = "form-group mb-2">
                                <h5> School:</h5>
                                    <input
                                        type = "text"
                                        readOnly={true} 
                                        name = "school"
                                        className = "form-control"
                                        value = {localStorage.school}
                                        onChange = {(e) => setSchool(e.target.value)}                                         
                                    />
                                </div>
                            <br/>
                            <button type="submit" className = "btn btn-primary mb-2 player-right player-left" 
                                     disabled = {loading}
                                     onClick = {(e) =>savePlayer(e)}>
                                Submit
                            </button>
                            <button className = "btn btn-primary mb-2 player-right"
                                    disabled = {loading}                                    
                                    onClick = {(e) =>navigate ('/home')}>
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

export default AddPlayer;