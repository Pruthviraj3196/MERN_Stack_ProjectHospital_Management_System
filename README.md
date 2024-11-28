# Hospital Management System 🏥
A comprehensive Hospital Management System designed to streamline and manage hospital operations efficiently. This project includes features like patient management, appointment booking, user authentication, and an admin dashboard for managing hospital staff and resources.

## Features 🚀
## General:
- User Authentication: Secure login and registration using JWT.
- Role-based Access Control: Separate functionalities for Admins, Doctors, and Patients.
### Patients:
- Book and manage appointments.
## Admins:
- Manage hospital staff (Doctors and Admins).
- Handle patient records, messages, and appointments.
## Tech Stack 🛠️
### Frontend:
- React.js
- Axios
### Backend:
- Node.js
- Express.js
### Database:
- MongoDB
### Authentication:
- JSON Web Tokens (JWT)

## API Endpoints 📡
### Authentication:
- POST /api/v1/user/patient/register: Register a new user.
- POST /api/v1/login: Login and receive a JWT token.
### Patients:
- GET /api/v1/user/patient/me: Fetch patient records.
- POST /api/v1/user/patient/register: Add a new patient.
### Appointments:
- GET /api/v1/appointment/getallappointment: Fetch all appointments.
- POST /api/v1/appointment//post: Book a new appointment.
### Admin:
- GET /api/v1/user/doctors: Fetch doctor details.
- POST /api/v1/user/doctor/addnew: Add a new doctor.

