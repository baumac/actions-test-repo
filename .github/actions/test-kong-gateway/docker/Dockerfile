ARG KONG_GATEWAY_IMAGE
FROM $KONG_GATEWAY_IMAGE

# Install dependencies
USER root
RUN apt-get update
RUN apt-get install -y sudo
RUN sudo apt-get install -y dnsutils iptables

# Copy the new entrypoint to the container
COPY configure_iptables_and_start_kong.sh /new-entrypoint.sh
RUN chmod 0755 /new-entrypoint.sh

# Overwrite the containers entrypoint
CMD []
ENTRYPOINT /new-entrypoint.sh
