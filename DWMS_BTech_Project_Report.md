# B.Tech Major Project Report
## Digital Wall Management System (DWMS)

---

# 1. Preliminary Pages

## 1.1 Cover Page
**Project Title:** Digital Wall Management System (DWMS)
**Degree:** Bachelor of Technology (B.Tech)
**Submitted By:** [Student Name Placeholder]
**Roll No:** [Roll No Placeholder]
**Guide Name:** [Guide Name Placeholder]
**Department:** [Department Name Placeholder]
**University Name:** [University Name Placeholder]
*[Logo Placeholder]*
**Month & Year:** [Month, Year]

## 1.2 Title Page
**DIGITAL WALL MANAGEMENT SYSTEM**
A Project Report Submitted
in partial fulfillment of the requirements for the award of the degree of
**BACHELOR OF TECHNOLOGY**
in
[Branch Name Placeholder]
By
**[Student Name Placeholder]**
Under the guidance of
**[Guide Name Placeholder]**

## 1.3 Bonafide Certificate
**CERTIFICATE**
This is to certify that the project report entitled **"Digital Wall Management System"** is the bonafide work of **[Student Name]** ([Roll No]) who carried out the project work under my supervision. This report has not been submitted to any other University or Institution for the award of any degree or diploma.

_______________________
**Signature of Guide**
[Guide Name]
[Designation]

_______________________
**Signature of HOD**
[HOD Name]
[Designation]

_______________________
**Signature of External Examiner**
[Date]

## 1.4 Student Declaration
I hereby declare that the project work entitled **"Digital Wall Management System"** submitted to [University Name] is a record of an original work done by me under the guidance of [Guide Name]. This project work is submitted in the partial fulfillment of the requirements for the award of the degree of Bachelor of Technology in [Branch Name]. The results embodied in this report have not been submitted to any other University or Institute for the award of any degree or diploma.

_______________________
**[Student Name]**
[Roll No]

## 1.5 Acknowledgement
I would like to express my profound gratitude and deep regards to my guide **[Guide Name]** for their exemplary guidance, monitoring, and constant encouragement throughout the course of this project. Their insightful feedback helped shape the project's success. 

I also take this opportunity to express a deep sense of gratitude to **[HOD Name]**, Head of the Department, for their cordial support, valuable information, and guidance, which helped me in completing this task through various stages.

Lastly, I thank the Almighty, my parents, and my friends for their constant encouragement without which this assignment would not be possible.

## 1.6 Abstract
The **Digital Wall Management System (DWMS)** is a comprehensive, web-based platform designed to bridge the gap between wall/property owners and advertisers in the outdoor advertising industry. Traditionally, the process of finding, verifying, and booking physical advertising spaces such as billboards, building walls, or transit spaces is highly fragmented, manual, and localized. This results in inefficiencies, pricing ambiguity, and underutilized assets. 

DWMS addresses these challenges by introducing a centralized marketplace built upon the MERN (MongoDB, Express.js, React.js, Node.js) stack. The platform allows Wall Owners to digitize their assets by uploading high-quality images, specifying geographical locations, defining dimensions, and setting custom pricing. Conversely, it empowers Advertisers with a dynamic discovery portal featuring robust search and filtering capabilities, enabling them to identify the most strategic marketing locations. 

The system implements a robust Role-Based Access Control (RBAC) architecture, catering to Advertisers, Wall Owners, and System Administrators natively. Key technical implementations include a dynamic pricing calculation engine based on dates, an integrated secure payment gateway via Razorpay, and an automated backend scheduling system utilizing Node-cron to manage slot availability continuously. Furthermore, automated email notifications (via Nodemailer) keep all stakeholders synchronized regarding booking statuses, approvals, and financial transactions. DWMS streamlines the entire lifecycle of outdoor advertisement booking, promoting transparency, ease of access, and commercial efficiency.

## 1.7 Keywords
Outdoor Advertising, MERN Stack, E-Marketplace, Role-Based Access Control, Razorpay Integration, Node-cron, Advertising Technology (AdTech), Web Application.

