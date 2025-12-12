-- Migration: Replace all questions with new question set
-- This script deletes all existing questions and inserts 30 new questions

-- Step 1: Delete all existing questions
DELETE FROM questions;

-- Step 2: Insert 30 new questions
-- Event ID: 3265c65f-3bcd-4e71-94b3-a6493e2715bb
-- Questions distributed across sets 1-4 (8, 8, 7, 7)

INSERT INTO questions (event_id, question_text, option_a, option_b, option_c, option_d, correct_answer, marks, negative_marks, difficulty, question_set) VALUES
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'HTML is used for:', 'Running backend code', 'Creating webpage structure', 'Hosting servers', 'Storing images', 'B', 1, 0.15, 'easy', 1),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'Which symbol is used for comments in C language?', '#', '//', '/* */', 'Both B and C', 'D', 1, 0.15, 'easy', 1),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'Which one is a relational database?', 'MongoDB', 'Firebase', 'MySQL', 'Neo4j', 'C', 1, 0.15, 'easy', 1),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'CSS is mainly used for:', 'Styling web pages', 'Running SQL', 'Debugging code', 'Creating tables', 'A', 1, 0.15, 'easy', 1),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'Which data type in C is used to store a single character?', 'int', 'char', 'float', 'string', 'B', 1, 0.15, 'easy', 1),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'Which HTTP method is used to fetch data from a server?', 'GET', 'POST', 'PUT', 'DELETE', 'A', 1, 0.15, 'easy', 1),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'What is the main purpose of Git?', 'Deployment', 'Version control', 'Debugging', 'Designing UI', 'B', 1, 0.15, 'easy', 1),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'Which language is used for Android development?', 'Kotlin', 'Swift', 'Ruby', 'PHP', 'A', 1, 0.15, 'easy', 2),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'What does API stand for?', 'Automatic Process Integration', 'Application Programming Interface', 'Active Program Instruction', 'Applied Programming Index', 'B', 1, 0.15, 'easy', 2),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'What is SQL used for?', 'Editing images', 'Styling pages', 'Managing databases', 'Designing UI', 'C', 1, 0.15, 'easy', 2),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'In C, what is the index of the first element in an array?', '-1', '0', '1', 'Depends on compiler', 'B', 1, 0.15, 'medium', 2),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'Which operator is used for equality comparison in C?', '=', '==', '===', ':=', 'B', 1, 0.15, 'medium', 2),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'Which of the following is NOT an operating system?', 'Windows', 'Linux', 'Android', 'HTML', 'D', 1, 0.15, 'medium', 2),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'What does URL stand for?', 'Unified Routing Locator', 'Uniform Resource Locator', 'Universal Resource Link', 'User Request Link', 'B', 1, 0.15, 'medium', 2),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'Which loop always runs at least once in C?', 'for', 'while', 'do-while', 'foreach', 'C', 1, 0.15, 'medium', 2),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'Machine Learning is:', 'Writing SQL queries', 'Machines learning patterns from data', 'Creating HTML pages', 'Running loops', 'B', 1, 0.15, 'medium', 3),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'Cloud Computing allows you to:', 'Store data only offline', 'Access computing resources through the internet', 'Avoid using RAM', 'Remove backend servers', 'B', 1, 0.15, 'medium', 3),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'Which of these is a NoSQL database?', 'MySQL', 'PostgreSQL', 'MongoDB', 'Oracle', 'C', 1, 0.15, 'medium', 3),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'Which protocol is secure for browsing?', 'HTTP', 'HTTPS', 'FTP', 'SMTP', 'B', 1, 0.15, 'medium', 3),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'What does RAM stand for?', 'Random Apply Memory', 'Random Access Memory', 'Read-Only Memory', 'Rapid Access Mode', 'B', 1, 0.15, 'medium', 3),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'In C, which symbol is used to access a pointer value?', '&', '*', '%', '#', 'B', 1, 0.15, 'medium', 3),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'What is recursion?', 'A function calling itself', 'A loop that never stops', 'A type of compiler', 'A debugging tool', 'A', 1, 0.15, 'medium', 3),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'What does DNS do?', 'Converts domain names to IP addresses', 'Stores cookies', 'Hosts emails', 'Runs SQL', 'A', 1, 0.15, 'medium', 4),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'Which one is a frontend framework?', 'React', 'Laravel', 'Django', 'Flask', 'A', 1, 0.15, 'medium', 4),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'Which header file is required for printf() in C?', 'stdarg.h', 'stdio.h', 'string.h', 'ctype.h', 'B', 1, 0.15, 'medium', 4),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'Which database technique helps scale data across multiple servers?', 'Normalization', 'Sharding', 'Sorting', 'Merging', 'B', 1, 0.15, 'hard', 4),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'Which component improves performance by storing frequently accessed data?', 'Firewall', 'Cache (like Redis)', 'Reverse Proxy', 'CDN', 'B', 1, 0.15, 'hard', 4),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'Why are microservices beneficial?', 'Services can run independently and be deployed separately', 'They always run faster', 'They remove testing', 'They use only one database', 'A', 1, 0.15, 'hard', 4),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'Kubernetes is mainly used for:', 'Debugging Java code', 'Managing containerized applications', 'Designing UI', 'Running SQL databases', 'B', 1, 0.15, 'hard', 4),
('3265c65f-3bcd-4e71-94b3-a6493e2715bb', 'Why are Transformer models important in modern AI?', 'They work only for images', 'They use attention to understand long text sequences', 'They require no training', 'They replace cloud storage', 'B', 1, 0.15, 'hard', 4);
