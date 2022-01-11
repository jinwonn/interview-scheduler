import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "./Appointment";
import { getAppointmentsForDay } from "helpers/selectors";

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  })

  const setDay = day => setState({...state, day});

  let dailyAppointments = getAppointmentsForDay(state, state.day);

  const parsedAppointments = dailyAppointments.map((appointment) => 
    <Appointment key={appointment.id === dailyAppointments.length ? "last" : appointment.id} {...appointment} />
  )

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
      </section>
    </main>
  );
}