## 1.8 Table of Contents
1. Preliminary Pages ................................................................ i
2. Chapter 1: Introduction .......................................................... 1
3. Chapter 2: Literature Review ..................................................... 5
4. Chapter 3: System Analysis ....................................................... 12
5. Chapter 4: System Design ......................................................... 25
6. Chapter 5: Implementation ........................................................ 48
7. Chapter 6: Testing ............................................................... 65
8. Chapter 7: Results and Discussion ................................................ 75
9. Chapter 8: Conclusion and Future Work ............................................ 82
10. Chapter 9: References ........................................................... 85
11. Chapter 10: Appendix ............................................................ 88

## 1.9 List of Figures
* Fig 4.1: Three-Tier System Architecture
* Fig 4.2: Use Case Diagram for DWMS
* Fig 4.3: Class Diagram representing Entity Relationships
* Fig 4.4: Sequence Diagram for Booking Workflow
* Fig 4.5: Activity Diagram for Payment Processing
* Fig 4.6: Level 0 Data Flow Diagram (Context Diagram)
* Fig 4.7: Entity-Relationship (ER) Diagram
* Fig 7.1: Advertiser Dashboard Interface
* Fig 7.2: Wall Listing and Discovery Portal
* Fig 7.3: Payment Gateway Checkout Interface
* Fig 7.4: Admin Analytics Dashboard

## 1.10 List of Tables
* Table 3.1: Minimum Hardware Requirements
* Table 3.2: Minimum Software Requirements
* Table 4.1: Use Case Description (Wall Booking)
* Table 4.2: Database Schema (User Entity)
* Table 4.3: Database Schema (Wall Entity)
* Table 4.4: Database Schema (Booking Entity)
* Table 6.1: Authentication Module Test Cases
* Table 6.2: Booking Engine Test Cases

## 1.11 List of Abbreviations
* **DWMS:** Digital Wall Management System
* **MERN:** MongoDB, Express.js, React.js, Node.js
* **API:** Application Programming Interface
* **JWT:** JSON Web Token
* **UI/UX:** User Interface / User Experience
* **DB:** Database
* **RBAC:** Role-Based Access Control
* **JSON:** JavaScript Object Notation

---

# 2. Chapter 1: Introduction

## 2.1 Background of Study
The outdoor advertising industry, colloquially known as Out-of-Home (OOH) advertising, has been a cornerstone of marketing strategy for decades. Despite the rapid growth of digital media, physical advertising spaces (billboards, transit displays, wall murals) maintain an irreplaceable presence due to their localized impact and high visibility. However, the operational mechanics of the OOH industry have largely remained stagnant. The process of identifying an available wall, negotiating prices, verifying the location's quality, and finalizing a booking typically requires extensive manual intervention, brokering, and localized physical surveys. In an era where digital transformation optimizes efficiency across sectors, the lack of a centralized, transparent platform for managing physical advertisement spaces represents a significant technological lag.

## 2.2 Problem Statement
Currently, wall owners struggle to monetize their vacant wall spaces due to a lack of visibility and reach. Conversely, advertisers face significant hurdles in finding suitable ad spaces across different geographical sectors. They are forced to rely on fragmented local agencies, leading to opaque pricing, time-consuming negotiations, and inefficient manual booking ledgers. There is no unified system that verifies properties, standardizes pricing models based on duration, and securely handles the financial transactions between the owner and the advertiser.

## 2.3 Objectives of the Project
The primary objectives of the Digital Wall Management System are:
1. To design and develop a centralized e-marketplace connecting wall owners and advertisers.
2. To implement a secure, scalable web architecture using the MERN stack.
3. To build a robust listing engine allowing owners to digitize their physical spaces with imagery, dimensions, and locale specifics.
4. To engineer a dynamic booking and pricing system that prevents overlapping reservations and automatically calculates costs.
5. To integrate a secure third-party payment gateway (Razorpay) to facilitate direct commercial transactions.
6. To enforce strict Role-Based Access Control distinguishing platform administrators, wall providers, and consumers.

