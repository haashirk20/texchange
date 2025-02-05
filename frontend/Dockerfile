# Use a Node.js base image
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the project files
COPY . .

# Build the React app
RUN npm run build

# Use Nginx to serve the built React app
FROM nginx:stable-alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 5000
CMD ["nginx", "-g", "daemon off;"]