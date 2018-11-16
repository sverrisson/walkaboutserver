# HS 2018
FROM node:11.1

# Working directory for application
RUN mkdir -p /server
COPY . /server
WORKDIR /server

ENV NODE_ENV production

RUN npm install --only=production

RUN echo $NODE_ENV

# Binds to port
EXPOSE 3000
