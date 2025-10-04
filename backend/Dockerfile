FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN mkdir -p logs
EXPOSE 3001
CMD ["sh", "-c", "npm run seed && npm start"]