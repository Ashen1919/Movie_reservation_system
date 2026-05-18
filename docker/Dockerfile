# stage 1 - build

# Use an official Node.js image as the base image for the build stage
FROM node:24-alpine3.22 AS builder

# Set the working directory in the container
WORKDIR /app

# Copy the package.json, package-lock.json, tsconfig.json, and prisma directory to the working directory
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma

# Install the dependencies using npm ci
RUN npm ci --ignore-scripts

# Generate the Prisma client
RUN npx prisma generate

# Copy the source code to the working directory
COPY src ./src

# Build the TypeScript code
RUN npm run build

# ---------------------------------------------------------------------------------------------

# stage 2 - production

# Use a smaller Node.js image for the production stage
FROM node:24-alpine3.22 AS production

# Set the working directory in the container
WORKDIR /app

# set environment variable for production
ENV NODE_ENV=production

# create a group & user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install only production dependencies 
RUN npm ci --omit=dev --ignore-scripts

# Copy the built application from the builder stage to the production stage
COPY --from=builder /app/dist ./dist

# Copy the Prisma client from the builder stage to the production stage
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Copy the prisma directory to the production stage
COPY prisma ./prisma

# Copy the docker-entrypoint.sh script to the working directory
COPY docker/docker-entrypoint.sh ./

# Copy the prisma.config.ts file to the working directory
COPY prisma.config.ts ./

# Change ownership of the application files to the non-root user
RUN chown -R appuser:appgroup /app && \
    chmod -R 750 /app

# Switch to the non-root user
USER appuser

# Expose the port that the application will run on
EXPOSE 3000

# Set the command to run the application using the docker-entrypoint.sh script
CMD [ "./docker-entrypoint.sh" ]