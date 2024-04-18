import axios from 'axios'
const SERVER_URL = 'http://192.168.1.39:8080';
//const SERVER_URL = 'https://azcaagolfbackend-9b052d0a4071.herokuapp.com';

const COURSE_CREATE = SERVER_URL + '/addCourse';
const COURSE_FIND_ALL = SERVER_URL + '/findAllCourses'
const COURSE_DELETE = SERVER_URL + '/deleteCourse'
class UserService {
    
   
    saveCourse(course){
        return axios.post(COURSE_CREATE,course)
    }
    getCourses(){
        return axios.get(COURSE_FIND_ALL)
    }
    deleteCourse(id){
        return axios.get(COURSE_DELETE + "/"+id)
    }
}

export default new UserService()
