# School Management CRM

A decoupled **School CRM** for managing the full sales pipeline: schools, contacts, field visits, customer follow-ups, and tasks. The system uses a **Laravel REST API** as the business core and a **Next.js admin dashboard** as the client application.

> For system design details, see [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Backend API** | PHP ^8.2, Laravel ^12.0, Laravel Sanctum ^4.0 |
| **Frontend SPA** | Next.js ^16, React ^19, TypeScript ^5.9 |
| **Database** | MySQL (recommended) · SQLite supported for quick local setup |
| **Styling** | Tailwind CSS ^4 |
| **HTTP Client** | Axios |

---

## Prerequisites

Install the following before setting up the project:

| Software | Minimum Version |
|----------|-----------------|
| [Git](https://git-scm.com/) | Latest stable |
| [PHP](https://www.php.net/) | 8.2+ (with extensions: `mbstring`, `openssl`, `pdo`, `tokenizer`, `xml`, `ctype`, `json`, `bcmath`) |
| [Composer](https://getcomposer.org/) | 2.x |
| [Node.js](https://nodejs.org/) | 20.x LTS (includes npm) |
| [MySQL](https://www.mysql.com/) | 8.0+ (or MariaDB 10.x) |

---

## Installation

### 1. Clone the repository

```bash
git clone <https://github.com/asmaamohameed/School-mangement-system.git>
cd School-mangement-system
```

### 2. Backend setup

```bash
cd Backend
composer install
cp .env.example .env
php artisan key:generate
```

### 3. Frontend setup

Open a new terminal from the project root:

```bash
cd Frontend
npm install
```

---

## Configuration

### Backend — `Backend/.env`

Copy the example file (if not done already) and configure the core variables:

```bash
cd Backend
cp .env.example .env
php artisan key:generate
```

#### Application

```env
APP_NAME="Inspire Education"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000
```

#### MySQL (recommended)

Create a database, then update `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=inspire_edu_db
DB_USERNAME=root
DB_PASSWORD=your_password
```

#### SQLite (quick local alternative)

The default `.env.example` uses SQLite. To use it, ensure the file exists:

```bash
touch database/database.sqlite
```

```env
DB_CONNECTION=sqlite
# DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD — leave commented
```

### Frontend — `Frontend/.env.local`

Create a local environment file in the `Frontend` directory:

```bash
cd Frontend
```

Create `Frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

This tells the Axios client where the Laravel API is running. If omitted, the frontend falls back to `http://127.0.0.1:8000/api`.

---

## Running the Application

Run the **Backend** and **Frontend** in separate terminals.

### Terminal 1 — Laravel API

```bash
cd Backend
php artisan migrate:fresh --seed
php artisan serve
```

The API will be available at **http://127.0.0.1:8000**.

> **Warning:** `migrate:fresh --seed` drops all tables and re-seeds demo data. Use only in local development.

### Terminal 2 — Next.js dashboard

```bash
cd Frontend
npm run dev
```

The admin UI will be available at **http://localhost:3000**.

Sign in at **http://localhost:3000/signin**.

---

## Demo Accounts

After seeding, use these credentials (password for all accounts: `password123`):

| Role | Email | Dashboard access |
|------|-------|------------------|
| Admin | `admin@inspire.com` | Full portfolio stats |
| Sales Rep | `sales@inspire.com` | Visits & leads |
| Customer Service | `cs@inspire.com` | Pending follow-ups |

---
## API Testing (Bruno Collection)

The project includes a pre-configured **Bruno Collection** located in the `/School collection` directory. You can open Bruno, select "Open Collection", and point to this folder to instantly access and test all endpoints (Auth, Schools, Contacts, Visits, Tasks, and Dashboard) with real-world payloads.

## Project Structure

```
School-mangement-system/
├── Backend/          # Laravel 12 REST API
├── Frontend/         # Next.js admin SPA
├── ARCHITECTURE.md   # Technical architecture document
└── README.md         # This file
```

