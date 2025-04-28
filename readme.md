# JSON Formatter & Diff Tool

A Web app that provides **JSON Formatting** and **JSON Diff Comparison** in one simple, static tool. Built with Vanilla JS and TailwindCSS.

## Project Status

This project implements the core features outlined below. It consists of two main pages:

-   `/index.html`: JSON Diff Comparison tool and landing page.
-   `/formatter.html`: JSON Formatter tool.

## Features Implemented

-   **JSON Formatter (`/formatter.html`)**:
    -   Pretty format raw JSON.
    -   Validate invalid JSON and show clean error messages (including approximate location).
    -   Minify JSON.
    -   Copy formatted/minified JSON to clipboard.
    -   Download formatted/minified JSON as a `.json` file.
    -   Option to auto-format JSON on paste.
-   **JSON Diff (`/index.html`)**:
    -   Compare two JSON objects semantically.
    -   Visually highlights added, removed, and changed fields using color-coding.
    -   Copy diff results to clipboard.
-   **General**:
    -   Dark Mode toggle (manual toggle + respects system preference initially).
    -   Mobile Responsive design (basic responsiveness via Tailwind).
    -   Clean, minimal UI using TailwindCSS.
    -   Basic SEO meta tags and Schema markup included.
    -   Placeholder for future monetization upsell.
    -   Pure frontend application, no backend required.

## How to Run

This is a purely static web application. No build process or server is required.

1.  Clone or download the project files.
2.  Open the `index.html` file directly in your web browser (e.g., by double-clicking it or using `File > Open` in your browser).
3.  Navigate between the Diff tool (`index.html`) and the Formatter tool (`formatter.html`) using the links in the navigation bar.

## Technology Stack

-   **HTML**: Structure and content.
-   **CSS**: Custom styles for diff highlighting (`style.css`).
-   **TailwindCSS (via CDN)**: Utility-first CSS framework for styling and layout.
-   **Vanilla JavaScript**: For all client-side logic, including:
    -   JSON parsing, formatting, validation, minification.
    -   Semantic JSON diffing algorithm.
    -   DOM manipulation.
    -   Event handling (button clicks, paste, etc.).
    -   Dark mode toggling and persistence (localStorage).
    -   Clipboard interaction.
    -   File download generation.

---

