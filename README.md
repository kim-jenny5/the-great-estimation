# The Great Estimation

**The Great Estimation** is a reimagined version of a feature I originally built at my previous job, where the production app lives behind a company login. To make the work publicly visible and better aligned with modern frontend stacks, I recreated it using **React** and modern tooling.

This project demonstrates my ability to translate real-world business logic and UI/UX patterns into a polished, interactive frontend experience — this time, in a modern, React-based environment.

## Tech Stack

- **Next.js** – React framework with support for serverless functions and route handling
- **TypeScript** – safer, predictable code
- **Tailwind CSS** – utility-first styling
- **Radix UI** – accessible, unstyled component primitives
- **Heroicons** - simple, clean icon set to pair seamlessly with Tailwind
- **Neon** – serverless Postgres database
- **Drizzle** - Typescript ORM used for schema and queries
- **Vercel** – seamless deployment for frontend and serverless API routes

## Architecture Notes

The project was initially scaffolded using Vite to enable quick iteration and performance-optimized local development. However, as the project grew in complexity, I migrated to Next.js to fully integrate with the Vercel ecosystem and take advantage of built-in routing, serverless functions, and hybrid rendering.

## Purpose

This project was rebuilt to:

- Showcase work I couldn’t share due to company access restrictions
- Highlight my frontend engineering skills using React, Typescript, and Tailwind
- Demonstrate the ability to design and build interactive, data-driven UIs
- Reflect a real-world project structure using serverless functions and a relational database

## Current Progress

All components have been scaffolded and styled. The layout and structure reflect the core flow of the original feature. What's left is wiring everything up for interaction.

## What's Next

- [ ] Migrate from Drizzle to Prisma for richer data relationships (`user.orders`, `order.lineItems`, etc.)
- [ ] Add a simple API for data handling (create, read, update, delete)
- [ ] Add functionality to create a new order
- [ ] Enable editing and updating an existing order
- [ ] Add ability to add/edit/delete line items
- [ ] Make the slider interactive for real-time adjustment
- [ ] Add a way to export page data to CSV
- [ ] Hook up all forms and controls to actual state and validation

## Notes

- The original implementation was done in **Ruby on Rails**, but this version was reimplemented in **React** and **Next.js** to reflect my current focus on frontend development.
- The data loaded via the API is static and used to simulate loading behavior and state management.
