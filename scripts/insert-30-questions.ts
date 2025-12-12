// Script to insert 30 quiz questions from JSON format
// Run with: npx tsx scripts/insert-30-questions.ts

const questions = [
  {
    "question": "What is the main difference between a Compiler and an Interpreter?",
    "options": [
      "Compiler translates line-by-line; Interpreter translates whole code",
      "Interpreter translates line-by-line; Compiler translates whole code",
      "Both translate line-by-line",
      "Both translate whole code"
    ],
    "correct_option": 1,
    "category": "Programming Fundamentals",
    "difficulty": "easy"
  },
  {
    "question": "What is the purpose of Inheritance in OOP?",
    "options": [
      "To hide data",
      "To reuse existing code",
      "To increase code size",
      "To execute code faster"
    ],
    "correct_option": 1,
    "category": "OOP",
    "difficulty": "easy"
  },
  {
    "question": "What is a REST API?",
    "options": [
      "API used only for mobile apps",
      "API that works only with XML",
      "API that follows HTTP-based architectural principles",
      "API that runs only on cloud"
    ],
    "correct_option": 2,
    "category": "Web Development",
    "difficulty": "medium"
  },
  {
    "question": "Primary Key in a table must be:",
    "options": [
      "Always null",
      "Always unique and not null",
      "Only unique",
      "Only numeric"
    ],
    "correct_option": 1,
    "category": "DBMS",
    "difficulty": "easy"
  },
  {
    "question": "What is the main difference between GET and POST?",
    "options": [
      "GET sends data in body; POST sends data in URL",
      "GET is used for updates; POST for retrieval",
      "GET is idempotent; POST is not",
      "Both behave the same"
    ],
    "correct_option": 2,
    "category": "Web Development",
    "difficulty": "medium"
  },
  {
    "question": "SQL Injection is dangerous because:",
    "options": [
      "It slows the database",
      "It allows modifying or accessing unauthorized data",
      "It hides data",
      "It improves performance"
    ],
    "correct_option": 1,
    "category": "Cyber Security",
    "difficulty": "medium"
  },
  {
    "question": "In Java, Interface differs from Abstract Class because:",
    "options": [
      "Interfaces allow multiple inheritance",
      "Abstract classes are faster",
      "Interfaces cannot have methods",
      "Abstract classes cannot have variables"
    ],
    "correct_option": 0,
    "category": "Java",
    "difficulty": "medium"
  },
  {
    "question": "Why are Design Patterns used?",
    "options": [
      "To make code slower",
      "To solve common design problems with reusable solutions",
      "To increase code complexity",
      "To remove OOP features"
    ],
    "correct_option": 1,
    "category": "Software Engineering",
    "difficulty": "medium"
  },
  {
    "question": "What is Normalization in DBMS?",
    "options": [
      "Converting data into binary",
      "Reducing redundancy and improving data integrity",
      "Creating more tables unnecessarily",
      "Storing duplicate data intentionally"
    ],
    "correct_option": 1,
    "category": "DBMS",
    "difficulty": "easy"
  },
  {
    "question": "Transport Layer handles:",
    "options": [
      "IP addressing",
      "Physical signaling",
      "End-to-end communication and reliability",
      "Web rendering"
    ],
    "correct_option": 2,
    "category": "Networking",
    "difficulty": "medium"
  },
  {
    "question": "What does Git provide?",
    "options": [
      "Centralized version control",
      "Distributed version control",
      "Only cloud storage",
      "Only bug tracking"
    ],
    "correct_option": 1,
    "category": "Software Engineering",
    "difficulty": "easy"
  },
  {
    "question": "Why is Exception Handling used?",
    "options": [
      "To terminate programs",
      "To gracefully manage runtime errors",
      "To make debugging harder",
      "To slow execution"
    ],
    "correct_option": 1,
    "category": "Programming Fundamentals",
    "difficulty": "easy"
  },
  {
    "question": "Synchronous execution means:",
    "options": [
      "Tasks run one after another",
      "All tasks run at the same time",
      "Only background tasks run",
      "No task can run"
    ],
    "correct_option": 0,
    "category": "Programming Fundamentals",
    "difficulty": "easy"
  },
  {
    "question": "Middleware in backend is used for:",
    "options": [
      "Styling pages",
      "Handling requests before they reach routes (e.g., auth, logs)",
      "Storing data in database",
      "Editing UI components"
    ],
    "correct_option": 1,
    "category": "Backend Development",
    "difficulty": "medium"
  },
  {
    "question": "Time Complexity helps developers to:",
    "options": [
      "Make code longer",
      "Measure algorithm performance and scalability",
      "Avoid using loops",
      "Convert code into machine language"
    ],
    "correct_option": 1,
    "category": "DSA",
    "difficulty": "medium"
  },
  {
    "question": "Cloud Computing means:",
    "options": [
      "Storing data only on USB",
      "Delivering computing services over the internet",
      "Running code without electricity",
      "Only hosting websites"
    ],
    "correct_option": 1,
    "category": "Cloud",
    "difficulty": "easy"
  },
  {
    "question": "PaaS stands for:",
    "options": [
      "Programming as a System",
      "Platform as a Service",
      "Protocol as a Service",
      "Process as a System"
    ],
    "correct_option": 1,
    "category": "Cloud",
    "difficulty": "easy"
  },
  {
    "question": "Why is Docker widely used?",
    "options": [
      "It increases file size",
      "It allows apps to run consistently across environments",
      "It replaces Git",
      "It prevents deployment"
    ],
    "correct_option": 1,
    "category": "DevOps",
    "difficulty": "medium"
  },
  {
    "question": "API Gateway is used for:",
    "options": [
      "Storing passwords",
      "Routing and managing API requests across microservices",
      "Running SQL queries",
      "Designing UI"
    ],
    "correct_option": 1,
    "category": "Backend Architecture",
    "difficulty": "medium"
  },
  {
    "question": "The main benefit of Indexing in a database is:",
    "options": [
      "More storage consumption",
      "Faster data retrieval",
      "Slower execution",
      "Data duplication"
    ],
    "correct_option": 1,
    "category": "DBMS",
    "difficulty": "easy"
  },
  {
    "question": "CI/CD ensures:",
    "options": [
      "Manual deployment only",
      "Automated building, testing, and deployment",
      "Removing test cases",
      "Only code formatting"
    ],
    "correct_option": 1,
    "category": "DevOps",
    "difficulty": "medium"
  },
  {
    "question": "Machine Learning is:",
    "options": [
      "Writing code without logic",
      "System learning from data automatically",
      "A type of SQL query",
      "A mobile framework"
    ],
    "correct_option": 1,
    "category": "AI/ML",
    "difficulty": "medium"
  },
  {
    "question": "Big O Notation measures:",
    "options": [
      "App size",
      "Algorithm efficiency",
      "Code indentation",
      "Comments count"
    ],
    "correct_option": 1,
    "category": "DSA",
    "difficulty": "medium"
  },
  {
    "question": "Static website means:",
    "options": [
      "Content changes on every request",
      "Content is fixed and served as pre-built pages",
      "Website uses only SQL",
      "Website runs only offline"
    ],
    "correct_option": 1,
    "category": "Web Development",
    "difficulty": "easy"
  },
  {
    "question": "XSS attack allows:",
    "options": [
      "Injecting malicious scripts into webpages",
      "Reducing server load",
      "Running CSS faster",
      "Fixing HTML errors"
    ],
    "correct_option": 0,
    "category": "Cyber Security",
    "difficulty": "medium"
  },
  {
    "question": "CDN improves performance by:",
    "options": [
      "Blocking users",
      "Serving content from servers closer to the user",
      "Deleting cache frequently",
      "Increasing image size"
    ],
    "correct_option": 1,
    "category": "Web Performance",
    "difficulty": "easy"
  },
  {
    "question": "Authentication vs Authorization:",
    "options": [
      "Authentication = Who you are; Authorization = What you can access",
      "Both are same",
      "Authentication = Permissions; Authorization = Identity",
      "Authorization happens before authentication"
    ],
    "correct_option": 0,
    "category": "Cyber Security",
    "difficulty": "easy"
  },
  {
    "question": "JSON is preferred because:",
    "options": [
      "It is unreadable",
      "It is lightweight and easy to parse",
      "Only works with Java",
      "It is slower than XML"
    ],
    "correct_option": 1,
    "category": "Web Development",
    "difficulty": "easy"
  },
  {
    "question": "Load Balancing helps by:",
    "options": [
      "Sending all requests to one server",
      "Distributing traffic across multiple servers",
      "Slowing down responses",
      "Increasing server crashes"
    ],
    "correct_option": 1,
    "category": "System Design",
    "difficulty": "medium"
  },
  {
    "question": "Which is a major tech trend in 2024–2025?",
    "options": [
      "CRT Monitors",
      "Web5 browsers",
      "AI-powered tools & Cloud-native development",
      "Floppy disk systems"
    ],
    "correct_option": 2,
    "category": "Technology Trends",
    "difficulty": "easy"
  }
]

