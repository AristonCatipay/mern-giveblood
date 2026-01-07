# GiveBlood

GiveBlood is a location-based blood donation platform that connects people in urgent need of blood with nearby eligible donors. The platform enables direct, user-to-user coordination while enforcing responsible donation practices to ensure safety, trust, and sustainability.

This project is built as both a **portfolio showcase** and a **startup-ready MVP**, designed with scalability, auditability, and privacy in mind.

---

## Problem Statement

Finding compatible blood donors quickly is often difficult, especially during emergencies. Existing solutions rely heavily on manual coordination, social media posts, or centralized intermediaries that slow down the process.

GiveBlood solves this by:

- Connecting donors and recipients within the same city
- Enabling direct communication
- Enforcing donation eligibility rules
- Maintaining a transparent donation history

---

## Core Features

### Blood Request Posts

- Created by patients or family members
- Includes:
  - Required blood type
  - Number of blood bags needed
  - Hospital location
  - Date needed
- Visible only to users in the same city

---

### Donor Matching & Eligibility

- Donors can apply to blood request posts
- A donor:
  - May only participate in **one active donation transaction at a time**
  - Must observe a **3-month cooldown period** after a completed donation

These rules are enforced to promote donor health and system integrity.

---

### Donation Transactions

Every donation follows a structured lifecycle:

1. **ON-GOING**
   - Donor has applied
   - Coordination is in progress
2. **ON-VALIDATION**
   - Donation has been completed
   - Awaiting confirmation
3. **COMPLETE**
   - Donation is verified
   - Donor enters cooldown period

All donation activity is recorded for accountability and trust.

---

### Communication System

- Each blood request creates a private group
- Donors and requesters can communicate through in-app messaging
- Conversations are scoped to the specific blood request

---

### NGO Announcements

- NGOs can publish informational posts and announcements
- Users can comment and engage with NGO content
- NGO posts are separate from blood request posts

---

## Technology Stack

**Frontend**

- React

**Backend**

- Node.js
- Express.js
- MongoDB with Mongoose

**Authentication**

- JWT-based authentication

**Architecture**

- RESTful API
- MVC-inspired backend structure

---

## Data Models Overview

- **User**
  - Represents donors, requesters, and NGO members
- **Post**
  - Blood request created by a patient or family member
- **DonorRecipientTransaction**
  - Tracks the lifecycle of a blood donation
- **Group**
  - Private communication space per blood request
- **Messages**
  - Messages exchanged within a group
- **NGOPost**
  - Informational posts published by NGOs
- **Comments**
  - User comments on NGO posts

---

## Design Principles

- Privacy-first handling of sensitive information
- Clear separation of responsibilities across entities
- Enforced business rules at the application layer
- Scalable data modeling for future expansion
- Minimal but extensible MVP scope

---

## Future Enhancements

- Role-based access control (Donor, Requester, NGO, Admin)
- Hospital or NGO verification
- Donation proof uploads
- Push notifications
- Geospatial radius-based matching
- Admin moderation dashboard
- Rate limiting and anti-abuse mechanisms

---

## Project Status

This project is under active development and is intended to evolve into a production-ready platform if supported by funding or partnerships.

---

## Disclaimer

GiveBlood is not a medical provider and does not facilitate medical procedures. It serves solely as a coordination platform. All blood donation activities must follow local laws and medical guidelines.

---

## Author

**Ariston Catipay**  
Software Engineer
