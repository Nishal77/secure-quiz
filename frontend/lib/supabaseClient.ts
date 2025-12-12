// Supabase client for frontend
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Types
export interface Question {
  id: string;
  event_id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: 'A' | 'B' | 'C' | 'D';
  marks: number;
  negative_marks: number;
  difficulty: string;
  question_set?: number; // 1, 2, 3, or 4
}

export interface Session {
  id: string;
  event_id: string;
  usn: string;
  student_name: string;
  question_order: string[]; // Array of question UUIDs
  started_at: string;
  expires_at: string;
  submitted_at: string | null;
  is_submitted: boolean;
  tab_switch_count: number;
  server_start_time: string;
}

export interface Answer {
  id?: string;
  session_id: string;
  question_id: string;
  selected_answer: 'A' | 'B' | 'C' | 'D' | null;
  is_correct?: boolean;
  marks_obtained?: number;
}

export interface Result {
  id: string;
  session_id: string;
  total_questions: number;
  answered_count: number;
  correct_count: number;
  incorrect_count: number;
  total_marks: number;
  negative_marks: number;
  final_score: number;
  percentage: number;
}

