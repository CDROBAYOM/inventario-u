# Stage 1: Build the Angular application
FROM node:20-alpine as build

WORKDIR /usr/src/app
RUN chmod 777 /usr/src/app # Da permisos de lectura, escritura y ejecución a todos

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application
FROM nginx:alpine

# Copy the built application from the build stage
COPY --from=build /usr/src/app/dist/myapp/browser /usr/share/nginx/html

# Copy custom nginx config if needed
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8080
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 