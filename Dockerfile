# Base image
FROM node:20-alpine

# Create app directory
WORKDIR /usr/pml

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Export Environment
RUN export APP_PORT=4890
RUN export APP_NAME=Pmlu

# Install app dependencies
RUN npm install --legacy-peer-deps

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build

# Start the server using the production build
CMD [ "node", "dist/main.js" ]