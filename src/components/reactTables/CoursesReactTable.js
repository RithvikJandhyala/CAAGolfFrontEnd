import { useTable, useGlobalFilter, useSortBy } from 'react-table'
import React,{useState, useEffect} from 'react';
import {CSVLink} from 'react-csv';
import * as RiIcons from 'react-icons/ri';
import * as SiIcons from 'react-icons/si';
import { IoGolfSharp } from "react-icons/io5";
import { GlobalFilter } from '../GlobalFilter';
import CourseService from '../../services/CourseService';
import ClipLoader from "react-spinners/ClipLoader";
import {useNavigate} from "react-router-dom";

const CoursesReactTable=()=>{ 
  const [data,setCourses]=useState([]);
  const [loading,setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate=useNavigate();
  
  useEffect(()=>{
    async function fetchData() {     
      setLoading(true);
      await CourseService.getCourses().then((response) => {           
        setCourses(response.data);
      });
      setLoading(false);  
      
    }
    fetchData();      
      

  },[]);
  async function deleteCourse(id) {

    const confirmed = window.confirm('Are you sure you want to delete this school?');
    if (!confirmed) {
      return;
    }
    setLoading(true);
    try {
      await CourseService.deleteCourse(id);
      localStorage.message = "Course " + id + ' Deleted Successfully';
    } catch (error) {
      console.log(error);
      setError('Failed to Delete Course');
    } finally {
      setLoading(false);
      window.location.reload(false);
    }
  }
  

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',        
      },
      {
        Header: 'Name',
       
          accessor: 'name',
          Cell: tableProps => (
            <div>             
             <IoGolfSharp style={{ width: 20, height: 20,marginRight: 5,marginTop:-5}}/>
              {tableProps.row.original.name}  
            </div> ),           
      },
      {
        Header: 'Address',
       
          accessor: 'address',        
      },
     
      {
        Header: (localStorage.role === 'Admin' )? 'Action':' ',
        Cell: tableProps => (
        <div>
          {(localStorage.role === 'Admin' )? 
          <button onClick={(e)=>{ deleteCourse(tableProps.row.original.id);}} className = "btn "  disabled = {loading}><RiIcons.RiDeleteBin6Line/></button>: 
          <></>}             
                    
        </div> )
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
        <h1 className = "text-center"><IoGolfSharp style={{ marginBottom: 11 ,marginRight: 7}}/>Golf Courses</h1>
        <div style={{float:"right",paddingRight:10}}>
            <button type="button" className = "btn btn-primary mb-2" onClick={()=>{navigate('/add-course')}}  style={{marginRight: 10}}> <IoGolfSharp style={{ width: 17,height:15,marginRight: 5, marginBottom: 6}}/>Add Courses </button>
          <CSVLink data = {data} filename = 'Golf All Courses'> <button type="button" className = "btn btn-primary mb-2" style={{marginRight: 10}}>  <SiIcons.SiMicrosoftexcel  style={{ width: 20,height:20,marginRight: 5, marginBottom: 3}}/>Download</button> </CSVLink>
        
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
                        cssOverride={{marginLeft:'125%',marginRight:'auto',marginTop:'10%'}}          
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
export default CoursesReactTable;