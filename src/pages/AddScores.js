import React, {useState,useEffect,useRef} from 'react'
import { useTable} from 'react-table'
import {useNavigate} from 'react-router-dom'
import Navbar from '../components/Navbar';
import Select from 'react-select';
import Alert from 'react-bootstrap/Alert';
import "react-datepicker/dist/react-datepicker.css";
import SchoolService from '../services/SchoolService';
import EventService from '../services/EventService';
const eventsOptions = [];


const AddScores = () => {
 
    const [loading,setLoading] = useState(false);
    const inputEventID = useRef();
    const [eventIdState,setEventIdState] = useState('');
    const [tableLength,setTableLength] = useState(0);
    const [data,setEventScorings]=useState([]);
    const [schoolImages, setSchoolImages] = useState([]);
    const [isSchoolImagesLoaded, setIsSchoolImagesLoaded] = useState(false);
    const [playerScores, setPlayerScores] = useState([]);
    const [error, setError] = useState("")
    const navigate=useNavigate();
    useEffect(()=>{
        if(localStorage.username === undefined){
            navigate("/");
        }
        if(localStorage.role === "Admin"){
            navigate("/all-players");
        }
        else{
            // get Schools
            SchoolService.getSchools().then((response) => {                 
                for(var i = 0; i < response.data.length; i++) 
                {
                        {schoolImages.push({
                            name: response.data[i].name,
                            image: response.data[i].image,
                        });
                    }
                }
                setSchoolImages(schoolImages);
                setIsSchoolImagesLoaded(true); 
                console.log("School Service Called")   
            });
            fetchData();
        }
    },[]); 
    
    const isValidForm = () => {
        var valid = true;
           /* check division */
           
            /* check awayTeam */
            if(eventIdState < 1){
                inputEventID.current.style.color = "red";
                setError("Select an Event");
                valid = false;
            }
            else {
                inputEventID.current.style.color = "black";
            }
            if (playerScores.length !== tableLength) {
                setError("Add Scores For All Players");
                return false;
            }

            return valid;
    }
    const fetchData = ()=>{
        eventsOptions.length = 0;
        EventService.getEventsBySchool(localStorage.school).then((response) => {           
            for(var i = 0; i < response.data.length; i++) 
            {
                eventsOptions.push({
                    value: response.data[i].id,
                    label: response.data[i].id+" - "+response.data[i].eventDate
                });
            }
        });
       
       
    }
    async function getEventScoringsByEventSchool(eventID){
        await EventService.getEventScoringsByEventSchool(eventID,localStorage.school).then((response) => {
            setTableLength(response.data.length);
            setEventScorings(response.data);
        });
        setPlayerScores([]);    
    }
    const columns = React.useMemo(
        () => [
          {
            Header: 'Division',
            accessor: 'playerDivision',        
          },
         
          {
            Header: 'Player',
            Cell: tableProps => (
                <div>  
                    {tableProps.row.original.playerID} - {tableProps.row.original.playerName}        
                </div> 
                ),
          },
          {
            Header: 'Score',
            Cell: tableProps => (
                <input
                    type = "number"
                    min= "1"
                    placeholder = "Score"
                    name = "score"
                    className = "form-control"
                    style = {{width: 85}}
                    //value = {}
                    onChange={(e) => {
                        var eventID = eventIdState;
                        var playerID = tableProps.row.original.playerID;
                        var id = eventID +"_"+ playerID;
                        var playerScore = parseInt(e.target.value);                         
                        //remove if record already exists
                        setPlayerScores((prevPlayerScores) => prevPlayerScores.filter((selectedItem) => selectedItem.playerID !== playerID));
                        //add new record
                        setPlayerScores((prevPlayerScores) =>[...prevPlayerScores, {id, eventID, playerID, playerScore }]);
                        }
                    }
                    required />            
                ),      
          }
        ],
     [eventIdState]
    )
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state,
       
    } = useTable({ columns, data  })
    const updatePlayerScores = async(e)  => {
        e.preventDefault(); 
        if(isValidForm()){
            setLoading(true);
            await EventService.updateEventScorings(playerScores).then((response) => {
                localStorage.message = "Player Scores added successfully";
                navigate('/event-scoring');    
                }).catch(error1 => { 
                console.log(error1);
                setError("Failed to Add Player Scores");
                setLoading(false);      
            })
            setLoading(false); 
        }
    }
    const getImage = (schoolName) => {    
        const foundSchool = schoolImages.find(school => schoolName === school.name);
        if (foundSchool) {
        return foundSchool.image;
        }    
        return null;
    };
    return(
        <div>
            <header>
                <Navbar /> 
            </header>
            {error && <Alert variant="danger">{error}</Alert>}  
            <br></br>
            <div className = "container" style={{paddingRight:'0.75rem',paddingLeft:'0.75rem',marginLeft: 'auto',marginRight:'auto'}}>
                <div className = "row">
                    <div className = "card col-md-6 offset-md-3 offset-md-3">
                        <div>
                            <br></br>
                            <h2 className = "text-center">
                                {isSchoolImagesLoaded  && (
                                            <img src={`data:image/jpeg;base64,${getImage(localStorage.school)}`}  style={{ width: 35, height:35,marginRight: 10 }} className = 'player1'/>  
                                        )}        
                                Add Scores
                            </h2>
                            <div className = "card-body">
                                <form>
                                <div className = "form-group mb-2">
                                   
                                </div >
                                    <br/>                                    
                                    <div ref={inputEventID}>
                                        <label className = "form-label">Event:</label>
                                        <Select
                                            type = "text"                                            
                                            placeholder = "Pick Event"
                                            onChange = {(e) =>{ 
                                                setEventIdState(e.value);
                                                getEventScoringsByEventSchool(e.value);
                                            }} 
                                            options={eventsOptions}
                                            required
                                        />
                                    <br/>
                                   </div>
                                   {(eventIdState === null || eventIdState === undefined || eventIdState === "") ?
                                        <></> 
                                        :
                                        <div   style={{ maxWidth: '99.9%' }}> 
                                            <table {...getTableProps()} className = "table table-striped" style ={{height:20}}>
                                            <thead>
                                                {headerGroups.map(headerGroup => (
                                                <tr {...headerGroup.getHeaderGroupProps()}>
                                                    {headerGroup.headers.map(column => (
                                                    <th {...column.getHeaderProps()} style = {{background: 'white'}}> {column.render('Header')} </th>
                                                    ))}
                                                </tr>
                                                ))}
                                            </thead>
                                            <tbody {...getTableBodyProps()}>
                                                {rows.map(row => {
                                                prepareRow(row)
                                                return (
                                                    <tr {...row.getRowProps()}>
                                                    {row.cells.map(cell => {
                                                        return (
                                                        <td {...cell.getCellProps()}> {cell.render('Cell')} </td>
                                                        )
                                                    })}
                                                    </tr>
                                                )
                                                })}
                                            </tbody>
                                            </table>
                                        </div>
                                    }
                                    <div>
                                    <button onClick={(e)=>{ 
                                        updatePlayerScores(e);
                                    
                                    }} className = "btn btn-primary mb-2 player-right player-left"  disabled = {loading}>Submit</button>
                                    <button onClick={(e)=>{ navigate('/event-scoring');}} className = "btn btn-primary mb-2 player-right"  disabled = {loading} >Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddScores 