# The Commerce - Developer Notes

## Commands

```bash
# Client (React + Vite)
cd client && npm run dev

# Backend (Express + TypeScript)
cd backend && npm run dev
```

## Tech Stack

- **Client**: React 19, Vite, Tailwind v4, React Router v7, shadcn/ui, Zustand, Clerk auth
- **Backend**: Express, TypeScript, Mongoose, Zod, Clerk

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── admin/        # Admin-specific components (sidebar, etc.)
│   │   ├── auth/         # Auth layouts (ProtectedLayout, RoleGaurdLayout)
│   │   ├── customer/     # Customer-facing components
│   │   ├── layout/       # Page layouts (AdminLayout, CustomerLayout)
│   │   └── ui/           # shadcn/ui components
│   ├── pages/
│   │   ├── admin/        # Admin pages (AdminDashboard, AdminProducts, etc.)
│   │   ├── auth/         # SignInPage, SignUpPage
│   │   └── customer/     # Customer pages
│   ├── features/         # Feature modules (auth, products, etc.)
│   ├── lib/              # Utilities (api, env, utils)
│   ├── router.tsx        # Route definitions
│   └── main.tsx          # Entry point

backend/
├── src/
│   ├── routes/           # API routes
│   ├── middleware/       # Express middleware
│   ├── models/          # Mongoose models
│   ├── utils/            # Utilities
│   └── server.ts        # Entry point
```

## Admin Panel

- Admin routes start at `/admin` (protected, requires `admin` role)
- Layout: `client/src/components/layout/AdminLayout.tsx`
- UI Components: `client/src/components/admin/` (sidebar, dashboard, etc.)
- Pages: `client/src/pages/admin/` (imports from components/admin/)

## Adding New Admin Pages

1. Create component in `client/src/components/admin/`
2. Create page in `client/src/pages/admin/` (imports component, thin wrapper)
3. Add route in `client/src/router.tsx` under AdminLayout children
4. Add nav link in `adminSidebar.tsx`

## shadcn/ui Components

Add new components via:
```bash
cd client && npx shadcn@latest add <component-name>
```

Existing: button, dropdown-menu, separator, sheet, card, table, badge, input, label, select, textarea, dialog
