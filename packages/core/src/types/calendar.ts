// Esta línea sirve para declarar el tipo «CalendarEventType» como «'workout_completed' | 'workout_planned' | 'reminder'».
export type CalendarEventType = 'workout_completed' | 'workout_planned' | 'reminder';

// Esta línea sirve para declarar la interfaz «CalendarWorkoutEvent».
export interface CalendarWorkoutEvent {
  // Esta línea sirve para declarar el campo «type» de tipo «'workout_completed' | 'workout_planned'».
  type: 'workout_completed' | 'workout_planned';
  // Esta línea sirve para declarar el campo «event_date» de tipo «string».
  event_date: string;
  // Esta línea sirve para declarar el campo «title» de tipo «string».
  title: string;
  // Esta línea sirve para declarar el campo «duration_minutes» de tipo «number | null».
  duration_minutes: number | null;
  /** Nombres en español de los grupos musculares (ej. ["Pecho", "Tríceps"]) — de los ejercicios reales de la sesión si type=workout_completed, del objetivo de la rutina si type=workout_planned. */
  // Esta línea sirve para declarar el campo «muscle_groups» de tipo «string[]».
  muscle_groups: string[];
}

// Esta línea sirve para declarar la interfaz «CalendarReminderEvent».
export interface CalendarReminderEvent {
  // Esta línea sirve para declarar el campo «id» de tipo «number».
  id: number;
  // Esta línea sirve para declarar el campo «type» de tipo «'reminder'».
  type: 'reminder';
  // Esta línea sirve para declarar el campo «event_date» de tipo «string».
  event_date: string;
  // Esta línea sirve para declarar el campo «title» de tipo «string».
  title: string;
  // Esta línea sirve para declarar el campo «notes» de tipo «string | null».
  notes: string | null;
}

// Esta línea sirve para declarar el tipo «CalendarEvent» como «CalendarWorkoutEvent | CalendarReminderEvent».
export type CalendarEvent = CalendarWorkoutEvent | CalendarReminderEvent;

// Esta línea sirve para declarar la interfaz «CalendarResponse».
export interface CalendarResponse {
  // Esta línea sirve para declarar el campo «month» de tipo «string».
  month: string;
  // Esta línea sirve para declarar el campo «events» de tipo «CalendarEvent[]».
  events: CalendarEvent[];
}

// Esta línea sirve para declarar la interfaz «CreateCalendarReminderInput».
export interface CreateCalendarReminderInput {
  // Esta línea sirve para declarar el campo «event_date» de tipo «string».
  event_date: string;
  // Esta línea sirve para declarar el campo «title» de tipo «string».
  title: string;
  // Esta línea sirve para declarar el campo opcional «notes» de tipo «string».
  notes?: string;
}
