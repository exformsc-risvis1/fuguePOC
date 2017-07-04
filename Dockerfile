FROM node:8-alpine
WORKDIR /usr/src/app
ADD ./app /usr/src/app/
RUN npm install express
CMD [ "node", "index.js" ]
