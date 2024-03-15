import axios from 'axios'
//const SERVER_URL = 'http://localhost:8080';
const SERVER_URL = 'https://azcaagolfbackend-9b052d0a4071.herokuapp.com';
const EVENT_CREATE = SERVER_URL + '/addEvent';
const EVENT_FIND_ALL = SERVER_URL + '/findAllEvents'
const EVENT_DELETE = SERVER_URL + '/deleteEvent'
const EVENT_SCORINGS_CREATE = SERVER_URL + '/addEventScorings';
const EVENT_SCORING_DELETE = SERVER_URL + '/deleteEventScoring'
const EVENT_SCORINGS_FIND_ALL = SERVER_URL + '/findAllEventScorings';
const EVENT_BY_SCHOOL_FIND_ALL = SERVER_URL + '/findAllEventsBySchool';
const EVENT_SCORINGS_BY_EVENT_SCHOOL_FIND_ALL = SERVER_URL + '/findAllEventScoringsByEventSchool';
const EVENT_SCORINGS_UPDATE = SERVER_URL + '/updateScores';
const EVENT_SCORINGS_FIND_SIGNED_UP_PLAYERS = SERVER_URL + '/getSignedUpPlayers'
const RESET_SEASON = SERVER_URL + '/resetSeason';
const EVENT_ID_BY_SCHOOL = SERVER_URL+ '/getSignedUpEventIDsBySchool';
class EventService {
    
   
    saveEvent(event){
        return axios.post(EVENT_CREATE,event)
    }
    getEvents(){
        return axios.get(EVENT_FIND_ALL)
    }
    getEventsBySchool(school){
        return axios.get(EVENT_BY_SCHOOL_FIND_ALL + "/"+school)
    }
    deleteEvent(id){
        return axios.get(EVENT_DELETE + "/"+id)
    }
    saveEventScorings(eventScorings){
        return axios.post(EVENT_SCORINGS_CREATE,eventScorings)
    }
    updateEventScorings(eventScorings){
        return axios.post(EVENT_SCORINGS_UPDATE,eventScorings)
    }
    getEventScorings(){
        return axios.get(EVENT_SCORINGS_FIND_ALL)
    }
    getEventScoringsByDivision(division){
        return  axios.get(EVENT_SCORINGS_FIND_ALL+"/"+division);
    }
    getSignedUpEventIDsBySchool(school){
        return  axios.get(EVENT_ID_BY_SCHOOL+"/"+school);
    }
    deleteEventScoring(id){
        return axios.get(EVENT_SCORING_DELETE + "/"+id)
    }
    getEventScoringsByEventSchool(eventID,school){
        return axios.get(EVENT_SCORINGS_BY_EVENT_SCHOOL_FIND_ALL + "/"+ eventID+ "/" +school)
    }
    getSignedUpPlayers(eventID,school){
        return axios.get(EVENT_SCORINGS_FIND_SIGNED_UP_PLAYERS + "/"+ eventID+ "/" +school)
    }
    resetSeason(){
        return axios.get(RESET_SEASON);
    }
}

export default new EventService()
