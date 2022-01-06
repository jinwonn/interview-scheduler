import React from "react";
import classNames from "classnames";

import "components/InterviewerListItem.scss"

export default function InterviewerListItem(props) {
  let interviewerListItemClassName = classNames(
    "interviewers__item", {
      "interviewers__item--selected": props.selected
    }
  )
  return(
    <li className={ interviewerListItemClassName } onClick={() => props.setInterviewer(props.id)}>
      <img
        className="interviewers__item-image"
        src= { props.avatar }
        alt={ props.name}
      />
      { props.name }
    </li>
  )};