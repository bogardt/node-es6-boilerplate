FROM node:8.11.1
RUN mkdir -p /usr/src/srumboardapi
WORKDIR /usr/src/srumboardapi
ADD . /usr/src/srumboardapi
RUN npm install -g nodemon --no-optional
EXPOSE 4000
COPY ./entrypoint.sh /usr/src/
RUN chmod +x /usr/src/entrypoint.sh
ENTRYPOINT ["/usr/src/entrypoint.sh"]