## 2.4 Scope of the Project
The scope of this project is confined to the development of the web application handling the discovery, booking, and payment processing phases of outdoor advertising. It encompasses user registration, profile management, inventory (wall) management by owners, search and filtering by advertisers, checkout capabilities, and post-booking status management (approval/rejection algorithms). The scope does not currently include the physical printing or actual mounting logistics of the advertisement materials, restricting its focus strictly to the digital marketplace and operational logistics.

## 2.5 Need for the Project
The necessity of this project arises from the explicit market gap between the availability of micro-level OOH advertising spaces and the decentralized demand for them. By creating DWMS, property owners gain an automated revenue stream from idle assets, and businesses gain democratic, straightforward access to municipal and urban advertising locations without restrictive intermediary brokerage fees.

## 2.6 Organization of the Report
The remainder of this report is organized as follows:
* **Chapter 2** presents the Literature Review, analyzing existing solutions and identifying research gaps.
* **Chapter 3** defines the System Analysis, comparing existing and proposed systems, alongside feasibility and requirement analysis.
* **Chapter 4** outlines the System Design, utilizing UML to illustrate architecture, database structures, and workflows.
* **Chapter 5** discusses Implementation details, environments, and core algorithmic descriptions.
* **Chapter 6** details the software Testing methodologies applied to ensure system stability.
* **Chapter 7** provides Results and Discussion, accompanied by visual evidence.
* **Chapter 8** concludes the study and proposes future enhancements.

---

# 3. Chapter 2: Literature Review

## 3.1 Introduction
The literature review critically examines the current state of Out-of-Home (OOH) advertising management platforms. It evaluates the evolution from traditional offline broker systems to emerging digital ad-space marketplaces.

## 3.2 Review of Existing Systems
Traditional OOH advertising is governed by large-scale agencies (e.g., JCDecaux, Clear Channel) that lease massive infrastructures. For smaller, granular spaces (individual building walls, compound walls), management is highly localized. Recent digital attempts include broad real-estate aggregation platforms or classified ad websites connecting buyers and sellers loosely. Furthermore, specialized enterprise software exists for large billboard companies to manage their own inventories internally, but these are closed systems unavailable to independent property owners.

## 3.3 Strengths and Weaknesses of Existing Systems
**Strengths:**
* Large agencies offer guaranteed regulatory compliance and established maintenance channels.
* Existing enterprise software is highly robust in tracking physical billboard maintenance.

**Weaknesses:**
* High barrier to entry for independent, small-scale wall owners to list assets.
* Lack of price transparency; prices fluctuate based on closed-door negotiations.
* Absence of end-to-end self-service booking. Advertisers cannot typically click, pay, and book a wall instantly without a human broker.
* No centralized verification system for the physical state of the walls.

## 3.4 Research Gap
A fundamental research gap exists in bridging micro-assets (independent walls) with SMEs (Small-to-Medium Enterprises) desiring advertising space. Existing platforms focus heavily on macro-assets. Furthermore, there is a lack of integrated digital workflows that automatically handle time-slot collision detection for physical spaces alongside integrated financial escrows/payments in the Indian geographic context.

## 3.5 Overview of Proposed Solution
The proposed DWMS acts as a digital equalizer. By utilizing modern web technologies, it allows micro-asset mobilization. The system proposes an autonomous workflow where collision detection logic (preventing double-booking) is handled algorithmically. Real-time notifications and payment verifications eliminate the need for manual brokers, directly addressing the identified weaknesses of opacity and inefficiency.

---

# 4. Chapter 3: System Analysis

## 4.1 Existing System
The existing paradigm relies on physical hoarding brokers.
* **Process:** An advertiser contacts an agency. The agency provides a PDF list of available locations. The advertiser selects a location. Bureaucratic paperwork and manual wire transfers are executed.
* **Drawbacks:** Slow turnaround times (often weeks). High dependency on human agents. Error-prone scheduling leading to accidental double-bookings of prime locations. High commission margins deducted from the owner's revenue. 

