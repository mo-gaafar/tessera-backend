FROM node:18-alpine3.16

WORKDIR /usr/app

COPY package.json .
RUN npm install
RUN npm install aws-sdk
RUN npm install multer
COPY . .

CMD ["npm", "run", "devStart"]