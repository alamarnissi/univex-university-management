# Use Node.js 18 runtime as the base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Expose the port on which your Next.js app will run
EXPOSE 3000
ENV HOST 0.0.0.0
ENV NODE_ENV production
# EXPOSE 3000

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install 
# RUN npm ci --omit=dev

# Copy the source code to the working directory
COPY . .

# Build the Next.js app
RUN npm run build

# Start the Next.js app
CMD [ "npm", "start" ]

