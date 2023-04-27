FROM node:15.4

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY ./src ./src
RUN npm run build
ENV NODE_ENV=production
EXPOSE 8080

CMD ["npm", "start"]