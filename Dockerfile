# frontend/Dockerfile
FROM node:13.12.0-alpine AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY custom-nginx.template /etc/nginx/conf.d/

#RUN chmod +x generate-config.sh

EXPOSE 80
EXPOSE 3001
CMD [ "nginx","-g", "daemon off;"]