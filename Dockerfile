FROM node:alpine

WORKDIR /app

COPY . .

RUN npm i 
EXPOSE 3500
CMD [ "npm","run","dev" ]
