import React, { useEffect } from "react";

import "components/Appointment/styles.scss";

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import useVisualMode from "hooks/useVisualMode";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";

export default function Appointment(props) {
	const EMPTY = "EMPTY";
	const SHOW = "SHOW";
	const CREATE ="CREATE";
	const SAVING = "SAVING";
	const DELETING = "DELETING";
	const CONFIRM = "CONFIRM";
	const EDIT = "EDIT";
	const ERROR_SAVE = "ERROR_SAVE";
	const ERROR_DELETE = "ERROR_DELETE";

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
			.then(() => {transition(SHOW);})
			.catch(error => {transition(ERROR_SAVE, true);}); 
	};

	const deleteAppointment = () => {
		transition(DELETING, true);
    
		props.cancelInterview(props.id)
			.then(() => transition(EMPTY))
			.catch(error => {transition(ERROR_DELETE, true);});
	};

	const confirmDelete = () => {
		transition(CONFIRM);
	};

	const edit = () => {
		transition(EDIT);
	};
  
	useEffect(() => {
		if (props.interview && mode === EMPTY) {
			transition(SHOW);
		}
		if (props.interview === null && mode === SHOW) {
			transition(EMPTY);
		}
	}, [props.interview, transition, mode]);

	return (
		<article className="appointment">
			<Header time={props.time}/>
			{mode === EMPTY && <Empty onAdd={()=> transition(CREATE)} />}
      
			{mode === SHOW && props.interview &&(
				<Show
					student={props.interview.student} 
					interviewer={props.interview.interviewer} 
					onEdit={edit}
					onDelete={confirmDelete}
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
			{mode === DELETING && (
				<Status message="Deleting"/>
			)}
			{mode === CONFIRM && (
				<Confirm 
					message="Are you Sure you want to delete?"
					onConfirm={deleteAppointment}
					onCancel={back}
				/>
			)}

			{mode === EDIT && (
				<Form
					student={props.interview.student}
					interviewer={props.interview.interviewer.id}
					interviewers={props.interviewers}
					onSave={save}
					onCancel={()=>back()} 
				/>
			)}

			{mode === ERROR_SAVE && (
				<Error
					message="Unable to save appointment."
					onClose={()=>back()}
				/>
			)}

			{mode === ERROR_DELETE && (
				<Error 
					message="Unable to delete appointment."
					onClose={()=>back()}
				/>
			)}
		</article>
	);
}