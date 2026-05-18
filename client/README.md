# 🚀 Client

A modern, full-featured React web application built with **Vite**, **TypeScript**, and a powerful UI stack.

---

## 🧱 Tech Stack

| Category | Technology |
|---|---|
| ⚡ Build Tool | Vite 8 |
| ⚛️ UI Library | React 19 |
| 🔷 Language | TypeScript 6 |
| 🎨 Styling | Tailwind CSS 4 |
| 🧩 Components | shadcn/ui + Radix UI |
| 🔐 Auth | Clerk |
| 🗺️ Routing | React Router 7 |
| 🗃️ State | Zustand |
| 🌐 HTTP | Axios |
| 🌙 Theming | next-themes |
| 🔔 Toasts | Sonner |
| 🖼️ Icons | Lucide React |

---

## 📦 Prerequisites

- **Node.js** v20+
- **npm** 

---

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo/client
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root of the `client` directory:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_BASE_URL=http://localhost:5000/api
```

> 💡 Get your Clerk publishable key from the [Clerk Dashboard](https://dashboard.clerk.com/).

### 4. Start the development server

```bash
npm run dev
```

The app will be available at **http://localhost:5173**

---

## 📜 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint on the codebase |

---

## 📁 Project Structure

```
client/
├── public/             # Static assets
├── src/
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # Reusable UI components
│   │   └── ui/         # shadcn/ui components
│   ├── features/       # business logic
│   ├── lib/            # Utility functions (cn, axios instance,api etc.)
│   ├── pages/          # Route-level page components
│   ├── store/          # Zustand state stores
│   ├── types/          # TypeScript type definitions
│   ├── App.tsx         # Root component with routing
│   └── main.tsx        # App entry point
├── .env                # Environment variables (not committed)
├── index.html
├── tsconfig.json
└── vite.config.ts
```

---

## 🎨 UI & Theming

- **shadcn/ui** components are located in `src/components/ui/`
- **Tailwind CSS v4** is used for utility-first styling via the `@tailwindcss/vite` plugin
- **next-themes** handles dark/light mode switching
- **tw-animate-css** provides animation utilities
- **Sonner** is used for toast notifications
---

## 🗃️ State Management

Global state is managed with **Zustand**. Stores are located in `src/store/`.


## 🌐 API Calls

HTTP requests are made using **Axios**. It is recommended to create a centralized Axios instance:


## 🚢 Building for Production

```bash
npm run build
```

Output will be in the `dist/` directory. You can then deploy it to any static hosting service (Vercel, Netlify, etc.).

---

## 🤝 Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Make your changes and commit: `git commit -m 'feat: add your feature'`
4. Push to your branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](../LICENSE).
