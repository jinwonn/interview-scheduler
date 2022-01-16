import { useReducer, useEffect } from "react";
import axios from "axios";

export default function useApplicationData () {

  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";

  const reducer = (state, action)  => {
    switch (action.type) {
      case SET_DAY:
        return { ...state, day: action.value }
      case SET_APPLICATION_DATA:
        return { ...state, ...action.value }
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }

  const [state, dispatch] = useReducer(reducer, {
      day: "Monday",
      days: [],
      appointments: {},
      interviewers: {}
    });

  const setDay = day => dispatch({type: SET_DAY, value: day});

  useEffect(() =>{
    Promise.all([
      axios.get("api/days"),
      axios.get("api/appointments"),
      axios.get("api/interviewers")
    ]).then(all => {
      const [days, appointments, interviewers] = all
      const applicationData = 
        { days: days.data, 
          appointments: appointments.data, 
          interviewers: interviewers.data
        }

      dispatch({ type: SET_APPLICATION_DATA, value: applicationData})
    });
   },[])
  
  const createAppointmentsObject = (id, interview) =>{
    const appointment = {
      ...state.appointments[id],
      interview: interview ? { ...interview} : null
    };

    return {
      ...state.appointments,
      [id]: appointment
    };
  }

  const createDaysArray = (appointments) => {
    const day = state.day;
    const days = state.days;
    const dayObject = days.filter((item) => item.name === day)[0]
    const index = days.indexOf(dayObject)

    const freeSpots = dayObject.appointments.reduce((acc,val) => {
      if(!appointments[val].interview) acc++
      return acc
    },0)
    
    const newDayObject = {
      ...dayObject,
      spots: freeSpots
    }

    days.splice(index, 1, newDayObject);
    
    return days;
  }

  const handleResponse = (response, appointments) => {
    if (response.status ===204) {
      const days = createDaysArray(appointments);
      const applicationData = { appointments, days }
      
      dispatch({ type: SET_APPLICATION_DATA, value: applicationData})
    }

    if (response.status === 500) {
      throw new Error('Status 500')
    }
  }

  const bookInterview = (id, interview) => {
    
    const appointments = createAppointmentsObject(id, interview);

    return axios.put(`/api/appointments/${id}`, {interview})
    .then(response => {
      handleResponse(response, appointments);
    })
  };

  const deleteInterview = (id) => {

    const appointments = createAppointmentsObject(id, null);

    return axios.delete(`api/appointments/${id}`)
    .then(response =>{
      handleResponse(response, appointments);
    })
  };

  return { state, setDay, bookInterview, deleteInterview}
}