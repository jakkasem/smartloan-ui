# smartloan-ui

Frontend สำหรับระบบ Loan Approval สร้างด้วย React + Vite

## Requirements

- Node.js 18+
- npm

## Setup

1. ติดตั้ง dependencies

```bash
npm install
```

2. สร้างไฟล์ `.env.local` สำหรับ override ค่าเฉพาะเครื่อง (optional)

```bash
# .env.local
VITE_API_BASE_URL=https://xxxx.ngrok-free.app
VITE_API_KEY=your-api-key
```

> ค่า default ของแต่ละ environment อยู่ใน `.env.development` และ `.env.production`

## Commands

### Development

รัน dev server (ใช้ค่าจาก `.env.development`)

```bash
npm run dev
```

เปิด browser ที่ `http://localhost:5173`

### Build

Build สำหรับ production (ใช้ค่าจาก `.env.production`)

```bash
npm run build
```

ไฟล์ output อยู่ที่โฟลเดอร์ `dist/`

### Preview

รัน preview จาก build ที่ได้

```bash
npm run preview
```

## Docker

Build image

```bash
docker build -t smartloan-ui .
```

รัน container

```bash
docker run -p 8080:8080 smartloan-ui
```

เปิด browser ที่ `http://localhost:8080`

## Environment Variables

| Variable | Description | Default (dev) |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL ของ backend API | `http://localhost:3000` |
| `VITE_API_KEY` | API Key สำหรับ authenticate | `smartloan-secret-key-2026` |
| `VITE_NGROK_SKIP_WARNING` | Header สำหรับ bypass ngrok warning | `69420` |
