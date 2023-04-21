# Use the official Node.js image as the base image
FROM node:16

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
#RUN npm ci --only=production
RUN npm install

# Copy the rest of the application code
COPY .env .
COPY prisma .

# Build the Next.js app
# RUN npm run build

# Expose the port the app will run on

# Start the app
# CMD ["npm", "run", "start"]
RUN npx prisma generate

EXPOSE 3000