## 4.2 Proposed System
DWMS digitizes this entire pipeline.
* **Process:** Advertisers log in, view an interactive gallery of verified walls, filter by city/price, select dates, receive an automated quotation, pay via Razorpay, and trigger an automated approval request to the owner.
* **Advantages:** Instantaneous discovery. Broker-free transactions. Real-time availability synchronization. Secure, trackable, and scalable.

## 4.3 Feasibility Study
Before extensive development, a feasibility study was conducted to ensure project viability.

### 4.3.1 Technical Feasibility
The project uses the MERN stack. React offers component-driven UI scalability. Node.js with Express handles asynchronous I/O optimally, necessary for simultaneous booking requests. MongoDB's NoSQL nature perfectly suits the dynamic attributes of geographic listings. Razorpay provides high-quality SDKs for Node.js. The technologies are open-source and highly feasible. 

### 4.3.2 Economic Feasibility
Since the core technologies (MongoDB, Node.js, React) are open-source, the foundational software cost is zero. Deployment costs are minimal utilizing cloud services like Vercel (for frontend) and Render/Heroku (for backend), or AWS free tiers. The system's automated nature reduces overhead costs, establishing high economic feasibility.

### 4.3.3 Operational Feasibility
The platform's UI/UX is designed following modern accessibility guidelines. It requires minimal training for users. Advertisers accustomed to e-commerce platforms will naturally understand the checkout flow. Wall Owners are given a simplified dashboard. Operationally, the system seamlessly integrates into the end-users' existing digital literacy levels.

### 4.3.4 Legal Feasibility
The system utilizes standard Terms of Service architectures. The integration of Razorpay offloads PCI-DSS compliance requirements for financial transactions to the payment gateway provider. Consequently, the legal footprint regarding financial data handling is mitigated.

## 4.4 Requirement Analysis

### 4.4.1 Functional Requirements
1. **Authentication:** Secure user signup and login utilizing JWT logic. Role selection during registration.
2. **Wall Inventory Management:** Owners must be able to Create, Read, Update, and Delete (CRUD) wall listings. Must include image upload (via Multer).
3. **Search & Filter:** Advertisers must be able to query walls by state, city, price range, and availability status.
4. **Booking Engine:** The system must capture start/end dates, calculate total cost (price/day * duration), and process payment.
5. **Approval Workflow:** Owners must possess the ability to 'Approve' or 'Reject' incoming booking requests, subsequently altering the wall's mathematical 'booked' state.
6. **Task Automation:** A cron-job must periodically evaluate expired bookings to revert walls to an 'Available' state.
7. **Email Alerts:** Notifications triggered on registration, password resets, and booking updates.

### 4.4.2 Non-Functional Requirements
1. **Security:** Passwords must be hashed via bcryptjs. API endpoints must be guarded by token verification middleware.
2. **Performance:** API response times should ideally remain under 300ms. Database queries must be indexed.
3. **Usability:** The UI must be fully responsive across mobile, tablet, and desktop viewports.
4. **Scalability:** The architecture must support horizontal scaling for both Node.js instances and MongoDB replica sets.

---

# 5. Chapter 4: System Design

## 5.1 System Architecture
DWMS follows a classic **Three-Tier Client-Server Architecture**:
1. **Presentation Tier (Client):** Developed in React.js and Vite. It runs in the user's browser, handling routing, state management, and rendering of UI components.
2. **Application Tier (Server):** Node.js and Express.js RESTful API. It processes business logic, validates data, interfaces with external APIs (Razorpay, SMTP servers), and manages authorization.
3. **Data Tier (Database):** MongoDB managed via Mongoose ODM. It persists JSON-like document data for users, walls, and relational booking references.

## 5.2 Architecture Diagram
*[Description for Diagram]*: The diagram illustrates the Client (Browser) communicating HTTP requests to the Express API. The Express API contains Middleware ensuring Security. The Controllers process data, communicating with MongoDB for persistence and Razorpay API for transactional settlement, returning JSON responses to trigger React state updates.

## 5.3 UML Diagrams

