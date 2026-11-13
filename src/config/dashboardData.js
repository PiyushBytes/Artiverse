// Live data state for Artiverse Student & Lead Dashboards (Starts clean, populated by user creations)

export const initialStudentData = {
  summary: '0 committees · 0 event passes',
  profileCompleteness: 50,
  profileNextStep: 'Create or join a campus committee to start collaborating.',

  // Real upcoming priority (null until scheduled by user)
  nextUp: null,

  // User-created and joined committees (populated from backend POST /av/committee/committee-list/)
  committees: [],

  // Ticket-style event passes
  passes: [],
}