// Convert to database format
function convertToDBFormat(question: typeof questions[0], eventId: string) {
  const correctAnswerMap = ['A', 'B', 'C', 'D']
  const correctAnswer = correctAnswerMap[question.correct_option]
  
  return {
    event_id: eventId,
    question_text: question.question,
    option_a: question.options[0],
    option_b: question.options[1],
    option_c: question.options[2],
    option_d: question.options[3],
    correct_answer: correctAnswer,
    marks: 1,
    negative_marks: 0.25,
    difficulty: question.difficulty,
    question_set: Math.floor(Math.random() * 4) + 1, // Random set 1-4
  }
}

// This will be used to generate SQL
const EVENT_ID = '3265c65f-3bcd-4e71-94b3-a6493e2715bb'

console.log('-- Inserting 30 quiz questions')
console.log('-- Event ID:', EVENT_ID)
console.log('')

questions.forEach((q, index) => {
  const dbFormat = convertToDBFormat(q, EVENT_ID)
  console.log(`-- Question ${index + 1}: ${q.category}`)
  console.log(`INSERT INTO questions (event_id, question_text, option_a, option_b, option_c, option_d, correct_answer, marks, negative_marks, difficulty, question_set)`)
  console.log(`VALUES (`)
  console.log(`  '${dbFormat.event_id}',`)
  console.log(`  '${dbFormat.question_text.replace(/'/g, "''")}',`)
  console.log(`  '${dbFormat.option_a.replace(/'/g, "''")}',`)
  console.log(`  '${dbFormat.option_b.replace(/'/g, "''")}',`)
  console.log(`  '${dbFormat.option_c.replace(/'/g, "''")}',`)
  console.log(`  '${dbFormat.option_d.replace(/'/g, "''")}',`)
  console.log(`  '${dbFormat.correct_answer}',`)
  console.log(`  ${dbFormat.marks},`)
  console.log(`  ${dbFormat.negative_marks},`)
  console.log(`  '${dbFormat.difficulty}',`)
  console.log(`  ${dbFormat.question_set}`)
  console.log(`);`)
  console.log('')
})

