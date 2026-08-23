export type CalendarEventType = 'workout_completed' | 'workout_planned' | 'reminder';

export interface CalendarWorkoutEvent {
  type: 'workout_completed' | 'workout_planned';
  event_date: string;
  title: string;
  duration_minutes: number | null;
  /** Nombres en español de los grupos musculares (ej. ["Pecho", "Tríceps"]) — de los ejercicios reales de la sesión si type=workout_completed, del objetivo de la rutina si type=workout_planned. */
  muscle_groups: string[];
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
