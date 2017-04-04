FROM node:7
COPY . /geartrack
ENV NODE_ENV=env
WORKDIR /geartrack
RUN npm install
CMD ["npm", "test"]
