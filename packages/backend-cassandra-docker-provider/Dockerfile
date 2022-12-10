FROM cassandra:4.0

# https://github.com/docker-library/docs/tree/master/cassandra#configuring-cassandra
COPY "./config/cassandra.yaml" "/etc/cassandra/cassandra.yaml"

CMD ["cassandra", "-f"]
