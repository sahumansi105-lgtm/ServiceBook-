# ServiceBook

**ServiceBook** is a modern React-based platform that combines two useful services in one application:

- 🛠️ **Home Service Booking** for customers
- 💼 **Job Opportunities** for job seekers

Customers can browse home services and book professionals according to their preferred date and time. Job seekers can browse available jobs, search for opportunities, submit applications with resumes, and track their application status.

This repository contains the **React frontend** of the ServiceBook application.

---

## 🌟 Project Overview

ServiceBook provides a simple and user-friendly interface for people who either need a home service or are looking for work.

### For Customers

Customers can:

- Create a customer account
- Log in to their account
- Browse available home services
- Select a service
- Choose a date and time slot
- Enter their address and phone number
- Add additional booking notes
- Confirm a service booking
- View and track their bookings
- See booking statistics from their dashboard

### For Job Seekers

Job seekers can:

- Create a Job Seeker account
- Log in to their account
- Browse available jobs
- Search jobs by keyword
- Search jobs by location
- View complete job details
- Apply for jobs
- Enter education, skills and experience
- Upload a resume
- Track submitted applications
- View application status
- Open their uploaded resume

The current frontend implements these flows through dedicated React pages and role-aware navigation.

---

## ✨ Features

### 🏠 Home Service Booking

Available services currently shown in the application include:

| Service | Starting Price |
|---|---:|
| 🪚 Carpenter | ₹499 |
| ⚡ Electrician | ₹399 |
| 🔧 Plumber | ₹399 |
| ❄️ AC Repair | ₹599 |
| 🧹 Cleaning | ₹499 |
| 🎨 Painting | ₹999 |

Each service contains a description and a **Book Now** option.

### 📅 Booking System

Customers can select:

- Service
- Date
- Time slot
- Complete address
- Phone number
- Additional notes

The available time slots currently include:

- 09:00 AM – 11:00 AM
- 11:00 AM – 01:00 PM
- 02:00 PM – 04:00 PM
- 04:00 PM – 06:00 PM
- 06:00 PM – 08:00 PM

The booking form validates required fields and accepts a 10-digit phone number.

### 💼 Job Portal

The Jobs page loads job data from the Spring Boot backend and provides:

- Job listing
- Job title/skill/work-type search
- Location search
- Job details
- Job application navigation
- My Applications section

The frontend calls the backend job APIs for retrieving and searching jobs.

### 📄 Job Application

Job seekers can submit:

- Full name
- Email
- Phone number
- Experience
- Skills
- Education
- Cover letter
- Resume

Resume validation currently supports:

- PDF
- DOC
- DOCX
- Maximum size: 5 MB

The application is submitted using `multipart/form-data`.

### 📊 Job Seeker Dashboard

The Job Seeker dashboard displays application-related information and loads the user's applications from the backend. Application statuses are handled as:

- APPLIED
- SHORTLISTED
- INTERVIEW
- SELECTED
- REJECTED

The dashboard also counts applications by status.

### 📋 My Bookings

Customers can view their previous service bookings and see statistics such as:

- Total bookings
- Pending bookings
- Confirmed bookings
- Completed bookings

Bookings are displayed with the latest booking first.

### 🔐 Role-Based User Flow

The frontend supports different account types:

```text
CUSTOMER
   ↓
User Dashboard
   ↓
Services
   ↓
Book Service
   ↓
My Bookings
```

```text
JOB_SEEKER
   ↓
Job Dashboard
   ↓
Jobs
   ↓
Job Details
   ↓
Apply for Job
   ↓
My Applications
```

The login and registration pages allow users to select either **Customer** or **Job Seeker**, and navigation changes according to the stored role.

---

## 🛠️ Technology Stack

### Frontend

- React 19
- JavaScript
- HTML5
- CSS3
- React Router
- React Toastify
- Vite

### Development Tools

- VS Code
- npm
- Git
- GitHub
- Oxlint

The current `package.json` defines React 19, React Router, React Toastify, Vite and Oxlint as the main frontend dependencies/tools.

### Backend Integration

The frontend communicates with:

- Spring Boot
- Java
- MySQL

