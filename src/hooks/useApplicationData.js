import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData () {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  })

  const setDay = day => setState({...state, day});

  useEffect(() =>{
    Promise.all([
      axios.get("api/days"),
      axios.get("api/appointments"),
      axios.get("api/interviewers")
    ]).then(all => {
     const [days, appointments, interviewers] = all
     setState(prev => (
       {...prev, 
         days: days.data, 
         appointments: appointments.data, 
         interviewers: interviewers.data
       }))
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
      setState({...state, appointments, days})
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