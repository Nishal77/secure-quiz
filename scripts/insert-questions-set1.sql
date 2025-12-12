-- Script to insert Set 1 questions (15 questions)
-- Questions will be randomly assigned to sets 1-4
-- 
-- Usage:
-- 1. Replace 'YOUR_EVENT_ID_HERE' with your actual event UUID
-- 2. Run this script in Supabase SQL Editor
-- 3. Questions will be randomly distributed across sets 1-4

-- IMPORTANT: Replace this with your actual event_id
-- You can find your event_id from the events table or admin panel
DO $$
DECLARE
    v_event_id UUID := 'YOUR_EVENT_ID_HERE'; -- REPLACE THIS!
    v_question_set INTEGER;
    v_question_id UUID;
BEGIN
    -- Check if event exists
    IF NOT EXISTS (SELECT 1 FROM events WHERE id = v_event_id) THEN
        RAISE EXCEPTION 'Event with id % does not exist. Please replace YOUR_EVENT_ID_HERE with a valid event UUID.', v_event_id;
    END IF;

    -- Question 1: Compiler vs Interpreter
    v_question_set := 1 + floor(random() * 4)::INTEGER; -- Random set 1-4
    INSERT INTO questions (event_id, question_text, option_a, option_b, option_c, option_d, correct_answer, marks, negative_marks, difficulty, question_set)
    VALUES (
        v_event_id,
        'What is the main difference between a Compiler and an Interpreter?',
        'Compiler translates line-by-line; Interpreter translates whole code',
        'Interpreter translates line-by-line; Compiler translates whole code',
        'Both translate line-by-line',
        'Both translate whole code',
        'B',
        1,
        0.25,
        'medium',
        v_question_set
    );

    -- Question 2: Inheritance in OOP
    v_question_set := 1 + floor(random() * 4)::INTEGER;
    INSERT INTO questions (event_id, question_text, option_a, option_b, option_c, option_d, correct_answer, marks, negative_marks, difficulty, question_set)
    VALUES (
        v_event_id,
        'What is the purpose of Inheritance in OOP?',
        'To hide data',
        'To reuse existing code',
        'To increase code size',
        'To execute code faster',
        'B',
        1,
        0.25,
        'medium',
        v_question_set
    );

    -- Question 3: REST API
    v_question_set := 1 + floor(random() * 4)::INTEGER;
    INSERT INTO questions (event_id, question_text, option_a, option_b, option_c, option_d, correct_answer, marks, negative_marks, difficulty, question_set)
    VALUES (
        v_event_id,
        'What is a REST API?',
        'API used only for mobile apps',
        'API that works only with XML',
        'API that follows HTTP-based architectural principles',
        'API that runs only on cloud',
        'C',
        1,
        0.25,
        'medium',
        v_question_set
    );

    -- Question 4: Primary Key
    v_question_set := 1 + floor(random() * 4)::INTEGER;
    INSERT INTO questions (event_id, question_text, option_a, option_b, option_c, option_d, correct_answer, marks, negative_marks, difficulty, question_set)
    VALUES (
        v_event_id,
        'Primary Key in a table must be:',
        'Always null',
        'Always unique and not null',
        'Only unique',
        'Only numeric',
        'B',
        1,
        0.25,
        'easy',
        v_question_set
    );

    -- Question 5: GET vs POST
    v_question_set := 1 + floor(random() * 4)::INTEGER;
    INSERT INTO questions (event_id, question_text, option_a, option_b, option_c, option_d, correct_answer, marks, negative_marks, difficulty, question_set)
    VALUES (
        v_event_id,
        'Difference between GET and POST?',
        'GET sends data in body; POST sends data in URL',
        'GET is used for updates; POST for retrieval',
        'GET is idempotent; POST is not',
        'Both behave the same',
        'C',
        1,
        0.25,
        'medium',
        v_question_set
    );

    -- Question 6: SQL Injection
    v_question_set := 1 + floor(random() * 4)::INTEGER;
    INSERT INTO questions (event_id, question_text, option_a, option_b, option_c, option_d, correct_answer, marks, negative_marks, difficulty, question_set)
    VALUES (
        v_event_id,
        'SQL Injection is dangerous because:',
        'It slows the database',
        'It allows modifying or accessing unauthorized data',
        'It hides data',
        'It improves performance',
        'B',
        1,
        0.25,
        'medium',
        v_question_set
    );

    -- Question 7: Interface vs Abstract Class
    v_question_set := 1 + floor(random() * 4)::INTEGER;
    INSERT INTO questions (event_id, question_text, option_a, option_b, option_c, option_d, correct_answer, marks, negative_marks, difficulty, question_set)
    VALUES (
        v_event_id,
        'In Java, Interface differs from Abstract Class because:',
        'Interfaces allow multiple inheritance',
        'Abstract classes are faster',
        'Interfaces cannot have methods',
        'Abstract classes cannot have variables',
        'A',
        1,
        0.25,
        'medium',
        v_question_set
    );

    -- Question 8: Design Patterns
    v_question_set := 1 + floor(random() * 4)::INTEGER;
    INSERT INTO questions (event_id, question_text, option_a, option_b, option_c, option_d, correct_answer, marks, negative_marks, difficulty, question_set)
    VALUES (
        v_event_id,
        'Why are Design Patterns used?',
        'To make code slower',
        'To solve common design problems with reusable solutions',
        'To increase code complexity',
        'To remove OOP features',
        'B',
        1,
        0.25,
        'medium',
        v_question_set
    );

    -- Question 9: Normalization
    v_question_set := 1 + floor(random() * 4)::INTEGER;
    INSERT INTO questions (event_id, question_text, option_a, option_b, option_c, option_d, correct_answer, marks, negative_marks, difficulty, question_set)
    VALUES (
        v_event_id,
        'What is Normalization in DBMS?',
        'Converting data into binary',
        'Reducing redundancy and improving data integrity',
        'Creating more tables unnecessarily',
        'Storing duplicate data intentionally',
        'B',
        1,
        0.25,
        'medium',
        v_question_set
    );

    -- Question 10: Transport Layer
    v_question_set := 1 + floor(random() * 4)::INTEGER;
    INSERT INTO questions (event_id, question_text, option_a, option_b, option_c, option_d, correct_answer, marks, negative_marks, difficulty, question_set)
    VALUES (
        v_event_id,
        'Transport Layer (Layer 4) handles:',
        'IP addressing',
        'Physical signaling',
        'End-to-end communication and reliability',
        'Web rendering',
        'C',
        1,
        0.25,
        'medium',
        v_question_set
    );

    -- Question 11: Git
    v_question_set := 1 + floor(random() * 4)::INTEGER;
    INSERT INTO questions (event_id, question_text, option_a, option_b, option_c, option_d, correct_answer, marks, negative_marks, difficulty, question_set)
    VALUES (
        v_event_id,
        'What does Git provide?',
        'Centralized version control',
        'Distributed version control',
        'Only cloud storage',
        'Only bug tracking',
        'B',
        1,
        0.25,
        'easy',
        v_question_set
    );

    -- Question 12: Exception Handling
    v_question_set := 1 + floor(random() * 4)::INTEGER;
    INSERT INTO questions (event_id, question_text, option_a, option_b, option_c, option_d, correct_answer, marks, negative_marks, difficulty, question_set)
    VALUES (
        v_event_id,
        'Why is Exception Handling used?',
        'To terminate programs',
        'To gracefully manage runtime errors',
        'To make debugging harder',
        'To slow execution',
        'B',
        1,
        0.25,
        'medium',
        v_question_set
    );

    -- Question 13: Synchronous execution
    v_question_set := 1 + floor(random() * 4)::INTEGER;
    INSERT INTO questions (event_id, question_text, option_a, option_b, option_c, option_d, correct_answer, marks, negative_marks, difficulty, question_set)
    VALUES (
        v_event_id,
        'Synchronous execution means:',
        'Tasks run one after another',
        'All tasks run at the same time',
        'Only background tasks run',
        'No task can run',
        'A',
        1,
        0.25,
        'easy',
        v_question_set
    );

    -- Question 14: Middleware
    v_question_set := 1 + floor(random() * 4)::INTEGER;
    INSERT INTO questions (event_id, question_text, option_a, option_b, option_c, option_d, correct_answer, marks, negative_marks, difficulty, question_set)
    VALUES (
        v_event_id,
        'Middleware in backend is used for:',
        'Styling pages',
        'Handling requests before they reach routes (e.g., auth, logs)',
        'Storing data in database',
        'Editing UI components',
        'B',
        1,
        0.25,
        'medium',
        v_question_set
    );

    -- Question 15: Time Complexity
    v_question_set := 1 + floor(random() * 4)::INTEGER;
    INSERT INTO questions (event_id, question_text, option_a, option_b, option_c, option_d, correct_answer, marks, negative_marks, difficulty, question_set)
    VALUES (
        v_event_id,
        'Time Complexity helps developers to:',
        'Make code longer',
        'Measure algorithm performance and scalability',
        'Avoid using loops',
        'Convert code into machine language',
        'B',
        1,
        0.25,
        'medium',
        v_question_set
    );

    RAISE NOTICE 'Successfully inserted 15 questions for event %. Questions were randomly assigned to sets 1-4.', v_event_id;
END $$;

