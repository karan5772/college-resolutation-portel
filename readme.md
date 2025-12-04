<div align="center">

  <img src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/100/external-university-university-flaticons-lineal-color-flat-icons-2.png" alt="logo" width="100" height="100" />

# College Grievance Resolution Portal

  <p>
    A comprehensive full-stack solution for bridging the communication gap between students and faculty.
  </p>

  <!-- Badges -->
  <p>
    <a href="https://reactjs.org/">
      <img src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    </a>
    <a href="https://tailwindcss.com/">
      <img src="https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
    </a>
    <a href="https://nodejs.org/">
      <img src="https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node" />
    </a>
    <a href="https://www.mongodb.com/">
      <img src="https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    </a>
  </p>

  <p>
    <a href="#-features">Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-api-reference">API Reference</a>
  </p>
</div>

<br />

## 📖 About The Project

The **College Resolution Portal** is a digital platform designed to streamline the grievance redressal process within educational institutions. It provides a transparent and efficient channel for students to raise concerns and for professors/administrators to address them promptly.

### 🎯 Key Features

| Role             | Capabilities                                                                                                                                                     |
| :--------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **👨‍🎓 Student**   | • Secure Login/Signup <br> • Post new grievances/problems <br> • Track status of submitted issues <br> • View history of resolutions                             |
| **👨‍🏫 Professor** | • Dashboard overview of pending issues <br> • Filter problems by category or status <br> • Respond to and resolve student grievances <br> • Search functionality |
| **🔐 Security**  | • JWT Authentication <br> • Role-Based Access Control (RBAC) <br> • Secure Password Hashing                                                                      |

---

## 🛠 Tech Stack

### **Frontend**

- **Framework:** React (Vite)
- **State Management:** Zustand
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Routing:** React Router DOM

### **Backend**

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JSON Web Tokens (JWT) & Cookies

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js (v20+)
- MongoDB (Local or Atlas URL)

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/karan5772/college-resolution-portal.git
cd college-resolution-portal
\`\`\`

### 2. Backend Setup

Navigate to the backend folder and install dependencies.

\`\`\`bash
cd backend
npm install
\`\`\`

Create a \`.env\` file in the \`backend\` directory:
\`\`\`env
PORT=
MONGO_URI=
JWT_SECRET=
NODE_ENV=development
\`\`\`

Start the server:
\`\`\`bash
npm start

\`\`\`

### 3. Frontend Setup

Open a new terminal, navigate to the frontend folder, and install dependencies.

\`\`\`bash
cd frontend
npm install
\`\`\`

Create a \`.env\` file in the \`frontend\` directory:
\`\`\`env
VITE_API_URL=
\`\`\`

Start the development server:
\`\`\`bash
npm run dev

\`\`\`

---

## 🔌 API Reference

### Authentication

- \`POST /api/v1/auth/login\` - Login user
- \`POST /api/v1/auth/register\` - Register new user
- \`POST /api/v1/auth/logout\` - Logout user

### Student Routes

- \`POST /api/v1/student/create\` - Create a new problem
- \`GET /api/v1/student/my-problems\` - Get logged-in student's problems

### Professor Routes

- \`GET /api/v1/professor/all-problems\` - Fetch all grievances
- \`GET /api/v1/professor/problem/:id\` - Get specific problem details
- \`PUT /api/v1/professor/respond/:id\` - Respond to/Resolve a problem

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the Project
2.  Create your Feature Branch (\`git checkout -b feature/AmazingFeature\`)
3.  Commit your Changes (\`git commit -m 'Add some AmazingFeature'\`)
4.  Push to the Branch (\`git push origin feature/AmazingFeature\`)
5.  Open a Pull Request

---

<div align="center">
  <p>Made with ❤️ by Karan Choudhary</p>
</div>
