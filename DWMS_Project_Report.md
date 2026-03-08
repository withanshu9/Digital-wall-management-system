# Digital Wall Management System (DWMS) - Project Report

## 1. Introduction
The Digital Wall Management System (DWMS) is a comprehensive web-based platform designed to bridge the gap between wall owners and advertisers in the outdoor advertising industry. The system provides an interactive marketplace where advertisers can discover available wall spaces, book advertisement slots, make secure payments, and track their campaign performance through a centralized dashboard.

## 2. Technology Stack

### Frontend Architecture
* **Framework:** React 18, Vite
* **Routing:** React Router v6
* **Data Visualization:** Recharts
* **HTTP Client:** Axios
* **Date Management:** date-fns, react-date-range

### Backend Architecture
* **Runtime & Framework:** Node.js, Express.js
* **Database:** MongoDB with Mongoose ODM
* **Authentication:** JSON Web Tokens (JWT), bcryptjs for password hashing
* **Payment Gateway:** Razorpay Integration
* **File Uploads:** Multer (handling wall image uploads)
* **Email Services:** Nodemailer
* **Task Scheduling:** Node-cron

## 3. Core Features

### Role-Based Access Control (RBAC)
The platform distinguishes between three primary user roles:
* **Advertisers:** Users who browse available walls, book slots, and manage their marketing campaigns.
* **Wall Owners:** Property owners who list their walls, upload pictures, set pricing, and approve booking requests.
* **Administrators:** System managers who oversee the entire platform, manage user accounts, and monitor transactions.

### Wall Discovery and Listing Engine
* Detailed property view with images and specifications.
* Dynamic filtering and search mechanisms to find optimal advertising spots based on location, price, and availability.

### Booking and Payment Processing
* Calendar-based date selection for campaign slots.
* Dynamic pricing calculation system based on wall specifications and booking duration.
* Integrated and secure checkout process powered by Razorpay.

### Automated Notifications
* Booking confirmations, payment receipts, and password reset flows managed automatically via Nodemailer.

## 4. System Implementation & Architecture
The system adopts a standard Monolithic API architecture with a decoupled React single-page-application.

### Backend Structure
* `/models`: Mongoose schemas defining MongoDB collections (`User`, `Wall`, `Booking`).
* `/controllers`: Core business logic processing incoming API requests.
* `/routes`: API endpoint definitions mapping to specific controllers.
* `/middleware`: Request interceptors for authentication checks, role verification, and payload validation.
* `/utils`: Reusable helper functions (e.g., `sendEmail`).

### Frontend Structure
* `/src/pages`: Main view components (e.g., Dashboards, Login, Registration).
* `/src/utils`: Frontend utilities such as custom hooks (`useAuth`).

## 5. Conclusion
DWMS provides a modern, scalable, and secure solution for digitizing the outdoor advertising ecosystem. Its use of the MERN stack ensures high performance and rapid iteration capabilities, while integrations like Razorpay and node-cron provide robust business operational features.

---
*Report generated automatically for DWMS project analysis.*
