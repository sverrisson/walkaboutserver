# HS 2018
FROM node:11.1

# Working directory for application
WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .
#COPY public .

ENV NODE_ENV production

RUN npm install --only=production

COPY . .

RUN echo $NODE_ENV

# Binds to port
EXPOSE 3000

# Creates a mount point
VOLUME [ "/usr/src/app" ]

#RUN npm install
CMD ["node", "server.js"]
