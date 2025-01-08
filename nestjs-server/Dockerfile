FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN npm install

RUN mkdir -p ./prisma

COPY ./prisma/schema.prisma ./prisma

RUN npx prisma generate

COPY . .

# Copy the .env file from github actions workflow
COPY .env .env

# Make the .env file readable by the application
RUN chmod 644 .env

RUN npm run build

EXPOSE 5050

CMD [ "npm", "run", "start:prod" ]