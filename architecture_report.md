# Project Architecture and Team Contribution Report: Sweet N Sugary

**Project Name:** Sweet N Sugary  
**Target Domain:** E-commerce / Bakery Management  
**Version:** 1.0.0  
**Date:** April 8, 2026  
**Document Status:** Final  

---

## 1. Executive Summary

**Sweet N Sugary** is a state-of-the-art e-commerce platform designed for a premium home bakery. Unlike traditional storefronts, the application bridges the gap between digital convenience and artisanal customization through two core innovations:

1.  **Interactive 3D Configurator:** A real-time rendering engine that allows customers to visualize their cakes in a 3D space before placing an order.
2.  **AI-Powered Translation:** Integration with Google’s Gemini 1.5 Flash model, enabling users to upload inspiration images that are automatically translated into 3D design parameters.

This architecture ensures a seamless, modern user experience while providing a robust back-office management system for bakery operations.

---

## 2. System Architecture & Tech Stack

The application follows a modern **Full-Stack Next.js 14** architecture, prioritizing performance, SEO, and developer experience.

### Technical Stack Components
*   **Framework:** Next.js 14 (App Router) — Utilizing React Server Components (RSC) to minimize client-side JavaScript.
*   **3D Engine:** React Three Fiber (R3F) + @react-three/drei — A React-based abstraction of Three.js for high-performance WebGL rendering.
*   **AI Integration:** Google Gemini 1.5 Flash API — Leveraged for Vision analysis and structured JSON extraction.
*   **Database:** PostgreSQL (Hosted on Neon) — Serverless database architecture for high availability and relational integrity.
*   **Security:** Auth system utilizing JSON Web Tokens (JWT) stored in **HTTP-only cookies** for protection against XSS attacks.

### Server Action Data Flow
To ensure a secure and "zero-API" surface area, the application utilizes **Next.js Server Actions**. The data flow is structured as follows:

1.  **Client-Side State:** The 3D Configurator maintains a local state (flavor, tiers, toppings).
2.  **Mutation Trigger:** Upon checkout, the user triggers a Server Action (e.g., `saveCakeDesign`).
3.  **Secure Processing:** The Server Action executes on the server, where it:
    *   Verifies the user’s session via JWT.
    *   Applies bakery business logic (e.g., calculating delivery dates, verifying inventory).
    *   Performs database transactions.
4.  **Database Persistence:** Data is committed to the Neon PostgreSQL instance via a secure connection pool.
5.  **Reactive Feedback:** The client receives a typed response, allowing for immediate UI updates (e.g., "Order #1234 Placed Successfully").

---

## 3. Database Schema

The database is built on a relational PostgreSQL schema, optimized for transactional consistency and efficient retrieval for the Admin Dashboard.

### Core Relational Structure
*   **Users Table:** Manages accounts and roles (Admin vs. Customer). High-security bcrypt hashing is employed for password storage.
*   **Products Table:** Stores the menu catalog, including pricing, categories, and SEO metadata.
*   **Orders Table:** The central hub for commerce. Links `user_id` with transaction details, status (Pending, Baking, Ready, Completed), and delivery schedules.
*   **Custom Cake Builds Table:** Stores the UUID-linked 3D configurations, base flavors, and AI-generated metadata.
*   **Ingredients & Inventory Tables:** Tracks stock levels of essential ingredients, integrated with an `inventory_logs` table for supply chain auditing.

### Connection Strategy
The application utilizes the `pg` library with a **Connection Pooling** strategy. This minimizes latency by reusing existing database connections, which is critical for the serverless execution environment of Neon.

---

## 4. Division of Labor

The project was executed through a strategic split in responsibilities to ensure specialized expertise was applied to each critical layer of the application.

### Developer K (Krish): User Experience & Interactive Engine
*   **Interactive 3D Architecture:** Designed the component hierarchy for the R3F environment, ensuring performant rendering across mobile and desktop.
*   **R3F State Management:** Developed a complex state synchronization layer that translates UI controls into 3D geometry and material updates.
*   **Gemini AI Integration:** Implemented the vision pipeline that transmits image buffers to the Gemini API and parses the resulting JSON into the builder’s state.

### Developer M: Infrastructure & Security Specialist
*   **Next.js Infrastructure:** Architected the App Router structure, fonts, and global design system tokens.
*   **PostgreSQL Design:** Authored the relational schema, DDL migrations, and initial data seeding scripts.
*   **Server Actions & Mutations:** Engineered the backend logic for order processing, inventory management, and CRUD operations.
*   **Security & Admin Operations:** Implemented the JWT-based Auth system and the role-based Admin Dashboard featuring the Kanban order management system.

---

> [!NOTE]
> This architecture ensures that Sweet N Sugary is not just a website, but a robust business tool capable of scaling to meet high demand while maintaining a premium, boutique feel.
