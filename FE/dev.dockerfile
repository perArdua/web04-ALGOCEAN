# Use Node 20 as the base image for the builder stage
FROM node:20 AS builder

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the React application
RUN npm run build

# Use Nginx as the base image for the production stage
FROM nginx:alpine

# Remove the default Nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Copy the built React application from the builder stage to Nginx's web root
COPY --from=builder /app/. /usr/share/nginx/html

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d

# Expose port 80
EXPOSE 80

# Override the entrypoint and start Nginx
CMD ["nginx", "-g", "daemon off;"]
