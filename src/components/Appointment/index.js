import React from "react";

import "components/Appointment/styles.scss"

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import useVisualMode from "hooks/useVisualMode";
import Status from "./Status";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE ="CREATE";
  const SAVING = "SAVING";
  const CANCELLING = "CANCELLING";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  const save = (name, interviewer) => {
    const interview = {
      student:name, 
      interviewer
    };
    
    transition(SAVING);

    props.bookInterview(props.id, interview)
    .then(() => {
      transition(SHOW);
    });
  };

  const deleteAppointment = () => {
    console.log('deleting', props.id)
    
    transition(CANCELLING)
    
    props.cancelInterview(props.id)
    .then(() => {
      transition(EMPTY);
    });
  };

  return (
    <article className="appointment">
      <Header time={props.time}/>
      {mode === EMPTY && <Empty onAdd={()=> transition(CREATE)} />}
      
      {mode === SHOW && (
        <Show
          student={props.interview.student} 
          interviewer={props.interview.interviewer} 
          onDelete={deleteAppointment}
        />
      )}

      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onSave={save}
          onCancel={()=>back()} 
        />
      )} 
      {mode === SAVING && (
        <Status message="Saving"/>
      )}
      {mode === CANCELLING && (
        <Status message="Cancelling"/>
      )}      
    </article>
  )
}