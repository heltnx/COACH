export interface UserProfile {
  name: string;
  age: number;
  mobility: string;
  disabilities: string[];
  surgeries: string;
  goals: string[];
  equipment: string[];
  hobbies: string[];
}

export enum SessionType {
  PHYSICAL = 'physique',
  LEISURE = 'ludique',
}

export interface Activity {
  id: string; // Unique identifier for each activity
  name: string;
  description: string;
  duration?: string;
  reps?: string;
  sets?: string;
  videoSearchQuery?: string;
}

export interface Session {
  type: SessionType;
  title: string;
  description: string;
  activities: Activity[];
}

export interface DailyPlan {
  day: string;
  session: Session | null;
}

export interface WeeklyProgram {
  weeklySchedule: DailyPlan[];
  motivationalMessage: string;
}

export interface HistoryItem {
  id: number;
  date: string;
  sessionTitle: string;
}