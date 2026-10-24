FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

# پوشه داده
RUN mkdir -p data

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "server.js"]
