# Use the official Node.js image with the specific version
FROM node:20.14.0

# Set the working directory in the container
WORKDIR /docker-game

# Copy package.json and package-lock.json
COPY package*.json ./

# Install the application's dependencies
RUN npm install

# Copy the entire project directory contents into the container
COPY . .

# Copy the .env file
COPY .env .env

# Expose the application port
EXPOSE 3000

# Run the application
CMD ["node", "app.js"]
