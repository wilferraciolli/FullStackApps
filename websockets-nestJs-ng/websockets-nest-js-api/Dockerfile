# Base image - Node 20 is recommended for Nest 11
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app source
COPY . .

# Build the application
RUN npm run build

# Remove development dependencies
RUN npm prune --production

# Expose ports
EXPOSE 3001

# Command to run the app
CMD ["node", "dist/main"]
