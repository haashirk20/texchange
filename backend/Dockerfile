# Use Node.js as the base image
FROM node:18-alpine
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the project files
COPY . .

# Expose the backend port
EXPOSE 5001
CMD ["node", "server.js"]