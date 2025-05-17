
# Personal Budget Tracker

A simple, modular personal finance application built with Spring Boot and Microservices Architecture. This system helps individuals manage monthly budgets, track income and expenses, and visualize spending patterns using charts and summaries.


## Features

- Add income and expense entries
- Categorize transactions (e.g., Food, Transport, Rent)
- View monthly summaries and current balance
- Edit or delete past entries
- Visualize expenses using bar or pie charts


## Demo

[Let me try](https://se2-2025-personal-budget-tracker.vercel.app/)
## Tech Stack

**Backend:** Java, Spring Boot, REST APIs, Microservices

**Frontend:** Next.js, Redux, TailwindCSS

**Database:** PostgreSQL

## Microservices Architecture

This project is divided into loosely coupled services:

- `auth-service`: Login & registration with JWT and User profile management
- `budget-service`: Manages income and expenses, Handles category data, Prepares data for visual charts.
- `api-gateway-service`: Handles routing the request to the correct microservice.
- `eureka-service`: Enable services discover themselves.
- `config-service`: Centralized config.
- `frontend-app`: User interface for interacting with the system
## Run Locally

Clone the project

```bash
  git clone https://github.com/Ahmed-M-Aboutaleb/se2-2025-personal-budget-tracker.git
```

Go to the project directory

```bash
  cd se2-2025-personal-budget-tracker
```

Run docker compose

```bash
  docker compose up -d
```

This command will start the following services in order:

1. Run the config server
2. Run eureka server
3. Run the rest of the microservices.

### 🎉 Congratulations!

The application is now running locally and ready to use.
You can access the frontend UI (if available) or test the APIs via Postman or your preferred tool.
## Screenshots

![Image](https://github.com/user-attachments/assets/aa8da692-48fe-43ba-964b-7f4b00e4d271)

![Image](https://github.com/user-attachments/assets/a0a66a8c-d08d-41a3-ab06-4099cb389e37)

![Image](https://github.com/user-attachments/assets/65ab628e-7996-4361-a0d3-b6c630292db7)

![Image](https://github.com/user-attachments/assets/e482081e-5067-483e-bec7-6973d607ce94)

![Image](https://github.com/user-attachments/assets/5350ac26-7a66-461b-b162-66151463de46)

![Image](https://github.com/user-attachments/assets/b30a20c7-8278-4d74-9d66-fab4982ff104)

![Image](https://github.com/user-attachments/assets/1f849db6-e98f-43e3-a182-eea26dabfe01)

![Image](https://github.com/user-attachments/assets/5cb46e1f-d0d4-47ee-a21a-5d41bbdb9f31)

![Image](https://github.com/user-attachments/assets/d6415246-a4f6-4e61-857d-37262769b5ed)