# 🪔 UtsavMitra (उत्सवमित्र) – AI-Powered Event Management Platform

> **An end-to-end web platform designed to simplify planning, organization, and management of Indian traditional and modern celebrations.**
> Powered by **React.js, Node.js, Express.js, and MongoDB** with **Razorpay Checkout**, **Anti-Duplicate QR Attendance Tracking**, and **4 Distinct Role-Based Interfaces**.

---

## 🌟 The 4 Distinct Platform Interfaces

| Interface | Persona / Demo Account | Access URL | Core Capabilities |
| :--- | :--- | :--- | :--- |
| **1. User / Attendee** | `aarav.sharma@gmail.com` / `User@123` | `/` and `/user/dashboard` | Event Discovery, Category Filters, Razorpay Pass Booking, Downloadable QR Passes, AI Budget & Itinerary Planner, Digital Invitations with RSVPs, Venue Discovery. |
| **2. Event Organizer** | `organizer@jaipurfest.com` / `Org@123` | `/organizer/dashboard` | Create/Edit Events, Multi-tier Ticketing, Live Webcam/Camera QR Gate Scanner, Attendance Verification, Attendee Roster with CSV/Print Register. |
| **3. Admin** | `admin@utsavmitra.com` / `Admin@123` | `/admin/dashboard` | **Stores and monitors every single platform record**: Master Events Directory, All Bookings & Transactions Ledger, Users & Organizers Directory, Venue Listings & Client Inquiries, Moderation Controls. |
| **4. Super Admin** | `superadmin@utsavmitra.com` / `Super@123` | `/super-admin/dashboard` | **Master System Control**: Contains *everything in Admin* **PLUS** Admin Management (Create/Promote/Demote Admins), GMV Financials & Platform Commission Revenue, Chronological Audit Logs, DB Health Diagnostics, and 1-Click Database Reseeding. |

> 💡 **Instant Role Switcher**: A sticky **4-Interface Switcher Bar** is pinned at the top of the application, allowing you to test and jump into any of the 4 personas with a single click without manually typing credentials!

---

## 🚀 Key Feature Modules

### 1. 🪔 Traditional & Modern Indian Celebrations
- **Royal Weddings & Sangeet**: Regal destination weddings, Baraat processions, Varmala, 56-Bhog banquets, and Shehnai welcomes.
- **Navratri Garba & Dandiya Raas**: High-energy folk orchestra, traditional Chaniya Choli nights.
- **College Cultural & Tech Fests**: Asia's premier youth festivals (Mood Indigo style), AI Hackathons, Battle of the Bands, Starlight Pro-Nites.
- **Religious & Cultural Gatherings**: Vrindavan Phoolon Ki Holi, Ganesh Utsav, and Vedic Havans.
- **Corporate & Lifestyle Carnivals**: Craft beer festivals, culinary masterclasses, and acoustic sundowners.

### 2. 🤖 AI-Powered Event Planning Engine
- **AI Indian Budget Allocator**: Calculates line-item rupee allocations (Catering & Mithai, Mandap & Lighting Decor, Photography & Drone, DJ & Dhol, Return Favors, Panditji buffer) with cost-saving tips.
- **Auspicious Muhurat & Timeline Generator**: Detailed hour-by-hour program flow with coordinator roles.
- **Bilingual Invitation Copywriter**: Generates Sanskrit Mangal Shlokas, Hindi poetic invitation copy, and royal English formal card text.
- **Royal Festive Catering Planner**: Curates 5-tier Indian banquet menus (Thandai welcome drinks, Chandni Chowk chaat gali, shahi gravies, zafrani breads, and hot jalebi-rabdi).
- **UtsavMitra AI Chat Assistant**: Conversational assistant answering ceremony questions and security protocols.

### 3. 🎟️ Anti-Duplicate QR-Code Attendance Tracking
- Each confirmed booking generates an encrypted digital badge containing a unique Pass ID (e.g. `UM-PASS-8841`) and a high-resolution QR code.
- Organizers use the **Live QR Scanner** with webcam/device camera or manual Pass ID lookup.
- **Duplicate Entry Detection**: If an attendee badge is scanned more than once, the system flags a duplicate warning with exact timestamp and gatekeeper information.

### 4. 💳 Razorpay Online Payment Integration
- Integrated checkout supporting UPI (GPay, PhonePe, Paytm), RuPay/Visa/MasterCard cards, and Netbanking.
- Seamless test mode simulation and live Razorpay gateway SDK readiness.
- Automatically records Razorpay Payment IDs and transaction statuses in the master ledger.

