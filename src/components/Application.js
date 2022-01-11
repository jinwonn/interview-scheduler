import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "./Appointment";

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  })

  const setDay = day => setState({...state, day});
  const setDays = days => setState(prev => ({...prev, days}));

  const dailyAppointments = [];

  const parsedAppointments = dailyAppointments.map((appointment) => 
    <Appointment key={appointment.id === dailyAppointments.length ? "last" : appointment.id} {...appointment} />
  )

  useEffect(() =>{
   axios.get("api/days").then(res => setDays(res.data))
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
