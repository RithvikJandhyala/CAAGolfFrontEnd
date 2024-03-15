import { useTable, useGlobalFilter, useSortBy } from 'react-table'
import React,{useState, useEffect} from 'react';
import {CSVLink} from 'react-csv';
import { BsCalendarEventFill } from "react-icons/bs";
import { IoMdRefresh } from "react-icons/io";
import * as RiIcons from 'react-icons/ri';
import * as SiIcons from 'react-icons/si';
import { GlobalFilter } from '../GlobalFilter';
import SchoolService from '../../services/SchoolService';
import ClipLoader from "react-spinners/ClipLoader";
import EventService from '../../services/EventService';
import {useNavigate} from "react-router-dom";
import win from "../images/check.png";
import { IoGolfSharp } from "react-icons/io5";


const EventSignUpReactTable=()=>{ 
  const [data,setEvents]=useState([]);
  const [loading,setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate=useNavigate();
  const [signedUpEvents,setSingedUpEvents]=useState([]);
  const [schoolImages, setSchoolImages] = useState([]);
  const [isSchoolImagesLoaded, setIsSchoolImagesLoaded] = useState(false);
 
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
        setSchoolImages(schoolImages);
        setIsSchoolImagesLoaded(true); 
        console.log("School Service Called")   
      });
      await EventService.getEvents().then((response) => {           
        setEvents(response.data);
      });
      if (localStorage.role != 'Admin'){
        await EventService.getSignedUpEventIDsBySchool(localStorage.school).then((response) => {           
          setSingedUpEvents(response.data);
        });
      }
      setLoading(false);  
    }
    fetchData();      
      

  },[]);


 async function deleteEvent(id) {

    const confirmed = window.confirm('Are you sure you want to delete this event?');
    if (!confirmed) {
      return;
    }
    setLoading(true);
    try {
      await EventService.deleteEvent(id);
      localStorage.message = "Event " + id + ' Deleted Successfully';
    } catch (error) {
      console.log(error);
      setError('Failed to Delete Event');
    } finally {
      setLoading(false);
      window.location.reload(false);
    }
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
            Header: 'Time',
            accessor: 'time',        
          },
          {
            Header: 'Event ID',
            accessor: 'id',        
          },
          {
            Header: 'Course',
            accessor: 'golfCourse', 
            Cell: tableProps => (
              <div>             
               <IoGolfSharp style={{ width: 20, height: 20,marginRight: 5,marginTop:-5}}/>
                {tableProps.row.original.golfCourse}  
              </div> ),   
          },

          /*{
            Header: 'Division',
            accessor: 'division',        
          },*/
          {
            Header: 'Host School',
            accessor: 'hostSchool',   
            Cell: tableProps => (
              <div>             
                <img src={`data:image/jpeg;base64,${getImage(tableProps.row.original.hostSchool)}`}  style={{ width: 30, height:30,marginRight: 10 }} className = 'player1'/>
                {tableProps.row.original.hostSchool}  
              </div> ),
          },
          {
            Header: '# Slots',
            accessor: 'teeTimes' ,
           // accessor: d => (<div>{d.player1ID} - {d.player1Name}</div>),
          },
          {
            Header: 'Available Slots',
            accessor: 'slots' ,
           // accessor: d => (<div>{d.player1ID} - {d.player1Name}</div>),
          },
          {  
            Header: (localStorage.role != 'Admin' )? 'Sign Up':' ',
            Cell: tableProps => (
              <div>
                  {localStorage.role != 'Admin' && (
                      <div>
                          {signedUpEvents.includes(tableProps.row.original.id) && (
                              <img src={win} style={{ width: 15, height: 15 }} className="player1" />
                          )}
                      </div>
                  )}
              </div>
            ),

          },
          
          {
            Header:  'Action',
            Cell: tableProps => (
              <div>
                {(localStorage.role === 'Admin' )? 
                <button style={{ borderRadius: 50 }} 
                      onClick={(e)=>{ deleteEvent(tableProps.row.original.id);}} 
                      className = " btn"   
                      disabled = {loading}>
                      <RiIcons.RiDeleteBin6Line/>
                </button>
                
                : 
                <button 
                    type="button" 
                    className = "btn btn-primary"
                    style = {{height: 30,fontSize: 12}}
                    hidden = {tableProps.row.original.slots <= 0} 
                    onClick={()=>{
                       localStorage.eventID = tableProps.row.original.id;
                       localStorage.eventDate = tableProps.row.original.eventDate;
                       localStorage.time = tableProps.row.original.time;
                       localStorage.hostSchool = tableProps.row.original.hostSchool;
                       localStorage.golfCourse = tableProps.row.original.golfCourse;
                       localStorage.slots = tableProps.row.original.slots;
                        navigate('/player-enroll')}}>
                   {(signedUpEvents.includes(tableProps.row.original.id))?   'Change': 'Sign Up' }
                </button>
                }             
                          
              </div> ),      
            }
      

      
    ],
    [signedUpEvents]
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
  } = useTable({ columns, data  },useGlobalFilter,useSortBy)

  const {globalFilter} = state
  async function resetSeason() {

    const confirmed1 = window.confirm('ARE YOU SURE YOU WANT TO RESET THE SEASON? PLEASE MAKE SURE YOU HAVE DOWNLOADED ALL THE INFORMATION FROM EACH SCREEN');
    if (!confirmed1) {
      return;
    }
    const confirmed2 = window.confirm('THIS IS AN IRREVERSABLE ACTION. ARE YOU SURE YOU WOULD LIKE TO CONTINUE?');
    if (!confirmed1) {
      return;
    }
    setLoading(true);
    try {
      await EventService.resetSeason();
      localStorage.message = "Season Reset Successfully";
           //navigate('/matches-summary');
    } catch (error) {
      console.log(error);
      setError('Failed to Reset Season');
    } finally {
      setLoading(false);
      window.location.reload(false);
    }
  }
  return (
    <div>
        <h1 className = "text-center"><BsCalendarEventFill style={{ marginBottom: 8 ,marginRight: 7}}/>
        
        {(localStorage.role === "Admin")? 'Event Admin' : 'Event Sign Up'} 
        
        </h1>
       
        <div style={{float:"right",paddingRight:10}}>
          {(localStorage.role === "Admin")? <button type="button" className = "btn btn-primary mb-2" onClick={()=>{navigate('/add-event')}}  style={{marginRight: 10}}> <BsCalendarEventFill style={{ width: 20,height:20,marginRight: 6,marginBottom:4}}/>Add Event </button> : <></>} 
          <CSVLink data = {data} filename = 'Golf All Events'> <button type="button" className = "btn btn-primary mb-2" style={{marginRight: 10}}>  <SiIcons.SiMicrosoftexcel  style={{ width: 20,height:20,marginRight: 5 ,marginBottom: 3}}/>Download</button> </CSVLink>
          {(localStorage.role == "Admin")? <button type="button" className = "btn btn-primary mb-2" onClick={()=>{resetSeason()}}  style={{marginRight: 10}}> <IoMdRefresh style={{ width: 20,height:20,marginRight: 0}}/> Reset Season </button>  : <></>}
        </div>           
        <div className='rowC' >
              <GlobalFilter filter = {globalFilter} setFilter = {setGlobalFilter} />  
              <div style={{  width: 200, marginLeft: 10,borderRadius: 10,  borderColor: 'grey'}}>      
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
                  <th {...column.getHeaderProps()} style = {{background: 'white'}}> {column.render('Header')}
                    <span> 
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ''
                        : ''
                      : ''}
                    </span> 
                    </th>
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
                        cssOverride={{marginLeft:'205%',marginRight:'auto',marginTop:'20%'}}          
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
      {//</TableScrollbar>
}
    </div>
  )
}
export default EventSignUpReactTable;