import React, {useState,useRef,useEffect} from 'react'
import { useTable} from 'react-table'
import EventService from '../services/EventService'
import {useNavigate} from 'react-router-dom'
import Navbar from '../components/Navbar';
import Alert from 'react-bootstrap/Alert';
import BarLoader from "react-spinners/BarLoader";
import SchoolService from '../services/SchoolService';
import PlayerService from '../services/PlayerService';


const PlayerEnroll = () => {
    const [data,setPlayers]=useState([]);
    const [loading,setLoading] = useState(false);
    const [schoolImages, setSchoolImages] = useState([]);
    const [signedUpPlayerIDs, setSignedUpPlayerIDs] = useState([]);
    const [isSchoolImagesLoaded, setIsSchoolImagesLoaded] = useState(false);
    const [error, setError] = useState("")
    
    const optionsSchools = [];
    const [checkedCount, setCheckedCount] = useState(0);
    const [selectedPlayersForEvent, setSelectedPlayersForEvent] = useState([]);
    const navigate  = useNavigate();
    const handleCheckboxChange = (event,playerID) => {
        const isChecked = event.target.checked;
        console.log('Checkbox changed:', playerID);
        if (isChecked) {
        setCheckedCount((prevCount) => prevCount + 1);
        var eventID = localStorage.eventID;
        var id = eventID +"_"+ playerID;
        var playerScore = 0;
        setSelectedPlayersForEvent((prevSelectedRows) => [...prevSelectedRows, {id,eventID,playerID, playerScore}]);      
        } else {
        setCheckedCount((prevCount) => prevCount - 1);
        setSelectedPlayersForEvent((prevSelectedRows) => prevSelectedRows.filter((selectedItem) => selectedItem.playerID !== playerID)
        );}
    };

    useEffect(()=>{
        if(localStorage.username === undefined){
            navigate("/");
        }
        if(localStorage.role == "Admin"){
            navigate("/all-players");
        }
        if(localStorage.eventID === undefined || localStorage.eventDate === undefined || localStorage.time === undefined ||localStorage.hostSchool === undefined ||localStorage.golfCourse === undefined || localStorage.slots === undefined){
            navigate("/");
        }
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
      
        async function fetchData() {
            setLoading(true);
            await PlayerService.getPlayersBySchool(localStorage.school).then((response) => {           
                setPlayers(response.data);
            });
            console.log("School:"+localStorage.school+" Event:"+localStorage.eventID)
            await EventService.getSignedUpPlayers(localStorage.eventID,localStorage.school).then((response) => {                 
                setSignedUpPlayerIDs(response.data);
            });
            setLoading(false);  
        }
        fetchData();     
    },[]);
    
    const getImage = (schoolName) => {    
        const foundSchool = schoolImages.find(school => schoolName === school.name);
        if (foundSchool) {
        return foundSchool.image;
        }    
        return null;
    };
    
    const columns = React.useMemo(
        () => [
        {
            Header: 'Division',
            accessor: 'division',        
        },
        
        {
            Header: 'Player',
            Cell: tableProps => (
            <div>  
                {tableProps.row.original.playerID} - {tableProps.row.original.name}        
            </div> 
            ),
        },
    
        {
            Header: 'Select',
            Cell: tableProps => {
                const isChecked = signedUpPlayerIDs.includes(tableProps.row.original.playerID);
                console.log(isChecked);
                const isSelected = selectedPlayersForEvent.some(player => player.playerID === tableProps.row.original.playerID);
                
                return (
                    <>
                        {isChecked ? (
                            <input 
                            type="checkbox" 
                            id={`checkbox-${tableProps.row.index}`} 
                           disabled = {true}
                           checked={true}/>
                        ) : (
                            <input 
                            type="checkbox" 
                            id={`checkbox-${tableProps.row.index}`} 
                            onChange={(e) => handleCheckboxChange(e, tableProps.row.original.playerID)}/>
                        )}
                    </>
                );
            }
        }
        ],
        [signedUpPlayerIDs]
    )
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state,
    
    } = useTable({ columns, data  })

    const saveEventScorings = async(e) => {
        e.preventDefault(); 
        if(isValidForm()){
            setLoading(true);       
            await EventService.saveEventScorings(selectedPlayersForEvent).then((response) => {                     
                localStorage.message = response.data;
                localStorage.eventID = undefined;
                localStorage.eventDate = undefined;
                localStorage.time = undefined;
                localStorage.hostSchool = undefined;
                localStorage.golfCourse = undefined;
                localStorage.slots = undefined;
                navigate ('/event-scoring');
            })
            setLoading(false);   
        }          
    };
    const isValidForm = () => {
        var valid = true;
            if(checkedCount > localStorage.slots){
                setError("Players Chosen exceeds the available slots");
                valid = false;
            }
        return valid;
    }

  return (
    <div>
        <header>
            <Navbar /> 
        </header>
        <section> 
            {error && <Alert variant="danger">{error}</Alert>}   
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
                <></>}
            
            <br/>
            
            <div className = "container" style={{paddingRight:'0.75rem',paddingLeft:'0.75rem',marginLeft: 'auto',marginRight:'auto'}}>
                <div className = "row">
                    <div className = "card col-md-6 offset-md-3 offset-md-3">
                        <div>
                            <h2 className = "text-center">Event Sign Up</h2>
                            <div className = "card-body">
                                <form action = "" >
                                    <h5 className = "userdetail">
                                        <span className='name' style={{marginLeft: 0}}>
                                            Date: {localStorage.eventDate}
                                        </span>
                                        <span className = "school">
                                            Time: {localStorage.time}
                                        </span>
                                    </h5>
                                    <br/>
                                    <br/>
                                    <h5>Host School:
                                    {isSchoolImagesLoaded  && (
                                            <img src={`data:image/jpeg;base64,${getImage(localStorage.hostSchool)}`}  style={{ width: 25, height:25,marginLeft: 10,marginRight: 5 }} className = 'player1'/>  
                                        )}            
                                    {localStorage.hostSchool}</h5>
                                    <br/>
                                    <h5 >Golf Course: {localStorage.golfCourse}</h5>
                                    <br/>
                                    <h5> Available Slots: {localStorage.slots}</h5>
                                    <hr></hr>
                                    <h5 className = "userdetail">
                                        <span className='name' style={{marginLeft: 0, color: 'red'}}>
                                            Remaining Slots: {localStorage.slots - checkedCount}
                                        </span>
                                        <span className = "school" style={{marginLeft: 0, color: '#02f702'}}>
                                            Players Chosen: {checkedCount}
                                        </span>
                                    </h5>
                                    <br/>
                                    <hr></hr>
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
                                    <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                                        <button type="submit" className = "btn btn-primary mb-2" style = {{marginRight: 10}} 
                                                disabled = {loading}
                                                onClick = {(e) =>saveEventScorings(e)}
                                                >
                                            Submit
                                        </button>
                                        <button
                                            className="btn btn-primary mb-2"
                                            disabled={loading}
                                            onClick={(e) => {
                                                localStorage.eventID = undefined;
                                                localStorage.eventDate = undefined;
                                                localStorage.time = undefined;
                                                localStorage.hostSchool = undefined;
                                                localStorage.golfCourse = undefined;
                                                localStorage.slots = undefined;
                                                navigate('/event-sign-up');
                                            }}>
                                            Cancel
                                        </button>
                                    </div>
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

export default PlayerEnroll;