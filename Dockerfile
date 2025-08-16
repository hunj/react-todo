# Use node alpine as it's a small node image
FROM node:alpine as build

# fuck off
ENV NEXT_TELEMETRY_DISABLED 1

# Create the directory on the node image 
# where our Next.js app will live
RUN mkdir -p /web

# Set /app as the working directory
WORKDIR /web

# Copy package.json
# to the /app working directory
COPY ./web/package.json /web
COPY ./web/package-lock.json /web

# Install dependencies in /app
RUN npm ci

# Copy the rest of our Next.js folder into /app
COPY web /web

# determine whether to run npm run build or npm run dev from argument - passed from docker-compose.yml
ARG BUILD_DEVELOPMENT=production
ENV NODE_ENV=$BUILD_DEVELOPMENT

# whether to npm run build or nah
RUN if [ "$NODE_ENV" = "production" ]; \
    then npm run build; \
    fi

# Ensure port 3000 is accessible to our system
EXPOSE 3000

# CMD gets overridden if docker-compose defines `command`
CMD ["npm", "start"]
