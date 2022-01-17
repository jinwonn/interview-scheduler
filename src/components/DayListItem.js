import React from "react";
import classNames from "classnames";

import "components/DayListItem.scss";

export default function DayListItem(props) {
	let dayListItemClass = classNames(
		"day-list__item", {
			"day-list__item--selected": props.selected,
			"day-list__item--full": props.spots === 0
		});
  
	let formatSpots = (props) => {
		let outputString = props.spots;
		if (props.spots === 0) outputString = "no"; 

		if (props.spots === 1) {
			outputString += " spot remaining";
		} else {
			outputString += " spots remaining"; 
		}

		return outputString;
	};

	return (
		<li className={dayListItemClass} onClick={() => props.setDay(props.name)}>
			<h2 className = "text--regular">{props.name}</h2>
			<h3 className = "text--light">{formatSpots(props)}</h3>
		</li>
	);
}