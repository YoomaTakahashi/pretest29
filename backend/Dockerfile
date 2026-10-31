FROM node:22
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD [ "npx","-y","nodemon","-L","index.js" ]


# FROM node:22
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# EXPOSE 3000
# CMD [ "npm","run","dev","--","--","0.0.0.0" ]