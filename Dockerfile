# Use official Node.js image for build
FROM node:18-alpine AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Use official Node.js image for serving static files
FROM node:18-alpine AS production

WORKDIR /app
COPY --from=build /app/build ./build
RUN npm install -g serve

EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
