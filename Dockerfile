### STAGE 1:BUILD ###
# Defining a node image to be used as giving it an alias of "build"
# Which version of Node image to use depends on project dependencies
# This is needed to build and compile our code
# while generating the docker image
FROM node:16.15.1-alpine AS build
# Create a Virtual directory inside the docker image
WORKDIR /dist/src/app
# Copy files to virtual directory
# COPY package.json package-lock.json ./
# Run command in Virtual directory
RUN npm cache clean --force
# Copy files from local machine to virtual directory in docker image
COPY . .
RUN rm -rf node_modules package-lock.json
RUN npm install --legacy-peer-deps
RUN npm run update --legacy-peer-deps
RUN node --max_old_space_size=10000 ./node_modules/.bin/ng build --aot


### STAGE 2:RUN ###
# Defining nginx image to be used
FROM nginx:1.25.3 AS ngi

#RUN echo "location /nginx_status {\n\
#    stub_status on;\n\
#    access_log off;\n\
#    allow 127.0.0.1;\n\
#}" >> /etc/nginx/conf.d/default.conf
RUN sed -i '/location \/ {/i \
    location /nginx_status {\
        stub_status on;\
        access_log off;\
        allow all;\
    }\
' /etc/nginx/conf.d/default.conf

RUN sed -i '/^[[:space:]]*index[[:space:]].*;/i \
    autoindex on;\
' /etc/nginx/conf.d/default.conf


# Copying compiled code and nginx config to different folder
# NOTE: This path may change according to your project's output folder
COPY --from=build /dist/src/app/dist /usr/share/nginx/html
# COPY /nginx.conf  /etc/nginx/conf.d/default.conf
# Exposing a port, here it means that inside the container
# the app will be using Port 80 while running
EXPOSE 80 9090