through REST APIs.

---

## 🏗️ Application Architecture

```text
                    ServiceBook Frontend
                           |
                           |
                    React + Vite
                           |
             +-------------+-------------+
             |                           |
             v                           v
      Customer Flow               Job Seeker Flow
             |                           |
             v                           v
        Services                     Jobs
             |                           |
             v                           v
       Book Service                Job Details
             |                           |
             v                           v
       My Bookings                 Apply Job
                                         |
                                         v
                                 My Applications
             \                           /
              \                         /
               +----------+------------+
                          |
                          v
                 Spring Boot Backend
                          |
                          v
                        MySQL
```

---

## 📁 Project Structure

```text
ServiceBook-/
│
├── public/
│
├── src/
│   │
│   ├── components/
│   │   ├── Header.jsx
│   │   └── Footer.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Service.jsx
│   │   ├── BookService.jsx
│   │   ├── UserDashboard.jsx
│   │   ├── MyBooking.jsx
│   │   ├── Jobs.jsx
│   │   ├── JobDetails.jsx
│   │   ├── ApplyJobs.jsx
│   │   ├── MyApplications.jsx
│   │   ├── JobDashboard.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   │
│   ├── CSS/
│   │   ├── Home.css
│   │   ├── Service.css
│   │   ├── BookService.css
│   │   ├── UserDashboard.css
│   │   ├── MyBooking.css
│   │   ├── Jobs.css
│   │   ├── JobDetails.css
│   │   ├── ApplyJob.css
│   │   ├── MyApplications.css
│   │   ├── JobDashboard.css
│   │   ├── Login.css
│   │   ├── Register.css
│   │   └── ...
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── package.json
├── package-lock.json
├── vite.config.js
├── eslint.config.js
└── README.md
```

The current React router registers the main application pages including Home, Services, Booking, Dashboards, Jobs, Job Details, Job Application, Login and Registration.

---

## 🧭 Application Routes

| Route | Page | Purpose |
|---|---|---|
| `/` | Home | Landing page |
| `/login` | Login | User authentication |
| `/register` | Register | Account creation |
| `/services` | Services | Browse home services |
| `/book-service` | Book Service | Create service booking |
| `/user/dashboard` | User Dashboard | Customer dashboard |
| `/my-bookings` | My Bookings | Customer booking history |
| `/jobs` | Jobs | Browse and search jobs |
| `/job-details/:id` | Job Details | View a selected job |
| `/apply-job` | Apply Job | Submit a job application |
| `/my-applications` | My Applications | Track applications |
| `/job-dashboard` | Job Dashboard | Job seeker dashboard |

These routes are defined in the current `App.jsx`.

---

## 🔑 Authentication and Role Handling

The frontend stores the logged-in user information in browser `localStorage`.

The stored user contains information such as:

```text
userId
fullName
email
phoneNumber
role
```

The application checks the user's role and changes navigation accordingly.

### Customer

```text
CUSTOMER / USER
      ↓
User Dashboard
```

### Job Seeker

```text
JOB_SEEKER
      ↓
Job Dashboard
```

The header listens for an `authChanged` browser event so that login/logout changes can immediately update navigation.

> **Note:** The current frontend uses `localStorage` for client-side session/role handling. This should not be considered a secure replacement for backend authorization.

---

## ✅ Form Validation

The application contains frontend validation for major forms.

### Registration Validation

Registration checks:

- Full name is required
- Minimum name length
- Alphabetic name validation
- Valid email format
- 10-digit Indian mobile number
- Account type selection
- Minimum 6-character password
- Confirm password matching

Validation errors are displayed beside the relevant fields, with alerts for invalid submissions.

### Login Validation

Login validates:

- Account type
- Email
- Password
- Minimum password length


### Job Application Validation

The job application form validates:

- Name
- Email
- Phone number
- Experience
- Skills
- Education
- Resume
- Resume file type
- Resume file size


---

## 🔌 Backend API Integration

The current frontend communicates with the Spring Boot backend using `fetch()`.

### User APIs

```text
POST /users/register
POST /users/login
```

### Booking APIs

