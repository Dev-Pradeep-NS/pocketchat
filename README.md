
# Svelte + PocketBase Chat Application

A simple real-time chat application built with Svelte and PocketBase that includes user authentication and group chat functionality.

## Features

- User authentication (Login/Signup)
- Private messaging
- Group chat
- Real-time updates

## Prerequisites

- Node.js
- pnpm
- PocketBase

## Installation

1. Clone the repository:

git clone [your-repository-url]
cd [repository-name]


2. Install dependencies:

pnpm install


## Running the Application

1. Start the PocketBase server:

pnpm run pocketbase


2. Start the Svelte development server:

pnpm run dev


3. Open your browser and navigate to:

http://localhost:5173


## Project Structure


├── src/
│   ├── lib/
│   ├── routes/
│   └── app.html
├── static/
├── pb/
└── package.json


## Features Implementation

- Authentication using PocketBase's built-in auth system
- Real-time chat using PocketBase's realtime subscriptions
- Group chat functionality with multiple participants
- Message history persistence

## Tech Stack

- Svelte
- PocketBase

## License

MIT
