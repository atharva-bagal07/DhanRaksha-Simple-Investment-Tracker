# How to Run DhanRaksha Locally

This guide explains how to run the DhanRaksha investment tracker on your local machine using **Vite**, a modern and fast build tool for React applications.

## Prerequisites

1.  **Node.js**: You need Node.js installed on your computer.
    *   Download and install the LTS version from [nodejs.org](https://nodejs.org/).
    *   Verify installation by running `node -v` and `npm -v` in your terminal.

## Step 1: Create a New Project

Open your terminal (Command Prompt, PowerShell, or Terminal) and run the following command to create a new React project with TypeScript support:

```bash
npm create vite@latest dhanraksha-app -- --template react-ts
```

## Step 2: Install Dependencies

Navigate into your new project folder and install the required libraries.

1.  Move into the project directory:
    ```bash
    cd dhanraksha-app
    ```

2.  Install the core dependencies (React is already included, but we need the icons library):
    ```bash
    npm install lucide-react
    ```

    *Note: The app uses Tailwind CSS via a CDN link in the HTML, so you don't need to install it via npm for this simple setup.*

## Step 3: Organize Your Files

You need to copy the files provided in this app into the correct structure within your new `dhanraksha-app` folder.

1.  **Clear the default files:**
    Delete the contents of the `src/` folder (except `vite-env.d.ts` if you want to keep type definitions, but it's safe to clear everything for now).

2.  **Create the directory structure** inside `src/`:
    *   `src/components/`
    *   `src/services/`
    *   `src/utils/`

3.  **Copy the code:**
    Create the files and paste the code provided in the app:

    *   **Root `src/` files:**
        *   `src/App.tsx`
        *   `src/index.tsx` (Note: You might want to rename this to `main.tsx` to match Vite's default, or update index.html. See Step 4).
        *   `src/types.ts`
    
    *   **Components (`src/components/`):**
        *   `src/components/Layout.tsx`
        *   `src/components/Dashboard.tsx`
        *   `src/components/Upcoming.tsx`
        *   `src/components/AddInvestmentForm.tsx`
        *   `src/components/InvestmentCard.tsx`

    *   **Services (`src/services/`):**
        *   `src/services/storageService.ts`

    *   **Utils (`src/utils/`):**
        *   `src/utils/dateUtils.ts`

## Step 4: Configure the Entry Point

Vite uses an `index.html` file located in the **project root** (outside `src/`).

1.  Open the `index.html` file in your project root.
2.  Replace its content with the `index.html` provided in this app.
3.  **Crucial Step:** You must add a script tag pointing to your React entry file inside the `<body>`.
    
    Find this line in the provided `index.html`:
    ```html
    <div id="root"></div>
    ```
    
    Add this line immediately after it:
    ```html
    <script type="module" src="/src/index.tsx"></script>
    ```
    
    *(If you named your entry file `main.tsx`, change the src to `/src/main.tsx`)*.

4.  **Clean up:** You can remove the `<script type="importmap">...</script>` block from `index.html` if you are running locally via Vite, as Vite handles the imports for you. However, keeping it doesn't hurt.

## Step 5: Run the App

Now you are ready to start the server.

1.  Run the development server:
    ```bash
    npm run dev
    ```

2.  The terminal will show a local URL (usually `http://localhost:5173/`).
3.  Open that URL in your browser to use the app!

## Troubleshooting

*   **"React is not defined"**: Ensure you have `import React from 'react'` at the top of your `.tsx` files.
*   **Tailwind not working**: Make sure the `<script src="https://cdn.tailwindcss.com"></script>` tag is present in your `head` section of `index.html`.
*   **Calendar not opening**: The custom date picker relies on standard browser features. It works best in Chrome, Edge, and Safari.
