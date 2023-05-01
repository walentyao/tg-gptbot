FROM node:alpine
WORKDIR /usr/app
COPY package.json .
RUN npm install && npm install -D && npm install typescript -g
COPY . .
RUN tsc
CMD ["node", "./dist/app.js"]