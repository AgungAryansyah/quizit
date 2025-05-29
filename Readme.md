# Quizit

This guide will help you set up and run the Quizit application using Docker and Docker Compose.

## Prerequisites

* **Git:** You'll need Git installed to clone the repository.
* **Docker:** Ensure Docker is installed and running on your system. Download from [Docker's official website](https://www.docker.com/products/docker-desktop/).
* **Docker Compose:** Docker Compose is included with Docker Desktop for Windows and macOS. For Linux, install it separately if needed. See the [official installation guide](https://docs.docker.com/compose/install/).

## Setup Instructions

### 1. Clone the Repository

Open your terminal and run the following command to clone the repository to your local machine:

```bash
git clone https://github.com/AgungAryansyah/quizit.git
cd quizit
```

### 2. Set Up Environment Variables

The application uses environment variables for configuration, particularly for the database and backend settings. You can use the .env.exaple as a guide:

```bash
cp .env.exaple .env
```

### 3. Build and Run with Docker Compose
Once your .env file is configured:

a. Navigate to the root directory of the project (where docker-compose.yml is located) in your terminal.

b. Build and start the services:

```bash
docker-compose up --build -d
```

c. Wait for services to start

### 4. Accessing the Application
* Frontend (quizit-fe): Open your web browser and go to http://localhost:5173.
* Backend (quizit-be): Your backend API will be accessible at http://localhost:<APP_PORT>. The frontend is typically configured to make requests to this address.

### 5. Stopping the Application
```Bash
docker-compose down
```
This will stop and remove the containers and the network. Your PostgreSQL data will persist in the ./postgres_data volume unless you use the -v flag.
