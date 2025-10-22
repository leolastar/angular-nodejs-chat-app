
FROM node:20-alpine

WORKDIR /app

COPY ./server/package.json ./server/package-lock.json /app

RUN yarn install

RUN npm install --only=production

RUN npm install typescript --save-dev

# Bundle app source
COPY ./server .

EXPOSE 4000

CMD [ "npm", "start","--port", "4000" ]