### 5. 💌 Digital Festive E-Invitations & Interactive RSVP
- Create paperless invitations with customizable festive themes: *Royal Marigold*, *Rajasthani Regal*, *Modern Glow*, *Bollywood Bash*, and *College Cyber Neon*.
- Shareable public link (`/invite/:slug`) where family and friends submit RSVPs with attendance status, guest counts, dietary notes (Jain, Pure Veg), and blessings wall.

### 6. 🏰 Heritage Venues & Banquet Lawns
- Browse heritage palaces, 5-star seaside lawns, and pillarless convention ballrooms across Jaipur, Udaipur, Mumbai, Delhi, and Kerala.
- Direct booking inquiry forms connecting hosts to venue managers.

---

## 🛠️ Tech Stack Architecture

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, HTML5-QRCode, Canvas-Confetti, QRCode.React, React Router 6.
- **Backend**: Node.js, Express.js REST API, JSON Web Tokens (JWT), Bcrypt.js, QRCode generator, Razorpay SDK.
- **Database**:
  - Full **MongoDB & Mongoose** schemas (`User`, `Event`, `Booking`, `Venue`, `Invitation`, `AuditLog`, `SystemSetting`).
  - Automatic fallback persistent store ensuring zero-crash setup out of the box even before local MongoDB service is started!

---

## ⚙️ Running the Project Locally

### Prerequisites
- Node.js (v18+) & npm

### Step 1: Install Dependencies
Run the install command from root:
```bash
# Backend dependencies
npm install --prefix backend

# Frontend dependencies
npm install --prefix frontend
```

### Step 2: Start the Backend Server (Port 5000)
```bash
npm run dev:backend
```
*Backend runs on: `http://localhost:5000` (API Health: `http://localhost:5000/api/health`)*

### Step 3: Start the Frontend Application (Port 5173)
In a separate terminal:
```bash
npm run dev:frontend
```
*Frontend runs on: `http://localhost:5173`*

---

## 🔑 Pre-Seeded Demo Credentials

| Role | Name | Email | Password |
| :--- | :--- | :--- | :--- |
| **Super Admin** | Vikramaditya Rathore | `superadmin@utsavmitra.com` | `Super@123` |
| **Admin** | Sunita Mehra | `admin@utsavmitra.com` | `Admin@123` |
| **Organizer** | Rajesh Singhania | `organizer@jaipurfest.com` | `Org@123` |
| **Organizer** | Devika Kulkarni | `organizer@mumbaiculture.in` | `Org@123` |
| **User / Attendee** | Aarav Sharma | `aarav.sharma@gmail.com` | `User@123` |
| **User / Attendee** | Priya Patel | `priya.patel@gmail.com` | `User@123` |

*(Or simply click on the persona in the top **Role Switcher Bar** to jump into any role instantly!)*

---

## 📁 Project Structure

```
ELVAtech (event mangemenet project)/
├── backend/
│   ├── src/
│   │   ├── config/ (db.js)
│   │   ├── controllers/
│   │   │   ├── adminController.js (all platform information aggregation)
│   │   │   ├── superAdminController.js (admin mgmt, GMV, audit logs, DB diagnostics)
│   │   │   ├── eventController.js
│   │   │   ├── bookingController.js (QR generation & gate check-in)
│   │   │   ├── aiController.js (budget, timeline, poetry, catering)
│   │   │   ├── venueController.js
│   │   │   └── inviteController.js
│   │   ├── data/ (inMemoryStore.js, seedData.js, store.json)
│   │   ├── middleware/ (authMiddleware.js, roleMiddleware.js)
│   │   ├── models/ (User.js, Event.js, Booking.js, Venue.js, Invitation.js, AuditLog.js)
│   │   ├── routes/
│   │   └── server.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/ (client.js)
│   │   ├── components/ (Navbar, Footer, RoleSwitcherBanner, EventCard, RazorpayModal, ProtectedRoute)
│   │   ├── context/ (AuthContext.jsx, ToastContext.jsx)
│   │   ├── pages/
│   │   │   ├── user/ (Home, ExploreEvents, EventDetails, DigitalPassView, AIPlanner, DigitalInvitations, PublicInvitationView, VenueDiscovery, UserDashboard)
│   │   │   ├── organizer/ (OrganizerDashboard, CreateEditEvent, ManageAttendees, QRScannerPage)
│   │   │   ├── admin/ (AdminDashboard)
│   │   │   ├── superAdmin/ (SuperAdminDashboard)
│   │   │   └── auth/ (Login, Register)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

---
*UtsavMitra – Bringing Indian Traditions & Modern Celebrations into the Digital Age.*
