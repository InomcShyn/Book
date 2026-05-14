# Multi-stage build for SMS Gateway CMS
# Stage 1: Build the React application
FROM node:18.20.8-alpine AS build

ARG NODE_ENV=staging
ARG PRODUCTION=false
ARG HTTP_PROXY
ARG HTTPS_PROXY
ARG NO_PROXY
ARG VITE_API_BASE_URL
# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
# Configure npm with proxy settings for production builds
RUN if [ "${PRODUCTION}" = "true" ] && [ -n "${HTTP_PROXY}" ]; then \
        npm config set proxy ${HTTP_PROXY} && \
        npm config set https-proxy ${HTTPS_PROXY} && \
        if [ -n "${NO_PROXY}" ]; then npm config set noproxy "${NO_PROXY}"; fi; \
    fi;

# Install dependencies
RUN npm ci

# Copy source code
COPY . .
RUN if [ "${PRODUCTION}" = "true" ]; then \
        rm -f .env || true; \
        mv .env.prod .env; \
        export HTTP_PROXY=${HTTP_PROXY}; \
        export HTTPS_PROXY=${HTTPS_PROXY}; \
        export NO_PROXY=${NO_PROXY}; \
    else \
        rm -f .env || true; \
        mv .env.staging .env; \
    fi
# Build the application

RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:1.25-alpine AS production

# Remove default Nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy built application from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Health check using wget (available in alpine)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

# Start the application
CMD ["nginx", "-g", "daemon off;"]
