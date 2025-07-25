# The Great Estimation

**The Great Estimation** is a reimagined version of a feature I originally built at my previous job, where the production app lives behind a company login. To make the work publicly visible and better aligned with modern frontend stacks, I recreated it using **React** and modern tooling.

This project demonstrates my ability to translate real-world business logic and UI/UX patterns into a polished, interactive frontend experience — this time, in a modern, React-based environment.

---

## Tech Stack

- **Framework**: [React](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Heroicons](https://heroicons.com/)

## Tech Stack

- **Next.js** – UI library
- **Vite** – fast, modern build tool for local development and production
- **TypeScript** – safer, predictable code
- **Tailwind CSS** – utility-first styling
- **Radix UI** – accessible, unstyled component primitives
- **Icons** – simple, clean icon set to pair seamlessly with Tailwind

---

## Deployment

Originally conceived as a static app, the project was built using Vite for optimal performance and quick iteration. Later, I decided to also introduce a simple API endpoint to serve initial data to the app. As a result, **The Great Estimation is deployed as a static frontend with a serverless API**, reflecting a modern hybrid architecture.

Deployment is handled via **Vercel**, which supports both static assets and serverless functions.

---

## Purpose

This project was rebuilt to:

- Showcase work I couldn’t share due to company access restrictions
- Highlight my frontend engineering skills using React and Tailwind
- Demonstrate the ability to design and build interactive, data-driven UIs
- Reflect a real-world project structure using serverless functions for basic API interaction

---

## Current Progress

All components have been scaffolded and styled. The layout and structure reflect the core flow of the original feature. What's left is wiring everything up for interaction.

---

## What's Next

- [ ] Add a simple API for data handling (create, read, update, delete)
- [ ] Add functionality to **create a new order**
- [ ] Enable editing and updating an existing order
- [ ] Add ability to **add/edit/delete line items**
- [ ] Make the **slider interactive** for real-time adjustment
- [ ] Add a way to **export page data to CSV**
- [ ] Hook up all forms and controls to actual state and validation

---

## Live Demo

👉 [Link to deployed app](https://the-great-estimation.vercel.app/)

---

## Notes

- The original implementation was done in **Ruby on Rails**, but this version was reimplemented in **React** to reflect my current focus on frontend development.
- The data loaded via the API is static and used to simulate loading behavior and state management.
