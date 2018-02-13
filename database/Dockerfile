FROM cassandra:latest

WORKDIR /usr/src/schema

COPY ./schema/schema.cql ./

# If you are building your code for production
# RUN npm install --only=production
# RUN cqlsh
# Bundle app source

EXPOSE 9042
# CMD [ "cqlsh", "-f", "schema.cql" ]