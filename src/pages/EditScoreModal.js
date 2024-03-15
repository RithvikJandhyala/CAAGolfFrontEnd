import React, { useState} from 'react';
import Modal from 'react-modal';
import {useNavigate} from 'react-router-dom'
import EventService from '../services/EventService';


const EditScoreModal=({idle,setIdle})=>{
    const [editedPlayerScore,setEditedPlayerScore]=useState([]);
    const [loading,setLoading] = useState(false);
  const [error, setError] = useState("");
    const navigate  = useNavigate();
    const customStyles = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
        },
      };
      const handleChange = (eventID,playerID,playerScore) => {
        var id = eventID +"_"+ playerID;
        console.log("New Score:"+playerScore)
        //remove if record already exists
        setEditedPlayerScore((prevPlayerScores) => prevPlayerScores.filter((selectedItem) => selectedItem.playerID !== playerID));
        //add new record                        
        setEditedPlayerScore((prevPlayerScores) =>[...prevPlayerScores, {id, eventID, playerID, playerScore }]);        
      }
      async function updatePlayerScores(editedPlayerScore) {
        setLoading(true);
        console.log("Updating Score" );
        editedPlayerScore.forEach(item => {
          console.log("Score" + item);
        });
        await EventService.updateEventScorings(editedPlayerScore).then((response) => {
            localStorage.message = "Player Score Edited successfully";
            navigate('/event-scoring');    
            }).catch(error1 => { 
            console.log(error1);
            setError("Failed to Edit Player Score");
            setLoading(false);      
        })
        setLoading(false); 
      }
    return(
        <Modal isOpen={idle} style={customStyles}>
        <div>
            <h1 style={{textAlign:"center"}}>Edit Score</h1>
            <div className = "card-body">
                <br/>
                <h5 >Event ID: {localStorage.eventID}</h5>
                <h5 >Player: {localStorage.playerID + " - " + localStorage.playerName}</h5>
                <h5 >Original Score: {localStorage.OGPlayerScore}</h5>
                {/*<div className = "userdetail">
                  <span className='name' style={{marginLeft: 0}}>
                    <h5>New Score:</h5>                     
                  </span>
                  <span className = "school">
                    <input
                      type="number"
                      step = "1"
                      min = "1"
                      style = {{width:75}}
                      onChange={e => {
                      var eventID = localStorage.eventID;
                      var playerID = localStorage.playerID;
                      var playerScore = parseInt(e.target.value);  
                      handleChange(eventID, playerID, playerScore)
                      }}
                    />               
                  </span>
                    </div>*/}
                  <h5>
                    New Score:
                    <input
                      type="number"
                      step = "1"
                      min = "1"
                      style = {{width:75, height: 30, marginLeft: 10}}
                      onChange={e => {
                      var eventID = localStorage.eventID;
                      var playerID = localStorage.playerID;
                      var playerScore = parseInt(e.target.value);  
                      handleChange(eventID, playerID, playerScore)
                      }}
                    />               
                    
                    
                  </h5> 
                  <br></br>
                <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                    <button className = "btn btn-primary" style={{width:"35%" ,marginRight:"2%",display:"inline"}} onClick={()=>{
                        updatePlayerScores(editedPlayerScore);
                        window.location.reload();
                        //navigate('/event-scoring');
                        setIdle(false)
                        localStorage.eventID = undefined;
                        localStorage.playerID= undefined;
                        localStorage.playerName= undefined;
                        localStorage.OGPlayerScore= undefined;
                        }}>
                            
                            
                        Submit</button>
                    <button className = "btn btn-primary" style={{width:"35%",display:"inline"}} onClick={()=>{
                        navigate('/event-scoring');
                        setIdle(false);
                        //localStorage.clear()
                    }}>
                        Cancel
                    </button>
                </div>
               
            </div>
        </div>
        </Modal>
    )

}

export default EditScoreModal;