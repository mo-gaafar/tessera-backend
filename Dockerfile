FROM node:18.14.2

WORKDIR /usr/app

COPY package.json .
RUN npm install
COPY . .

CMD ["npm", "run", "prodStart"]
