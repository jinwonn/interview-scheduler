import React, { useState } from "react";
import Button from "components/Button";
import InterviewerList from "components/InterviewerList";
import { action } from "@storybook/addon-actions/dist/preview";

export default function Form(props) {
  const [student, setStudent] = useState(props.student || "");
  const [interviewer, setInterviewer] = useState(props.interviewer || null);

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off">
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            value={student}
            onChange={(event) => setStudent(event.target.value)}
          />
        </form>
        <InterviewerList 
          interviewers={props.interviewers}
          value={interviewer}
          onChange={setInterviewer}
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={action("onCancel")}>Cancel</Button>
          <Button confirm onClick={action("onConfirm")}>Save</Button>
        </section>
      </section>
    </main>
  )
}