export function getAppointmentsForDay(state, day) {
  const days = state.days;
  let filteredDays = null;
  let appointmentsArray = null;
  let appointmentsForDay = [];
  
  if (days.length > 0) filteredDays = days.filter(item => item.name === day);
  
  if (filteredDays && filteredDays.length > 0) appointmentsArray = filteredDays[0].appointments;
  
  if (appointmentsArray)  appointmentsForDay = appointmentsArray.map(appointment => state.appointments[appointment]);
  
  return appointmentsForDay;
}

export function getInterviewersForDay(state, day) {
  const days = state.days;
  let filteredDays = null;
  let interviewersArray = null;
  let interviewersForDay = [];
  
  if (days.length > 0) filteredDays = days.filter(item => item.name === day);
  
  if (filteredDays && filteredDays.length > 0) interviewersArray = filteredDays[0].interviewers;
  
  if (interviewersArray)  interviewersForDay = interviewersArray.map(interviewer => state.interviewers[interviewer]);
  
  return interviewersForDay;
}

export function getInterview(state, interview) {
  let result = null;
  if (interview) {
    result = interview;
    result.interviewer = state.interviewers[interview.interviewer];
  }
  return result;
}