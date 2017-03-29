FROM node:7
COPY . /geartrack
ENV NODE_ENV=env
RUN dpkg --add-architecture i386 && \
    apt-get update && \
    apt-get install -y libc6:i386 libncurses5:i386 libstdc++6:i386 && \
    rm -rf /var/lib/apt/lists/* && \
    cd /geartrack && npm install
CMD cd /geartrack && npm test
