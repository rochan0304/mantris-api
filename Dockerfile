FROM node:20-alpine AS build_stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine AS production_stage
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build_stage /app/package*.json ./
COPY --from=build_stage /app/dist ./dist
RUN npm install --only=production

EXPOSE 8080

USER node
CMD ["node", "dist/main.js"]