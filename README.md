# Feedback Tracker Backend

REST API built with Node.js, Express, MongoDB, and Mongoose.

## Folder Structure

```text
feedbackTracker/
├── Procfile
├── package.json
├── README.md
└── src/
    ├── app.js
    ├── server.js
    ├── config/
    │   └── db.js
    ├── controllers/
    │   ├── authController.js
    │   └── feedbackController.js
    ├── middleware/
    │   ├── authMiddleware.js
    │   ├── errorMiddleware.js
    │   └── loggerMiddleware.js
    ├── models/
    │   ├── Feedback.js
    │   └── User.js
    └── routes/
        ├── authRoutes.js
        └── feedbackRoutes.js
```

## Environment Variables

Create a `.env` file from `.env.example`.

Required variables:

- `PORT`
- `MONGO_URI`
- `JWT_SECRET`

## Install and Run

```bash
npm install
npm start
```

For development:

```bash
npm run dev
```

## API Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Feedback

- `POST /api/feedback`
- `GET /api/feedback`
- `GET /api/feedback/:id`
- `PUT /api/feedback/:id`
- `DELETE /api/feedback/:id`

## Sample Postman Bodies

### Register

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "Password123!"
}
```

### Login

```json
{
  "email": "jane@example.com",
  "password": "Password123!"
}
```

### Create Feedback

```json
{
  "title": "Great experience",
  "message": "The onboarding flow was smooth and clear.",
  "rating": 5
}
```

### Update Feedback

```json
{
  "title": "Updated title",
  "message": "Updated message",
  "rating": 4
}
```

## Deployment

### Render

1. Push the project to GitHub.
2. Create a new Web Service on Render.
3. Set the build command to `npm install`.
4. Set the start command to `npm start`.
5. Add environment variables for `PORT`, `MONGO_URI`, and `JWT_SECRET`.
6. Deploy.

### Heroku

1. Push the project to GitHub or deploy with the Heroku CLI.
2. Add config vars for `PORT`, `MONGO_URI`, and `JWT_SECRET`.
3. Ensure the `Procfile` exists with `web: npm start`.
4. Deploy the app.

## Notes

- Admin access is controlled through the `role` field on the user document.
- Set a user role to `admin` directly in MongoDB to enable admin-wide feedback access.
