export type CalendarEventType = 'workout_completed' | 'workout_planned' | 'reminder';

export interface CalendarWorkoutEvent {
  type: 'workout_completed' | 'workout_planned';
  event_date: string;
  title: string;
  duration_minutes: number | null;
}

export interface CalendarReminderEvent {
  id: number;
  type: 'reminder';
  event_date: string;
  title: string;
  notes: string | null;
}

export type CalendarEvent = CalendarWorkoutEvent | CalendarReminderEvent;

export interface CalendarResponse {
  month: string;
  events: CalendarEvent[];
}

export interface CreateCalendarReminderInput {
  event_date: string;
  title: string;
  notes?: string;
}
