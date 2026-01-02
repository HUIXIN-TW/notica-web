# Copilot Instructions for Notica

## Overview

This repository contains two main components:

1. **Notica Web**: A Next.js-based frontend for managing Notion and Google Calendar integrations.
2. **Notica Backend**: A NestJS-based backend API for authentication, OAuth integrations, and data synchronization.

## Architecture Highlights

### Notica Web

- **Framework**: Next.js with React.
- **Key Directories**:
  - `src/app/`: Contains the main application pages and layouts.
  - `src/components/`: Reusable UI components.
  - `src/hooks/`: Custom React hooks for shared logic.
  - `src/utils/`: Utility functions for client, server, and shared logic.
- **Styling**: CSS Modules (e.g., `page.module.css`).
- **Build & Run**:
  - Development: `npm run dev`
  - Production Build: `npm run build`
  - Start Production: `npm start`

### Notica Backend

- **Framework**: NestJS with TypeScript.
- **Key Modules**:
  - `auth/`: Handles JWT and OAuth authentication.
  - `integration/`: Manages Google Calendar and Notion integrations.
  - `sync/`: Orchestrates background sync jobs using AWS SQS.
  - `common/`: Shared utilities, guards, and decorators.
- **Database**: AWS DynamoDB for user and token storage.
- **Queue**: AWS SQS for background job processing.
- **Build & Run**:
  - Development: `npm run start:dev`
  - Production Build: `npm run build`
  - Start Production: `npm run start:prod`

## Developer Workflows

### Setting Up the Environment

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up environment variables:
   - Copy `.env.example` to `.env`.
   - Populate required variables (see `README.md` for details).

### Running Tests

- **Frontend**:
  ```bash
  npm run test
  ```
- **Backend**:
  ```bash
  npm run test
  ```

### Debugging

- Use `console.log` or `debug` for logging.
- Backend debugging can be done using the NestJS CLI or VS Code debugger.

## Project-Specific Conventions

- **Frontend**:
  - Use `src/components/` for reusable UI elements.
  - Use `src/hooks/` for shared logic.
  - Follow Next.js file-based routing conventions.
- **Backend**:
  - Use DTOs for input validation.
  - Use guards for role-based access control.
  - Use AWS DynamoDB for persistence.

## External Dependencies

- **Frontend**:
  - Notion API
  - Google Calendar API
- **Backend**:
  - AWS DynamoDB
  - AWS SQS
  - Google OAuth
  - Notion OAuth

## Examples

### Adding a New Page (Frontend)

1. Create a new file in `src/app/` (e.g., `new-page.jsx`).
2. Add the corresponding CSS module in `src/app/` (e.g., `new-page.module.css`).
3. Export the page component.

### Adding a New Endpoint (Backend)

1. Create a new controller in the appropriate module (e.g., `src/auth/`).
2. Define the route and handler method.
3. Use DTOs for input validation.
4. Add unit tests in the `__tests__/` directory.

---

For more details, refer to the `README.md` files in the respective directories.