### 5.3.1 Use Case Diagram
*[Description for Diagram]*: 
* **Actors:** Advertiser, Wall Owner, Admin.
* **Use Cases:** 
  * *Advertiser:* Register, Login, Browse Walls, Book Wall, Make Payment, View Dashboard.
  * *Boundary:* The 'Book Wall' use case *<<includes>>* 'Make Payment'.
  * *Wall Owner:* Manage Walls (Add/Edit), Approve/Catch Bookings, View Analytics.
  * *Admin:* Manage System Users, Monitor All Transactions.

### 5.3.2 Use Case Description Example
**Use Case:** Book Wall
**Primary Actor:** Advertiser
**Precondition:** Advertiser is authenticated and wall is marked 'Available'.
**Main Success Scenario:**
1. Advertiser selects dates.
2. System calculates cost.
3. Advertiser confirms via Razorpay.
4. System records payment success, marks specific dates as 'pending approval'.
5. Email sent to Wall Owner.

### 5.3.3 Class Diagram
*[Description for Diagram]*: Displays classes `User`, `Wall`, `Booking`. 
* `User` has attributes (name, email, role, password) and methods (register, login, resetPassword).
* `Wall` has attributes (location, dimensions, pricePerDay, image, owner_ref, status). `Wall` has a 1-to-N relationship with `User` (Owner).
* `Booking` associates `User` (Advertiser) with `Wall`, storing attributes (startDate, endDate, totalAmount, paymentId, approvalStatus).

### 5.3.4 Sequence Diagram
*[Description for Booking Sequence]*:
1. Advertiser -> React UI: Click "Book".
2. React UI -> Node API: POST /api/payment/create-order.
3. Node API -> Razorpay: Generate Order ID.
4. Razorpay -> Node API: Return Order ID.
5. Node API -> React UI: Send Order Data.
6. React UI -> Razorpay SDK: Trigger Checkout Modal.
7. Razorpay SDK -> React UI: Payment Success Response (Payment ID, Signature).
8. React UI -> Node API: POST /api/booking/verify-and-create.
9. Node API -> Database: Save Booking Document, Update Wall Status.
10. Node API -> Nodemailer: Send Confirmation emails.

### 5.3.5 Activity Diagram
*[Description for Payment Processing]*:
Start -> Initiate Payment -> Create Razorpay internal Order -> Prompt User for Details -> (Decision Node: Success/Failure). If Failure -> Display Error -> End. If Success -> Generate Signature HMAC string -> Validate Signature in Backend -> If invalid -> Flag Fraud -> End. If valid -> Persist Transaction in Database -> Issue Receipt -> End.

### 5.3.6 Deployment Diagram
*[Description]*: Illustrates the hardware/node layout. User Device (Execution Environment: Web Browser) communicates over HTTPS to Cloud Host (Execution Environment: Node.js/Express) which utilizes a TLS connection to a separate Cloud DB Server (Execution Environment: MongoDB Atlas).

## 5.4 Data Flow Diagram (DFD)
* **Level 0 (Context Diagram):** Shows the external entities (User, Admin, Payment Gateway) interacting with a single central process node labeled "DWMS System".
* **Level 1:** Decomposes Level 0 into distinct sub-processes: Authentication Process, Wall Inventory Process, Booking Engine Process, Payment Process, and Admin Monitoring Process. Data stores (User DB, Wall DB, Booking DB) are introduced and linked to these processes.

## 5.5 Entity-Relationship (ER) Diagram
*[Description]*: 
* Entity **USER** (attributes: _id [PK], name, email, passwordHash, role, contact).
* Entity **WALL** (attributes: _id [PK], title, description, state, city, location, pricePerDay, status, ownerId [FK]).
* Entity **BOOKING** (attributes: _id [PK], advertiserId [FK], wallId [FK], startDate, endDate, transactionId, paymentStatus, bookingStatus).
* **Relationships:** User (Owner) 'lists' Wall (1 to N). User (Advertiser) 'makes' Booking (1 to N). Wall 'has' Bookings (1 to N).

## 5.6 Database Design (Schema Definition)
**Table: Users**
| Attribute | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Auto-generated MongoDB ID |
| `name` | String | Required | Full name of user |
| `email` | String | Required, Unique | Email address |
| `password` | String | Required | Hash generated via bcrypt |
| `role` | String | Enum: admin, owner, advertiser | Role-based determinant |

