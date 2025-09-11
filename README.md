# Lucky Petshop

Lucky Petshop adalah website e-commerce modern untuk kebutuhan hewan peliharaan, dibangun menggunakan teknologi terbaru seperti Next.js, Prisma, tRPC, React Query, Tailwind CSS, dan Shadcn UI.

## Fitur Utama

- **Katalog produk** lengkap untuk hewan peliharaan
- **Keranjang belanja** dan checkout
- **Manajemen produk** (admin)
- **Autentikasi pengguna**
- **UI responsif** dan modern

## Teknologi yang Digunakan

- [Next.js](https://nextjs.org/)
- [Prisma ORM](https://www.prisma.io/)
- [tRPC](https://trpc.io/)
- [React Query](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Bun](https://bun.sh/) (opsional, untuk development)

---

## Setup Development

### 1. Prasyarat

- [Node.js](https://nodejs.org/) v18+
- [Bun](https://bun.sh/) (opsional, jika ingin menggunakan Bun)
- [Git](https://git-scm.com/)
- [PostgreSQL](https://www.postgresql.org/) atau database lain yang didukung Prisma
- [pnpm](https://pnpm.io/) (direkomendasikan) atau npm

### 2. Clone Repository

Buka terminal dan jalankan:

```bash
git clone REPOSITORY_URL
cd lucky-petshop
```

### 3. Install Dependencies

Menggunakan **pnpm** (direkomendasikan):

```bash
pnpm install
```

Atau menggunakan **npm**:

```bash
npm install
```

Atau menggunakan **bun**:

```bash
bun install
```

### 4. Konfigurasi Environment Variable

Salin file `.env.example` menjadi `.env` lalu sesuaikan isinya:

```bash
cp .env.example .env
```

Edit `.env` sesuai kebutuhan (database, API key, dsb).

### 5. Setup Database

Jalankan migrasi Prisma:

```bash
npx prisma migrate dev
```

Atau jika menggunakan Bun:

```bash
bunx prisma migrate dev
```

### 6. Jalankan Development Server

```bash
pnpm dev
# atau
npm run dev
# atau
bun run dev
```

Akses di [http://localhost:3000](http://localhost:3000)

---

## Deploy ke Production (Vercel)

1. **Push kode ke repository GitHub/GitLab**
2. **Buka [Vercel](https://vercel.com/) dan import repository**
3. **Atur environment variables** di dashboard Vercel sesuai `.env`
4. **Klik Deploy**

Vercel akan otomatis build dan deploy aplikasi Next.js Anda.

---

## Lisensi

MIT License

---

## Kontribusi

Pull request dan issue sangat diterima! Silakan fork repo ini dan buat perubahan yang diinginkan.
