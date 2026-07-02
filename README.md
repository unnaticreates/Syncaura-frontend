# Syncaura
Collaborative workspace platform that integrates project management, real-time chat, video meetings, and attendance tracking into one seamless, multi-role dashboard.

Syncaura connects multi-role interfaces (Admin, Co-Admin, and User) with global Redux state management, client-side input validations, custom toast styling, and a secure JWT-based API connection with automated token refreshes.

## Features
* **Multi-Role Workspaces**: Customized dashboards for Admins, Co-Admins, and Users.
* **Project & Task Management**: Interactive project boards and checklist todo trackers.
* **Real-Time Team Chat**: Threaded team chats designed for Socket.IO WebSockets.
* **Video Meetings**: Virtual video/audio conference scheduler and call panel.
* **Attendance & Leaves**: Log-in sheets and calendar leave request systems.
* **Document Vault**: Shared space to upload, organize, and preview files.
* **Notice Board**: Corporate bulletin board for publishing team notices.
* **Complaints Portal**: Portal for submitting and tracking workspace complaints.
* **Global Theme Engine**: Global dark/light mode toggle with theme memory.
* **JWT Interceptor Queue**: Handles access token injection and auto-refresh retry queues.
* **Styled Toast Alerts**: Visual error/success alerts styled using custom toast configs.

## Tech Stack
| Layer | Technology |
| :--- | :--- |
| **Frontend Core** | React (v19), Vite |
| **Styling & Theme** | Tailwind CSS, Lucide React, Framer Motion |
| **State Management** | Redux Toolkit |
| **Routing** | React Router Dom (v7) |
| **Network Client** | Axios |
| **Notifications** | React Toastify |
| **Form Validation** | React Hook Form |

## API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Authenticate user |
| POST | `/api/auth/logout` | Logout user |
| POST | `/api/auth/refresh` | Refresh access token |
| GET | `/api/auth/me` | Get current user profile |

---

## System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SYNCAURA CLIENT LAYER                           │
│                                                                        │
│  ┌───────────────────────┐  Validate Inputs  ┌──────────────────────┐  │
│  │   UI Components &     ├──────────────────>│   validationRules    │  │
│  │  Pages (SignIn/Up/etc)│                   └──────────────────────┘  │
│  └──────────┬────────────┘                                             │
│             │                                                          │
│             │ Dispatches Actions                                       │
│             ▼                                                          │
│  ┌───────────────────────┐  Selects State    ┌──────────────────────┐  │
│  │     Redux Store       │<──────────────────┤    Slices (Auth,     │  │
│  │ (Thunks & Operations) │                   │    Theme, Meet)      │  │
│  └──────────┬────────────┘                   └──────────────────────┘  │
│             │                                                          │
│             │ HTTP Requests / WebSockets                               │
│             ▼                                                          │
│  ┌───────────────────────┐                   ┌──────────────────────┐  │
│  │  Axios Client Wrapper │                   │  localStorage        │  │
│  │ (Request/Response)    │<─────────────────>│  (accessToken,       │  │
│  │  Interceptors         │   Read/Write JWT  │   refreshToken)      │  │
│  └──────────┬────────────┘                   └──────────────────────┘  │
└─────────────┼──────────────────────────────────────────────────────────┘
              │
              │ HTTP / WebSockets (Port 5000)
              ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        SYNCAURA SERVER LAYER                           │
│                                                                        │
│  ┌───────────────────────┐                   ┌──────────────────────┐  │
│  │  Express/Node Server  │<─────────────────>│   Socket.IO Server   │  │
│  │  (REST Controllers)   │                   │ (Real-time events)   │  │
│  └──────────┬────────────┘                   └──────────┬───────────┘  │
│             │                                           │              │
│             └───────────────────┬───────────────────────┘              │
│                                 ▼                                      │
│                      ┌──────────────────────┐                          │
│                      │  MongoDB Database    │                          │
│                      │ (User/Task Schemas)  │                          │
│                      └──────────────────────┘                          │
└────────────────────────────────────────────────────────────────────────┘
```

## Processing Workflow
1. **User Sign Up / Sign In**:
   * User enters credentials in the forms.
   * `validationRules` checks email structures, name requirements, and password length.
   * On validation success, an `authThunk` triggers the Axios wrapper.
2. **Authentication request**:
   * Request interceptor retrieves `accessToken` from `localStorage` (if present) and appends it to headers.
   * The backend validates credentials and returns a short-lived `accessToken` and a long-lived `refreshToken`.
3. **Session Synchronization**:
   * On response success, the thunk saves both tokens to `localStorage` and updates the global `authSlice` state.
   * The user is automatically routed to their dashboard based on their account role (Admin, Co-Admin, or default user).
4. **Session Token Refresh**:
   * When an API call fails with `401 Unauthorized` (token expired), the Axios response interceptor pauses the request queue.
   * It requests a new `accessToken` from `/auth/refresh` using the `refreshToken`.
   * **On Success**: Restarts all queued requests with the new token.
   * **On Failure**: Emits an `auth_session_expired` event, clears tokens, logs the user out, and redirects them to the Sign In screen.

## Cost-Efficient Architecture
* **Client-Side Validation**: catches format errors before hitting the network, saving server CPU cycles.
* **Request Queuing Interceptor**: Pauses outgoing calls during token refresh to avoid duplicate refresh calls.
* **Redux Selector Memoization**: Prevents unnecessary UI renders and keeps the app fast.

## Running the Application
1. Navigate to the project directory:
   ```bash
   cd Syncaura-frontend-1
   ```
2. Install the project dependencies:
   ```bash
   npm install
   ```
3. Run the Vite local development server:
   ```bash
   npm run dev
   ```


## Roadmap
- [ ] Connect the chat component with live WebSockets.
- [ ] Add Jitsi Meet video frames in the meeting dashboard.
- [ ] Integrate file upload logic in the document hub.
- [ ] Optimize the views for mobile screens.
- [ ] Add Progressive Web App (PWA) support for offline usage.
- [ ] Write frontend unit tests.