**Table: Walls**
| Attribute | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Auto-generated ID |
| `owner` | ObjectId | Foreign Key (User) | Reference to Wall Owner |
| `title` | String | Required | Short title |
| `pricePerDay` | Number | Required | Financial cost |
| `status` | String | Enum: available, booked | Current operational state |
| `images` | Array | Strings | File paths/URLs |

**Table: Bookings**
| Attribute | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Target ID |
| `wallId` | ObjectId | Foreign Key (Wall) | Linked wall |
| `advertiserId` | ObjectId | Foreign Key (User)| Consumer |
| `startDate` | Date | Required | Campaign start date |
| `status` | String | pending, approved, rejected | Owner authorization state |

## 5.7 Algorithm Design
**Automated Status Evaluation Logic (Pseudocode for Cron Job)**
```text
BEGIN
  GET current_date
  FIND all Bookings WHERE status == 'approved' AND endDate < current_date
  FOREACH booking IN expired_bookings:
    UPDATE Booking SET status = 'completed'
    UPDATE Wall (WHERE _id == booking.wallId) SET status = 'available'
  ENDFOREACH
END
```
**Rationale:** This background automation algorithm ensures the platform cleanly releases assets back into the available pool once campaigns terminally expire, ensuring accurate inventory reflection without human monitoring.

---

# 6. Chapter 5: Implementation

## 6.1 Development Environment
* **Operating System:** Platform independent (Developed on Windows 11).
* **IDE:** Visual Studio Code.
* **Frontend Languages & Frameworks:** HTML5, modern CSS3, JavaScript (ES6+), React.js (v18), Vite, Tailwind CSS / Custom CSS modules.
* **Backend Languages & Frameworks:** Node.js (v20+), Express.js.
* **Database:** MongoDB shell, MongoDB Compass GUI.
* **Version Control:** Git & GitHub.
* **Package Management:** NPM (Node Package Manager).

## 6.2 Module Description
The system is cleanly divided into functional modules:

### 6.2.1 User Authentication Module
Handles the issuance of stateless JWT tokens. Upon login with valid credentials, the server encodes user ID and Role into a token. The React frontend stores this in `localStorage` or memory, injecting it into subsequent `Authorization: Bearer <token>` HTTP headers using Axios interceptors. Route guarding is enforced on the frontend utilizing `<Navigate />` components in React Router.

### 6.2.2 Wall Management (Owner) Module
Employs standard form inputs serialized into `FormData` objects to accommodate binary file uploads. Multer middleware on the Express server intercepts multipart data, sanitizes filenames, saves them to a designated `/uploads` directory, and attaches the local filepath/URL to the `req.body` payload before the mongoose model `.save()` operation executes.

### 6.2.3 Booking and Transaction Module
The most complex architectural component. It requires atomic synchronization. Upon user intent to book, the server generates a Razorpay order. The client invokes Razorpay's UI. Upon completion, a callback function transmits the `razorpay_payment_id` and `razorpay_signature` to the DWMS verification endpoint. The server reconstructs an HMAC Hex signature using the secret key; if it matches the payload signature, data integrity is mathematically guaranteed, and the booking document is securely instantiated.

### 6.2.4 Notification Engine Module
Utilizes Nodemailer bound to an SMTP transport (e.g., Gmail or Amazon SES). It operates asynchronously to prevent blocking the main HTTP event loop, sending HTML-formatted templates notifying owners of pending actions.

## 6.3 Important Code Snippets

**Snippet: JWT Verification Middleware Configuration**
*Logic Explanation:* This middleware functions as an API guard. It intercepts incoming requests, strips the 'Bearer ' prefix, and utilizes `jwt.verify()` alongside the `JWT_SECRET`. If verification fails, a 401 Unauthorized status is immediately returned, short-circuiting access to secure controllers.

