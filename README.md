
# 🚀 SniperThink 

Frontend app built with **React**, **Vite**, and **Tailwind CSS**.  
Includes Google OAuth integration and clean module structure.

---

## ⚙️ Features

- 🔥 Vite-powered fast bundling and dev server  
- 🎨 Tailwind CSS utility-first styling  
- ✅ Google OAuth login using client ID  
- ✅ JWT decoding with `jwt-decode`  
- 📁 Path aliasing (`@` → `src`) for clean imports  
- 🚀 Optimized build setup for production

---


---

## 🖥️ Prerequisites

* Node.js v16 or higher
* npm or yarn

---

## 🛠️ Setup Instructions

1. **Clone the repo**:

```bash
git clone https://github.com/yourusername/your-frontend-repo.git
cd your-frontend-repo
```

2. **Install dependencies**:

```bash
npm install
# or
yarn
```

3. **Create `.env` file**:

```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

> ⚠️ **Do NOT include secrets like client secret in frontend!**
> Only public keys prefixed with `VITE_` can be safely used in Vite.

---

## 🧩 Vite Config (`vite.config.js`)

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  optimizeDeps: {
    include: ['jwt-decode'],  // Add this line
  },
})

```

---

## 🌐 Start Development

```bash
npm run dev
# or
yarn dev
```

Runs at: `http://localhost:5173`

---

## 🏗️ Build for Production

```bash
npm run build
# or
yarn build
```

Output goes to the `dist/` folder.

---

## 🌈 Styling with Tailwind

Already configured. Just use classes like:

```jsx
<div className="bg-[#1a6262] text-white p-4 rounded-xl shadow-md">SniperThink</div>
```

---

## 🧾 Scripts

```bash
npm run dev     # Start dev server
npm run build   # Production build
npm run preview # Preview production build
```

---

## 🚫 Don't Push

* `.env` file
* Actual secrets or credentials
* `dist/` folder

---



---


Thanks for using **SniperThink**

```


