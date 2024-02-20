# OO Parking Lot
## Demo
[OO Parking Lot](https://oo-parking-lot-7b4o.vercel.app/)
<img width="1902" alt="image" src="https://github.com/glendell03/oo-parking-lot/assets/58845052/bbfe531a-b84c-47f6-9ff0-274c01d708ce">

## Overview
For this technical assessment, I chose to create a full-stack web application, as I believe that this approach would best showcase my programming and problem-solving skills, and it aligns with the real-world application of solving practical problems.

The application provides a visual representation of a parking lot, allowing users to view and manage parking spaces, entrances, and exits. It is designed to be user-friendly, with intuitive controls and clear visual feedback.

I selected a tech stack that I am comfortable with and that I believe is well-suited to the requirements of the project. 

The stack includes:

- Node.JS
- Typescript
- Next.JS (React)
- TRPC
- PrismaORM
- PostgreSQL
- TailwindCss
- Shadcn/ui
- zod

## Setup
1. Clone the repo
```console
  git clone git@github.com:glendell03/oo-parking-lot.git
```
2. Change directory to oo-parking-lot
```console
  cd oo-parking-lot
```
3. Create database
```sql
CREATE DATABASE oo_parking_lot;
```
4. Create .env.local
```env
NODE_ENV="development"

DATABASE_URL="postgresql://[user]:[password]@localhost:5432/[databasename]?schema=public"
```
5. Install dependencies
```console
  pnpm i
```
6. Run prisma migration
```console
  pnpm prisma migrate dev
```
7. Run prisma generate
```console
  pnpm prisma generate
```
8. Run prisma db seed
```console
  pnpm prisma db seed ./prisma/seeds/parkingLot.ts
  pnpm prisma db seed ./prisma/seeds/mallEntrance.ts 
```
9. Run local server
```console
  pnpm dev
```

## Visual Representation

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://github.com/glendell03/oo-parking-lot/assets/58845052/5d03688a-023f-430b-aa56-5a3613903cfd">
  <source media="(prefers-color-scheme: light)" srcset="https://github.com/glendell03/oo-parking-lot/assets/58845052/2f1d57d1-131e-44aa-86c2-df115d13c53e">
  <img alt="oo parking lot diagram" src="https://github.com/glendell03/oo-parking-lot/assets/58845052/2f1d57d1-131e-44aa-86c2-df115d13c53e">
</picture>