**Snippet: Server-Side Signature Verification for Razorpay**
*Logic Explanation:* Essential for financial security. Using `crypto.createHmac()`, the backend independently calculates what the signature should be based on the order payload. Hard comparisons prevent client-side spoofing of successful payments.

---

# 7. Chapter 6: Testing

## 7.1 Testing Strategy
A multifaceted testing approach guarantees application robustness before deployment.
1. **Unit Testing:** Individual functional testing of utility functions (e.g., date-difference calculators for pricing, password hashing validation).
2. **Integration Testing:** Assuring that React Axios calls successfully map to Express endpoints, and Express routes correctly interface with Mongoose database operations.
3. **System Testing:** End-to-end evaluation simulating user lifecycles (Register -> Login -> Browse -> Book -> View Dashboard).
4. **Acceptance Testing:** Validating that the application strictly fulfills primary stakeholder requirements.

## 7.2 Test Cases

| Test Case ID | Module | Description | Expected Output | Status |
| :--- | :--- | :--- | :--- | :--- |
| TC_01 | Auth | Login with incorrect password | JSON { error: "Invalid credentials" }, Status 401 | Pass |
| TC_02 | Auth | Access protected owner route as advertiser | Middleware rejects, Status 403 Forbidden | Pass |
| TC_03 | Wall Add | Upload wall without image file attached | Validation middleware throws error | Pass |
| TC_04 | Booking | Calculate price for 5 days at ₹1000/day | Booking payload total set to ₹5000 | Pass |
| TC_05 | Payment | Verify manipulated Razorpay signature | HMAC logic fails, reject booking save | Pass |
| TC_06 | Cron Job | System checks for expired walls at midnight | Expired bookings set to closed, walls available | Pass |

## 7.3 Performance Testing
API stress testing involved firing concurrent requests to the `GET /api/walls` public discovery route to ensure the MongoDB queries are efficient. Implementing pagination and logical indexing within the `Wall` schema significantly reduced query latency, remaining under optimal response timelines.

## 7.4 Security Testing
* **Injection Attacks:** Mongoose's strict schema casting inherently neutralizes standard NoSQL injection vulnerabilities.
* **Cross-Site Scripting (XSS):** React mitigates XSS by automatically escaping string variables in JSX.
* **Data Transit:** Implementation of HTTP/HTTPS protocols ensures payload encryption during transit between client browsers and server instances.

---

# 8. Chapter 7: Results and Discussion

## 8.1 Summary of Modules Developed
The culmination of the development phase resulted in a fully functional MERN application. 
* The **Advertiser Portal** effectively displays aggregated wall data, featuring seamless navigation and secure checkout capabilities.
* The **Wall Owner Portal** functions as a localized CRM, permitting granular control over physical inventory and booking authorizations.
* The **Admin Panel** possesses supreme oversight, viewing system-wide metrics and user behaviors.

## 8.2 Screenshots Description
* *(Note: In the final document format, corresponding UI screenshots will be embedded here.)*
* **Figure 7.1 (Discovery Portal):** Demonstrates the grid layout UI showcasing location images, dimensions, and daily pricing metrics accompanied by state/city filtering dropdowns.
* **Figure 7.2 (Booking Interface):** Showcases the React-Date-Range calendar integration, preventing users from selecting dates operating in the past, alongside dynamic total-cost rendering.
* **Figure 7.3 (Owner Dashboard):** Illustrates the tabulated view containing "Pending Approvals". The owner is presented with distinct action buttons linking to API update routes.

## 8.3 Output Explanation
When a transaction strictly completes via the Razorpay test environment, the backend emits confirmation payloads. The wall document transitions its status variable from `Available` to `Booked`. Consequently, the React generic discovery context triggers a refresh, actively omitting the now-booked wall from public search listings, successfully preventing race conditions and double reservations.

## 8.4 Comparison with Existing System
Unlike physical agencies operating within 9-to-5 paradigms with heavy localized bias, DWMS operates asynchronously 24/7 globally. Transparency is achieved inherently; Advertisers view prices programmatically configured by Owners, removing opaque broker inflation taxes and radically increasing processing speed from weeks to mere minutes.

---

