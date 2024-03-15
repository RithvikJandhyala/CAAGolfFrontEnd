import { useTable, useGlobalFilter } from 'react-table'
import React,{useState, useEffect} from 'react';
import EditScoreModal from '../../pages/EditScoreModal.js';
import {CSVLink} from 'react-csv';
import { GlobalFilter } from '../GlobalFilter.js';
import { GiGolfTee } from "react-icons/gi";
import { FaRegEdit } from "react-icons/fa";
import * as RiIcons from 'react-icons/ri';
import * as SiIcons from 'react-icons/si';
import { MdScoreboard } from "react-icons/md";
import { IoGolfSharp } from "react-icons/io5";
import pic from "../images/golfPlayer.png";
import SchoolService from '../../services/SchoolService.js';
import {useNavigate} from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import Select from 'react-select';
import EventService from '../../services/EventService.js';
const divisions = [
  { value: 'All Divisions', label: 'All Divisions' },
  { value: "JH", label: 'JH' },
  { value: "HS", label: 'HS' },
]


const EventScoringReactTable=()=>{ 
  const navigate=useNavigate();
  const [data,setEventScorings]=useState([]);
  const [editedPlayerScore,setEditedPlayerScore]=useState([]);
  const [loading,setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingRow, setEditingRow] = React.useState(null);
  const schoolImages = [];
  const [selectedRow, setSelectedRow] = useState(null);
  const [idle, setIdle] = useState(false);
  const handleIdle = () => {setIdle(true);};
  useEffect(()=>{
    async function fetchData() {
      setLoading(true);
      await SchoolService.getSchools().then((response) => {           
        for(var i = 0; i < response.data.length; i++) 
        {
                {schoolImages.push({
                    name: response.data[i].name,
                    image: response.data[i].image,
                });
            }
        }
      });
      await EventService.getEventScorings().then((response) => {           
        setEventScorings(response.data);
    });
    setLoading(false);  
     
    }
    fetchData();      
  },[]);
  async function fetchDataByDivision(division) {     
    setLoading(true);
    await EventService.getEventScoringsByDivision(division).then((response) => {           
      setEventScorings(response.data);
    });
    setLoading(false);  
  }
  const getImage = (schoolName) => {    
    const foundSchool = schoolImages.find(school => schoolName === school.name);
    if (foundSchool) {
      console.log("True:", schoolName, foundSchool.name);
      return foundSchool.image;
    }    
    return null;
  };
  
  const columns = React.useMemo(
    () => [
        {
            Header: 'Date',
            accessor: 'eventDate',        
          },
          {
            Header: 'Event ID',
            accessor: 'eventID',        
          },
          {
            Header: 'Golf Course',
            accessor: 'course', 
            Cell: tableProps => (
              <div>             
               <IoGolfSharp style={{ width: 20, height: 20,marginRight: 5,marginTop:-5}}/>
                {tableProps.row.original.course}  
              </div> ),          
          },
          {
            Header: 'Division',
            accessor: 'playerDivision',        
          },
          {
            Header: "Player's School",
            accessor: 'playerSchool',   
            Cell: tableProps => (
                <div>      
                   <img src={`data:image/jpeg;base64,${getImage(tableProps.row.original.playerSchool)}`}  style={{ width: 30, height:30,marginRight: 10 }} className = 'player1'/>       
                   
                    {tableProps.row.original.playerSchool}  
                </div> ),     
          },
          {
            Header: 'Player',
            accessor: 'playerName',
            Cell: tableProps => (
              <div>  
                  <img  src= {pic} style={{ width: 30, height:30 }} className = 'player1' />
                  {tableProps.row.original.playerID} - {tableProps.row.original.playerName}
             </div> 
            )
           // accessor: d => (<div>{d.player1ID} - {d.player1Name}</div>),
          },
          {
            Header: 'Player Score',
            accessor: 'playerScore',
            Cell: tableProps => {
              const playerScore = tableProps.row.original.playerScore;
              return playerScore > 0 ? <span>{playerScore}</span> : <h6>Not Played</h6>;
            }
          },
       {
        Header: (localStorage.role === 'Admin') ? 'Action' : ' ',
        Cell: tableProps => (
          <div>
              {(localStorage.role === 'Admin') && tableProps.row.original.playerScore > 0 &&
              <button style={{ borderRadius: 50 }}
                      className="btn"
                      disabled={loading}
                      hidden= {tableProps.row.original.playerScore <= 0}
                      onClick={e => {
                              setEditingRow(tableProps.row.id);
                              localStorage.playerID = tableProps.row.original.playerID;
                              localStorage.playerName = tableProps.row.original.playerName;
                              localStorage.OGPlayerScore = tableProps.row.original.playerScore;
                             localStorage.eventID = tableProps.row.original.eventID;
                              handleIdle();
                              setSelectedRow(tableProps.row.original)  
                      }}>
                  <FaRegEdit />
              </button>
              }
              {(localStorage.role === 'Admin' )? 
                <button style={{ borderRadius: 50 }} 
                      onClick={() => {
                            deleteEventScoring(tableProps.row.original.id);
                      }}
                      className = " btn"   
                      disabled = {loading}>
                       <RiIcons.RiDeleteBin6Line/>
                      
                </button>
                
                : 
                <></>}    
          </div>
          
      )

       }
       /*
       {
        Header: (localStorage.role === 'Admin') ? 'Action' : ' ',
        Cell: tableProps => (
          <div>
              {(localStorage.role === 'Admin') && tableProps.row.original.playerScore > 0 &&
              <button style={{ borderRadius: 50 }}
                      className="btn"
                      disabled={loading}
                      hidden= {tableProps.row.original.playerScore <= 0}
                      onClick={() => {
                          
                              setEditingRow(tableProps.row.id);
                          
                      }}>
                  <FaRegEdit />
              </button>
              }
              {(localStorage.role === 'Admin' )? 
                <button style={{ borderRadius: 50 }} 
                      onClick={() => {
                        
                            deleteEventScoring(tableProps.row.original.id);
                        
                      }}
                      className = " btn"   
                      disabled = {loading}>
                        <RiIcons.RiDeleteBin6Line/>
                      
                </button>
                
                : 
                <></>}    
          </div>
          
      )

       },*/
 
    ],
    [editingRow]
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
  } = useTable({ columns, data  },useGlobalFilter)

  const {globalFilter} = state

  async function deleteEventScoring(id) {

    const confirmed = window.confirm('Are you sure you want to remove this player from this event?');
    if (!confirmed) {
      return;
    }
    setLoading(true);
    try {
      await EventService.deleteEventScoring(id);
      localStorage.message = "Player Removed from Event Successfully";
    } catch (error) {
      console.log(error);
      setError('Failed to Remove Player from Event');
    } finally {
      setLoading(false);
      window.location.reload(false);
    }
  } 
  return (
    <div>
        <EditScoreModal idle={idle} setIdle={setIdle}></EditScoreModal>
         <h1 className = "text-center"><GiGolfTee style={{ marginBottom: 10,marginRight: 5}}/>Event Scoring</h1>
         <div style={{float:"right",paddingRight:10}}> 
         {(localStorage.role != "Admin")? <button type="button" className = "btn btn-primary mb-2 " onClick={()=>{navigate('/add-scores')}} style={{marginRight: 10}}><MdScoreboard style={{ width: 20,height:20,marginRight: 5,marginBottom:2}}/>Add Scores</button> : <></>}
         <CSVLink data = {data} filename = 'Golf Event Scorings'> <button type="button" className = "btn btn-primary mb-2">  <SiIcons.SiMicrosoftexcel  style={{ width: 20,height:20,marginRight: 5 ,marginBottom: 3}}/>Download</button> </CSVLink>
        </div> 
        <div className='rowC' >
              <GlobalFilter filter = {globalFilter} setFilter = {setGlobalFilter} />  
              <div style={{  width: 200, marginLeft: 10,borderRadius: 10,  borderColor: 'grey'}}>      
              <Select style={{ width: 500,  borderRadius: 50}}
                  value={divisions.value}                                           
                  isSearchable={false}
                  onChange = {(e) =>{ fetchDataByDivision(e.label);  }} 
                  options={divisions}
                  defaultValue={divisions[0]}
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      borderRadius: "20px"
                    })
                  }}                  
              />         
              </div>                            
        </div>
       {// <TableScrollbar height = "70vh"  style={{ marginBottom: 10 ,marginRight: 5,border:'1px solid'}}>
        }
        
        <div style={{ maxWidth: '99.9%' }}>
          <>
          
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
          {loading?
                <div style={{marginBottom:0}}>                    
                    <ClipLoader
                        color={"#0d6efd"}
                        loading={loading}        
                        size = {50}
    
                        cssOverride={{marginLeft:'370%',marginRight:'auto',marginTop:'20%'}}          
                    />
                </div>
                :
                <></>    
            }
         
          <tbody {...getTableBodyProps()}>
            {
              (!loading)?
              rows.map(row => {
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
              })
              :
              <></>
          }
          </tbody>
        </table>
        </>
        </div>
        { (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setSelectedRow(null)}>&times;</span>
            <h2>Edit Row</h2>
            <p>Column 1: </p>
            <p>Column 2: </p>
            <button onClick={() => setSelectedRow(null)}>Close</button>
          </div>
        </div>
      )}
        <div>
          <ul style={{ display: 'flex', listStyle: 'none', padding: 0 }}>
              {editedPlayerScore.map(score => (
                  <li key={score.id} style={{ marginRight: '20px' }}>
                      <p>
                          {`ID: ${score.id}, Event ID: ${score.eventID}, Player ID: ${score.playerID}, Player Score: ${score.playerScore}`}
                      </p>
                  </li>
              ))}
          </ul>
        </div>



    </div>
  )
}
export default EventScoringReactTable;