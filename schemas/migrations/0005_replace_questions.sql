-- Migration: Replace all questions with new question set
-- This script deletes all existing questions and inserts 30 new questions

-- Step 1: Delete all existing questions
DELETE FROM questions;

-- Step 2: Insert 30 new questions
-- Event ID: 3265c65f-3bcd-4e71-94b3-a6493e2715bb
-- Questions distributed across sets 1-4 (8, 8, 7, 7)

INSERT INTO questions (event_id, question_text, option_a, option_b, option_c, option_d, correct_answer, marks, negative_marks, difficulty, question_set) VALUES
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'What is the main difference between a Compiler and an Interpreter?', 'Compiler translates line-by-line; Interpreter translates whole code', 'Interpreter translates line-by-line; Compiler translates whole code', 'Both translate line-by-line', 'Both translate whole code', 'B', 1, 0.15, 'medium', 1),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'What is the purpose of Inheritance in OOP?', 'To hide data', 'To reuse existing code', 'To increase code size', 'To execute code faster', 'B', 1, 0.15, 'medium', 1),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'What is a REST API?', 'API used only for mobile apps', 'API that works only with XML', 'API that follows HTTP-based architectural principles', 'API that runs only on cloud', 'C', 1, 0.15, 'medium', 1),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'Primary Key in a table must be:', 'Always null', 'Always unique and not null', 'Only unique', 'Only numeric', 'B', 1, 0.15, 'medium', 1),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'Difference between GET and POST?', 'GET sends data in body; POST sends data in URL', 'GET is used for updates; POST for retrieval', 'GET is idempotent; POST is not', 'Both behave the same', 'C', 1, 0.15, 'medium', 1),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'CI/CD ensures:', 'Manual deployment only', 'Automated building, testing, and deployment', 'Removing test cases', 'Only code formatting', 'B', 1, 0.15, 'medium', 1),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'Machine Learning is:', 'Writing code without logic', 'System learning from data automatically', 'A type of SQL query', 'A mobile framework', 'B', 1, 0.15, 'medium', 1),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'Which algorithm is used for searching in a sorted array?', 'Linear Search', 'Binary Search', 'DFS', 'BFS', 'B', 1, 0.15, 'medium', 1),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'Which cloud service is used for hosting applications without managing servers?', 'IaaS', 'PaaS', 'SaaS', 'TaaS', 'B', 1, 0.15, 'medium', 1),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'SQL Injection is dangerous because:', 'It slows the database', 'It allows modifying or accessing unauthorized data', 'It hides data', 'It improves performance', 'B', 1, 0.15, 'medium', 2),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'In Java, Interface differs from Abstract Class because:', 'Interfaces allow multiple inheritance', 'Abstract classes are faster', 'Interfaces cannot have methods', 'Abstract classes cannot have variables', 'A', 1, 0.15, 'medium', 2),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'Why are Design Patterns used?', 'To make code slower', 'To solve common design problems with reusable solutions', 'To increase code complexity', 'To remove OOP features', 'B', 1, 0.15, 'medium', 2),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'What is Normalization in DBMS?', 'Converting data into binary', 'Reducing redundancy and improving data integrity', 'Creating more tables unnecessarily', 'Storing duplicate data intentionally', 'B', 1, 0.15, 'medium', 2),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'Transport Layer (Layer 4) handles:', 'IP addressing', 'Physical signaling', 'End-to-end communication and reliability', 'Web rendering', 'C', 1, 0.15, 'medium', 2),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'Big O Notation measures:', 'App size', 'Algorithm efficiency', 'Code indentation', 'Comments count', 'B', 1, 0.15, 'medium', 2),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'Static website means:', 'Content changes on every request', 'Content is fixed and served as pre-built pages', 'Website uses only SQL', 'Website runs only offline', 'B', 1, 0.15, 'medium', 2),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'What does Git provide?', 'Centralized version control', 'Distributed version control', 'Only cloud storage', 'Only bug tracking', 'B', 1, 0.15, 'medium', 3),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'Why is Exception Handling used?', 'To terminate programs', 'To gracefully manage runtime errors', 'To make debugging harder', 'To slow execution', 'B', 1, 0.15, 'medium', 3),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'Synchronous execution means:', 'Tasks run one after another', 'All tasks run at the same time', 'Only background tasks run', 'No task can run', 'A', 1, 0.15, 'medium', 3),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'Middleware in backend is used for:', 'Styling pages', 'Handling requests before they reach routes (e.g., auth, logs)', 'Storing data in database', 'Editing UI components', 'B', 1, 0.15, 'medium', 3),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'Time Complexity helps developers to:', 'Make code longer', 'Measure algorithm performance and scalability', 'Avoid using loops', 'Convert code into machine language', 'B', 1, 0.15, 'medium', 3),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'XSS attack allows:', 'Injecting malicious scripts into webpages', 'Reducing server load', 'Running CSS faster', 'Fixing HTML errors', 'A', 1, 0.15, 'medium', 3),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'Which of the following prevents SQL Injection?', 'Using plain queries', 'UI validation', 'Parameterized queries', 'Comments in SQL', 'C', 1, 0.15, 'medium', 3),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'Cloud Computing means:', 'Storing data only on USB', 'Delivering computing services over the internet', 'Running code without electricity', 'Only hosting websites', 'B', 1, 0.15, 'medium', 4),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'PaaS stands for:', 'Programming as a System', 'Platform as a Service', 'Protocol as a Service', 'Process as a System', 'B', 1, 0.15, 'medium', 4),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'Why is Docker widely used?', 'It increases file size', 'It allows apps to run consistently across environments', 'It replaces Git', 'It prevents deployment', 'B', 1, 0.15, 'medium', 4),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'API Gateway is used for:', 'Storing passwords', 'Routing and managing API requests across microservices', 'Running SQL queries', 'Designing UI', 'B', 1, 0.15, 'medium', 4),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'The main benefit of Indexing in a database is:', 'More storage consumption', 'Faster data retrieval', 'Slower execution', 'Data duplication', 'B', 1, 0.15, 'medium', 4),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'What does Kubernetes primarily manage?', 'Programming languages', 'Databases only', 'Container orchestration', 'Frontend components', 'C', 1, 0.15, 'medium', 4),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'What is WebAssembly used for?', 'Faster front-end styling', 'Running high-performance code in browser', 'Hosting APIs', 'Writing SQL', 'B', 1, 0.15, 'medium', 4);
