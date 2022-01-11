import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "./Appointment";

const appointments = [
  {
    id: 1,
    time: "12pm",
  },
  {
    id: 2,
    time: "1pm",
    interview: {
      student: "Lydia Miller-Jones",
      interviewer:{
        id: 3,
        name: "Sylvia Palmer",
        avatar: "https://i.imgur.com/LpaY82x.png",
      }
    }
  },
  {
    id: 3,
    time: "2pm",
  },
  {
    id: 4,
    time: "3pm",
    interview: {
      student: "Archie Andrews",
      interviewer:{
        id: 4,
        name: "Cohana Roy",
        avatar: "https://i.imgur.com/FK8V841.jpg",
      }
    }
  },
  {
    id: 5,
    time: "4pm",
  }
];

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: []
  })

  const setDay = day => setState({...state, day});
  const setDays = days => setState(prev => ({...prev, days}));

  const parsedAppointments = appointments.map((appointment) => 
    <Appointment key={appointment.id === appointments.length ? "last" : appointment.id} {...appointment} />
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
