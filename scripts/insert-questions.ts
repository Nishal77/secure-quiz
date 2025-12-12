/**
 * Utility script to insert quiz questions into Supabase
 * 
 * Usage:
 * 1. Set environment variables:
 *    - SUPABASE_URL
 *    - SUPABASE_SERVICE_ROLE_KEY
 * 2. Update EVENT_ID in the script
 * 3. Run: npx tsx scripts/insert-questions.ts
 * 
 * Or use Deno:
 * deno run --allow-net --allow-env scripts/insert-questions.ts
 */

import { createClient } from '@supabase/supabase-js';

// Configuration
const SUPABASE_URL = process.env.SUPABASE_URL || Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const EVENT_ID = process.env.EVENT_ID || Deno.env.get('EVENT_ID') || '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  Deno.exit(1);
}

if (!EVENT_ID) {
  console.error('❌ Missing EVENT_ID. Set EVENT_ID environment variable or update the script');
  Deno.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

interface QuestionData {
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: 'A' | 'B' | 'C' | 'D';
  marks?: number;
  negative_marks?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}

// Set 1 Questions
const questions: QuestionData[] = [
  {
    question_text: 'What is the main difference between a Compiler and an Interpreter?',
    option_a: 'Compiler translates line-by-line; Interpreter translates whole code',
    option_b: 'Interpreter translates line-by-line; Compiler translates whole code',
    option_c: 'Both translate line-by-line',
    option_d: 'Both translate whole code',
    correct_answer: 'B',
  },
  {
    question_text: 'What is the purpose of Inheritance in OOP?',
    option_a: 'To hide data',
    option_b: 'To reuse existing code',
    option_c: 'To increase code size',
    option_d: 'To execute code faster',
    correct_answer: 'B',
  },
  {
    question_text: 'What is a REST API?',
    option_a: 'API used only for mobile apps',
    option_b: 'API that works only with XML',
    option_c: 'API that follows HTTP-based architectural principles',
    option_d: 'API that runs only on cloud',
    correct_answer: 'C',
  },
  {
    question_text: 'Primary Key in a table must be:',
    option_a: 'Always null',
    option_b: 'Always unique and not null',
    option_c: 'Only unique',
    option_d: 'Only numeric',
    correct_answer: 'B',
    difficulty: 'easy',
  },
  {
    question_text: 'Difference between GET and POST?',
    option_a: 'GET sends data in body; POST sends data in URL',
    option_b: 'GET is used for updates; POST for retrieval',
    option_c: 'GET is idempotent; POST is not',
    option_d: 'Both behave the same',
    correct_answer: 'C',
  },
  {
    question_text: 'SQL Injection is dangerous because:',
    option_a: 'It slows the database',
    option_b: 'It allows modifying or accessing unauthorized data',
    option_c: 'It hides data',
    option_d: 'It improves performance',
    correct_answer: 'B',
  },
  {
    question_text: 'In Java, Interface differs from Abstract Class because:',
    option_a: 'Interfaces allow multiple inheritance',
    option_b: 'Abstract classes are faster',
    option_c: 'Interfaces cannot have methods',
    option_d: 'Abstract classes cannot have variables',
    correct_answer: 'A',
  },
  {
    question_text: 'Why are Design Patterns used?',
    option_a: 'To make code slower',
    option_b: 'To solve common design problems with reusable solutions',
    option_c: 'To increase code complexity',
    option_d: 'To remove OOP features',
    correct_answer: 'B',
  },
  {
    question_text: 'What is Normalization in DBMS?',
    option_a: 'Converting data into binary',
    option_b: 'Reducing redundancy and improving data integrity',
    option_c: 'Creating more tables unnecessarily',
    option_d: 'Storing duplicate data intentionally',
    correct_answer: 'B',
  },
  {
    question_text: 'Transport Layer (Layer 4) handles:',
    option_a: 'IP addressing',
    option_b: 'Physical signaling',
    option_c: 'End-to-end communication and reliability',
    option_d: 'Web rendering',
    correct_answer: 'C',
  },
  {
    question_text: 'What does Git provide?',
    option_a: 'Centralized version control',
    option_b: 'Distributed version control',
    option_c: 'Only cloud storage',
    option_d: 'Only bug tracking',
    correct_answer: 'B',
    difficulty: 'easy',
  },
  {
    question_text: 'Why is Exception Handling used?',
    option_a: 'To terminate programs',
    option_b: 'To gracefully manage runtime errors',
    option_c: 'To make debugging harder',
    option_d: 'To slow execution',
    correct_answer: 'B',
  },
  {
    question_text: 'Synchronous execution means:',
    option_a: 'Tasks run one after another',
    option_b: 'All tasks run at the same time',
    option_c: 'Only background tasks run',
    option_d: 'No task can run',
    correct_answer: 'A',
    difficulty: 'easy',
  },
  {
    question_text: 'Middleware in backend is used for:',
    option_a: 'Styling pages',
    option_b: 'Handling requests before they reach routes (e.g., auth, logs)',
    option_c: 'Storing data in database',
    option_d: 'Editing UI components',
    correct_answer: 'B',
  },
  {
    question_text: 'Time Complexity helps developers to:',
    option_a: 'Make code longer',
    option_b: 'Measure algorithm performance and scalability',
    option_c: 'Avoid using loops',
    option_d: 'Convert code into machine language',
    correct_answer: 'B',
  },
];

/**
 * Randomly assign a question to one of 4 sets
 */
function getRandomSet(): number {
  return Math.floor(Math.random() * 4) + 1; // Returns 1, 2, 3, or 4
}

async function insertQuestions() {
  console.log('🚀 Starting question insertion...\n');

  // Verify event exists
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('id, name')
    .eq('id', EVENT_ID)
    .single();

  if (eventError || !event) {
    console.error('❌ Event not found:', EVENT_ID);
    console.error('Error:', eventError);
    Deno.exit(1);
  }

  console.log(`✅ Found event: ${event.name} (${EVENT_ID})\n`);

  // Prepare questions with random set assignment
  const questionsToInsert = questions.map((q) => ({
    event_id: EVENT_ID,
    question_text: q.question_text,
    option_a: q.option_a,
    option_b: q.option_b,
    option_c: q.option_c,
    option_d: q.option_d,
    correct_answer: q.correct_answer,
    marks: q.marks || 1,
    negative_marks: q.negative_marks || 0.15,
    difficulty: q.difficulty || 'medium',
    question_set: getRandomSet(),
  }));

  // Insert questions
  const { data: insertedQuestions, error: insertError } = await supabase
    .from('questions')
    .insert(questionsToInsert)
    .select('id, question_text, question_set');

  if (insertError) {
    console.error('❌ Failed to insert questions:', insertError);
    Deno.exit(1);
  }

  // Show summary
  console.log(`✅ Successfully inserted ${insertedQuestions.length} questions!\n`);
  
  // Group by set
  const setCounts: Record<number, number> = {};
  insertedQuestions.forEach((q) => {
    setCounts[q.question_set] = (setCounts[q.question_set] || 0) + 1;
  });

  console.log('📊 Distribution by set:');
  [1, 2, 3, 4].forEach((set) => {
    const count = setCounts[set] || 0;
    console.log(`   Set ${set}: ${count} questions`);
  });

  console.log('\n✨ Done!');
}

insertQuestions().catch((error) => {
  console.error('❌ Unexpected error:', error);
  Deno.exit(1);
});

