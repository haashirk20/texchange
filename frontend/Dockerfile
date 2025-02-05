# Use Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install --omit=dev

# Copy the rest of the application code
COPY . .

# Build the frontend
RUN npm run build

# Install a simple HTTP server
RUN npm install -g serve

# Expose the port
EXPOSE 3000

# Start the frontend using `serve`
CMD ["serve", "-s", "build", "-l", "3000"]