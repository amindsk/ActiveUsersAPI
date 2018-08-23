# Using node:8 image to build
FROM node:8
# Creating a directory to hold the application code inside the image
WORKDIR /usr/src/app
# Using wildcard to make sure that both package.json AND package-lock.json are copied
COPY package*.json ./
# Installing required dependencies
RUN npm install
# Bundling app source
COPY . .
# Command to run the srver
CMD [ "npm", "start" ]
# Map the port by docker deamon
EXPOSE 3001