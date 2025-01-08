# univex_frontend

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Follow the instructions below to get the project up and running on your local machine.

### Local Development

1. **Prerequisites**: Ensure that you have the following software installed on your machine:
   - Node.js (version 18 or higher)
   - npm 

2. **Clone the repository**: 
  ```
  git clone https://github.com/alamarnissi/univex-university-management
  ```
3. **Navigate to the project directory**: 
  ```
  cd project-name
  ```
4. **Install dependencies**: 
  ```
  npm install
  ```
5. **Start the development server**: 
  ```
  npm run dev
  ```
  
The application should now be running locally at `http://localhost:3000`.

### Dockerization

1. **Prerequisites**: Ensure that you have Docker installed on your machine. If not, you can download it from the official Docker website: [https://www.docker.com/](https://www.docker.com/).

2. **Build the Docker image**:
- Open a terminal or command prompt.
- Navigate to the project directory: 
  ```
  cd project-name
  ```
- Build the Docker image: 
  ```
  docker build -t project-name .
  ```

3. **Run the Docker container**:
- Start the Docker container:
  ```
  docker run -p 3000:3000 project-name
  ```

The application should now be running inside a Docker container at `http://localhost:3000`.
