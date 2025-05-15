# Timesheet Backend

A robust backend system for managing employee timesheets, built with NestJS and TypeScript.

## Features

- 🔐 Authentication & Authorization

  - JWT-based authentication
  - Role-based access control (RBAC)
  - Refresh token mechanism

- 👥 User Management

  - User registration and profile management
  - Position and level management
  - Branch management

- 📊 Timesheet Management

  - Time tracking and logging
  - Task management
  - Project tracking
  - Overtime management

- 📝 Request Management

  - Leave requests
  - Other employee requests

- 🖼️ File Management
  - Cloudinary integration for file uploads
  - Image processing

## Tech Stack

- **Framework:** NestJS
- **Language:** TypeScript
- **Database:** PostgreSQL with TypeORM
- **Authentication:** Passport.js, JWT
- **File Storage:** Cloudinary
- **Security:** Helmet, Rate Limiting
- **Logging:** Winston
- **Validation:** Class Validator, Joi

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd timesheet-backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and configure your environment variables:

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password
DATABASE_NAME=timesheet_db

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRATION=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. Run database migrations:

```bash
npm run typeorm migration:run
```

## Running the Application

### Development

```bash
npm run start:dev
```

### Production

```bash
npm run build
npm run start:prod
```

## API Documentation

The API documentation is available at `/api` when running the application.

## Testing

```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Project Structure

```
src/
├── common/           # Common utilities and helpers
├── config/           # Configuration files
├── database/         # Database configuration
├── migrations/       # Database migrations
├── modules/          # Feature modules
│   ├── auth/         # Authentication
│   ├── users/        # User management
│   ├── timesheet/    # Timesheet management
│   ├── task/         # Task management
│   ├── project/      # Project management
│   ├── overtime/     # Overtime management
│   ├── request/      # Request management
│   ├── position/     # Position management
│   ├── level/        # Level management
│   ├── branch/       # Branch management
│   ├── rbac/         # Role-based access control
│   └── cloudinary/   # File upload management
└── main.ts           # Application entry point
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the UNLICENSED License.
