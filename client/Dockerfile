

FROM node:20-alpine AS build
WORKDIR /app
COPY ./client/package.json ./client/package-lock.json ./  
RUN yarn install
COPY ./client .
RUN yarn build

# Runtime Stage
FROM nginx:stable-alpine
COPY --from=build /app/dist/client/browser /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]