# 9. Chapter 8: Conclusion and Future Work

## 9.1 Conclusion
The Digital Wall Management System successfully fulfills its core objectives by providing an end-to-end digital infrastructure for the outdoor advertising domain. By effectively leveraging the MERN stack alongside crucial third-party integrations (Razorpay, Nodemailer), the ecosystem translates fragmented physical procedures into a structured algorithmic workflow. DWMS serves as a democratizing agent, enabling micro-scale property owners to monetize assets effortlessly and empowering businesses to execute data-driven, agile geographic marketing campaigns. 

## 9.2 Limitations
Current limiting factors include:
* Dependency on manual measurements and unverified images uploaded by Wall Owners (risk of false representation).
* The platform solely manages the digital transaction; the physical printing, structural compliance, and pasting of the advertising flex/vinyl remain the external responsibility of the advertiser/owner combination.

## 9.3 Future Enhancements
To enhance systemic capabilities, future versions could integrate:
1. **IoT Analytics Integration:** Installing low-cost camera modules or mobility sensors at wall sites to provide Advertisers with empirically generated "Footfall/Impression" analytics via an API.
2. **AI Image Verification:** Utilizing machine learning to automatically cross-reference owner-uploaded images with Google Street View API data to certify structural legitimacy.
3. **Advanced Dynamic Pricing:** Constructing algorithms that auto-adjust wall pricing based on seasonal demand, local festival dates, or regional traffic density.
4. **Mobile Application Porting:** Migrating the React application to React Native to deliver iOS and Android native experiences.

---

# 10. Chapter 9: References

[1] Flanagan, D. (2020). *JavaScript: The Definitive Guide: Master the World's Most-Used Programming Language*. O'Reilly Media.
[2] Chodorow, K. (2013). *MongoDB: The Definitive Guide*. O'Reilly Media.
[3] React Documentation. (2023). UI Component Architecture. Available online at: https://reactjs.org/docs
[4] Express.js API Reference. (2023). Node.js web application framework. Available online at: https://expressjs.com/
[5] JWT.IO. (2023). JSON Web Tokens Introduction. Available online at: https://jwt.io/introduction
[6] Razorpay Developer Docs. (2023). Integration capabilities. Available online at: https://razorpay.com/docs/
[7] "A Review of Web Frameworks and Technologies in E-Commerce Platform Development", *IEEE International Conference on Web Technologies*, 2021.

---

# 11. Chapter 10: Appendix

## 11.1 User Manual
**A. Prerequisites:** Node.js > 18.x installed, MongoDB Compass or Atlas connection string.
**B. Installation:**
1. Clone the repository natively.
2. Execute `npm install` concurrently in both `/frontend` and `/backend` root folders.
3. Configure identical `.env` files establishing `MONGO_URI`, `JWT_SECRET`, and Razorpay Keys.
**C. Execution:**
1. Navigate to `/backend` -> `npm run dev` (starts on port 5000).
2. Navigate to `/frontend` -> `npm run dev` (starts on port 5173).

## 11.2 Gantt Chart
*(A visual Gantt chart representation outlining the Software Development Life Cycle (SDLC) from Phase 1 requirements gathering, Phase 2 UI/UX wireframing, Phase 3 API structural development, Phase 4 React integration, to Phase 5 Testing and deployment over a 4-month span.)*

## 11.3 Cost Estimation
Software stack costs inherently total $0 due to open-source licensing. Future hosting estimations calculate to approximately $20-50/month utilizing robust cloud distribution (e.g., AWS EC2, MongoDB Atlas M10 tier). 

## 11.4 Maintenance Plan
Continuous Integration methodologies will assure that package dependencies (NPM Node modules) are updated quarterly to patch security vulnerabilities. The Database indices will execute maintenance scripts dynamically to maintain read-speed efficiency as collection magnitude increases.

## 11.5 Plagiarism Declaration
*(Placeholder for University Specific Plagiarism Scan Results - e.g., Turnitin/Urkund summary declaring <10% index match).*

**[Repository URL Placeholder]**
**[Deployment URL Placeholder]**