```text
POST /api/bookings
GET  /api/bookings/user/{userId}
```

### Job APIs

```text
GET /api/jobs
GET /api/jobs/search
GET /api/jobs/{id}
```

### Job Application APIs

```text
POST /api/job-applications
GET  /api/job-applications/user/{userId}
GET  /api/job-applications/{id}/resume
```

The frontend currently uses `http://localhost:8080` as the backend base URL.

---

## 🚀 Getting Started

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- Git
- A modern web browser
- Running ServiceBook Spring Boot backend

### 1. Clone the Repository

```bash
git clone <your-frontend-repository>
cd ServiceBook-
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npm run dev
```

Vite will start the frontend development server.

Open the local URL displayed in the terminal, normally:

```text
http://localhost:5173
```

### 4. Start the Backend

The Spring Boot backend should be running on:

```text
http://localhost:8080
```

The frontend currently sends API requests directly to this backend address.

---

## 📦 Available Scripts

### Start Development Server

```bash
npm run dev
```

### Build Production Version

```bash
npm run build
```

### Run Lint

```bash
npm run lint
```

### Preview Production Build

```bash
npm run preview
```

These commands are defined in the current `package.json`.

---

## 🔄 Customer Booking Flow

```text
Home
  ↓
Services
  ↓
Select Service
  ↓
Book Service
  ↓
Select Date & Time
  ↓
Enter Address & Phone
  ↓
Confirm Booking
  ↓
My Bookings
```

---

## 🔄 Job Seeker Flow

```text
Home
  ↓
Jobs
  ↓
Search Jobs
  ↓
Job Details
  ↓
Apply Now
  ↓
Application Form
  ↓
Upload Resume
  ↓
Submit Application
  ↓
My Applications
  ↓
Track Application Status
```

The job application page sends the application and resume to the backend as multipart form data.

---

## 🎨 User Interface

The frontend uses custom CSS files for individual pages and components rather than relying on a UI framework.

The application includes dedicated designs for:

- Landing page
- Service cards
- Booking forms
- Customer dashboard
- Jobs page
- Job details
- Application form
- Job seeker dashboard
- My Applications
- My Bookings
- Login
- Registration
- Header
- Footer

The Home page also includes a hero section, service categories, booking steps, job promotion section and final call-to-action.

---

## 🧩 Main React Concepts Used

The project demonstrates several React concepts:

- Functional components
- `useState`
- `useEffect`
- `useNavigate`
- `useLocation`
- `useParams`
- React Router
- Controlled forms
- Form validation
- Conditional rendering
- Browser `localStorage`
- API integration using `fetch`
- File upload using `FormData`
- Reusable Header and Footer components

---

## 🌐 Frontend and Backend

ServiceBook is divided into two repositories:

```text
ServiceBook
│
├── Frontend
│   └── React + Vite
│
└── Backend
    └── Spring Boot + MySQL
```

The frontend communicates with the backend through REST APIs.

---

## ⚠️ Current Development Notes

The current frontend uses hard-coded API URLs pointing to:

```text
http://localhost:8080
```

For production deployment, these API URLs should be moved to an environment-based configuration.

The current `App.jsx` contains redirects to `/admin` from some role-handling logic, but no `/admin` route is currently registered in the frontend router.

---

## 🔮 Future Enhancements

Possible future improvements include:

- Secure authentication with Spring Security
- JWT or HTTP-only cookie authentication
- Backend role-based authorization
- Admin dashboard
- Service provider/worker management
- Online payments
- User profile management
- Environment-based API configuration
- Production deployment
- Better search and filtering
- Notifications
- Appointment management
- Responsive improvements for all devices

---

## 👩‍💻 Author

### Mansi Shahu

Java Full Stack Developer

**Technologies:**  
React.js • Java • Spring Boot • MySQL • REST APIs

---

## ⭐ Project Purpose

ServiceBook was developed as a full-stack application project to demonstrate:

- Frontend development with React
- REST API integration
- Form handling and validation
- Role-based user flows
- CRUD-based application functionality
- File upload handling
- Booking management
- Job application management
- Responsive user interface development
