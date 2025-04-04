import { useTable, useGlobalFilter, useSortBy } from 'react-table'
import React,{useState, useEffect} from 'react';
import PlayerService from '../../services/PlayerService';
import {CSVLink} from 'react-csv';
import * as RiIcons from 'react-icons/ri';
import * as SiIcons from 'react-icons/si';
import { GlobalFilter } from '../GlobalFilter';
import SchoolService from '../../services/SchoolService';
import ClipLoader from "react-spinners/ClipLoader";
import Select from 'react-select';
import pic from "../images/golfPlayer.png";
import '../Navbar.css';
const divisions = [
  { value: 'All Divisions', label: 'All Divisions' },
  { value: "JH", label: 'JH' },
  { value: "HS", label: 'HS' },

]


const AllPlayersReactTable=()=>{ 
  const [data,setPlayers]=useState([]);
  const [loading,setLoading] = useState(false);
  const [error, setError] = useState("");
  const schoolImages = [];
  
  useEffect(()=>{
    async function fetchData() {     
      setLoading(true);
      // get Schools
      await SchoolService.getSchools().then((response) => {           
        for(var i = 0; i < response.data.length; i++) 
        {
                schoolImages.push({
                    name: response.data[i].name,
                    image: response.data[i].image,
                });            
        }
      });
      await PlayerService.getPlayers().then((response) => {           
        setPlayers(response.data);
      });
      
      setLoading(false);        
    }
    fetchData();    
  },[]);

  async function deletePlayer(id) {
    const confirmed = window.confirm('Are you sure you want to delete this player?');
    if (!confirmed) {
      return;
    }
    setLoading(true);
    try {
      await PlayerService.deletePlayer(id);
      localStorage.message = 'Player '+ id + ' Deleted Successfully';
           //navigate('/matches-summary');
    } catch (error) {
      console.log(error);
      setError('Failed to Delete Match');
    } finally {
      setLoading(false);
      window.location.reload(false);
    }
  }

  async function fetchDataByDivision(division) {     
    setLoading(true);
    //await sleep(2000);
    await PlayerService.getPlayersByDivision(division).then((response) => {           
      setPlayers(response.data);
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
        Header: 'Division',
        accessor: 'division',        
      },
     
      {
        Header: 'Player ID',
        Cell: tableProps => (
          <div>  
       <img  src= {pic} style={{ width: 30, height:30 }} className = 'player1' />
    
            {tableProps.row.original.playerID}  
          </div> 
        ),
        accessor: 'playerID', 
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'School',
        Cell: tableProps => (
          <div>             
            <img src={`data:image/jpeg;base64,${getImage(tableProps.row.original.school)}`}  style={{ width: 30, height:30,marginRight: 10 }} className = 'player1'/>
            {tableProps.row.original.school}  
          </div> ),
        accessor: 'school',
      },
      {
        Header: 'Average Score',
        accessor: 'rank', 
        
        
      },
     
    
      {
      Header: (localStorage.role === 'Admin' )? 'Action':' ',
      Cell: tableProps => (
        <div>
          {(localStorage.role === 'Admin' )? 
          <button style={{ borderRadius: 50 }} onClick={(e)=>{ deletePlayer(tableProps.row.original.playerID);}} className = " btn"   disabled = {loading}><RiIcons.RiDeleteBin6Line/></button>
          //<RiIcons.RiDeleteBin6Line style={{ color: 'red', }}/>
          : 
          <></>}             
                    
        </div> ),      
      }

      
    ],
    []
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
  return (
    <div>
        <h1 className = "text-center"><RiIcons.RiTeamLine style={{ marginBottom: 10 ,marginRight: 5}}/>All Players</h1>
       
        <div style={{float:"right",paddingRight:10}}>
          <CSVLink data = {data} filename = 'Golf All Players'> <button type="button" className = "btn btn-primary mb-2">  <SiIcons.SiMicrosoftexcel  style={{ width: 20,height:20,marginRight: 5,marginBottom: 3}}/>Download</button> </CSVLink>
        </div>           
        <div className='rowC' >
              <GlobalFilter filter = {globalFilter} setFilter = {setGlobalFilter} />  
              <div style={{  width: 200, marginLeft: 10,borderRadius: 10,  borderColor: 'grey'}}>      
              <Select 
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
                  <th {...column.getHeaderProps(column.getSortByToggleProps())} style = {{background: 'white'}}> 
                   <span className="headerText">{column.render('Header')}</span>
                    <span>
                      {column.isSorted ? (column.isSortedDesc ? '🔽' : '🔼') : ''}
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
                        cssOverride={{marginLeft:'340%',marginRight:'auto',marginTop:'20%'}}          
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
export default AllPlayersReactTable;