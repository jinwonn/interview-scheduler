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
      interview: { ...interview}
    };

    return {
      ...state.appointments,
      [id]: appointment
    };
  }

  const bookInterview = (id, interview) => {
    
    const appointments = createAppointmentsObject(id, interview);

    return axios.put(`/api/appointments/${id}`, {interview})
    .then(response => {
      if (response.status ===204) {
        setState({...state, appointments})
      }

      if (response.status === 500) {
        throw new Error('Status 500')
      }
    })
  };

  const deleteInterview = (id) => {

    const appointments = createAppointmentsObject(id, null);

    return axios.delete(`api/appointments/${id}`)
    .then(response =>{
      if(response.status === 204) {
        setState(
          {...state,
          appointments}
        )
      }
      if (response.status === 500) {
        throw new Error('Status 500')
      }
    })
  }

  return { state, setDay, bookInterview, deleteInterview}
}