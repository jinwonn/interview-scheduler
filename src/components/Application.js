import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "./Appointment";
import { getAppointmentsForDay, getInterviewersForDay, getInterview } from "helpers/selectors";

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  })

  const setDay = day => setState({...state, day});
  
  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview}
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

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
    const appointment = {
      ...state.appointments[id],
      interview: null
    }

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

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

  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const dailyInterviewers = getInterviewersForDay(state, state.day)

  const parsedAppointments = dailyAppointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview)
    
    return (
      <Appointment 
        key={appointment.id}
        {...appointment} 
        interview={interview}
        interviewers={dailyInterviewers}
        bookInterview={bookInterview}
        cancelInterview={deleteInterview}
      />
    ) 
  })

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

  return (
    <main className="layout">
      <section className="sidebar">      
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days = { state.days }
            day = { state.day }
            onChange = {setDay}
          />
        </nav>
      </section>
      <section className="schedule">
        {parsedAppointments}
        <Appointment time="5pm"/>
      </section>
    </main>
  );
}
