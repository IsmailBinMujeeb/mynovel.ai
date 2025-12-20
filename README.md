[About Repo](#mynovel.ai) [Local Setup](#installation) [Features](#features) [Tech Stack](#tech-stack)

![mynovel.ai](./assets/mynovel_ai.png)

# mynovel.ai

mynovel.ai is an AI-powered tool that helps writers generate novel chapters using just three inputs:

- Novel plot
- Novel context
- A short chapter prompt

You don’t need to outline every detail or write long instructions, just describe the direction of the chapter, and mynovel.ai takes care of the rest.

# Features

- Generate full novel chapters from minimal input with streaming.
- Context-aware chapter writing for narrative consistency
- Fast, clean, and modern UI
- Beautiful, responsive design with Tailwind & shadcn/ui
- Fully written in TypeScript (frontend (React) + backend (Motia))

# Tech Stack

- Motia
- MongoDB
- TypeScript
- React.js
- Tailwind
- ShadCN
- pnpm (package manager)

# Installation

## Clone the repository
```
git clone https://github.com/IsmailBinMujeeb/mynovel.ai.git
cd mynovel.ai
```

## Install dependencies
```
pnpm run install
```

## Environment Variables

```
cp .env.sample .env
// or windows
copy .env.sample .env
```

```env
MONGO_DB_URI="mongodb://localhost:27017/mynovel"

ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=

GEMINI_API_KEY=

```

## Run the application
```
pnpm run dev
```

> Motia backend will be started on `http://localhost:3000` and frontend on `http://localhost:5173`
