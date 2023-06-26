#!/bin/bash

while IFS= read -r gatewayService; do
    # gatewayService is a yaml snippet representing a single entry

    # Read the service into vars
    host=$(echo "$gatewayService" | yq '.host')
    port=$(echo "$gatewayService" | yq '.port')
    protocol=$(echo "$gatewayService" | yq '.protocol')

    # Short circuit dns lookups and add an iptables rule for each service
    # This will route requests to the gateway service of the echo-server that matches its protocol.
    case "$protocol" in

    "http")  echo "Adding hosts entry and iptables rule for host: $host on port: $port with protocol: $protocol"
             sudo echo "$(dig +short http-echo-server) $host">> /etc/hosts
             sudo iptables -t nat -A OUTPUT -p tcp --destination $(dig +short http-echo-server) -j DNAT --to-destination $(dig +short http-echo-server):8888
             ;;
    "https") echo "Adding hosts entry and iptables rule for host: $host on port: $port with protocol: $protocol"
             sudo echo "$(dig +short https-echo-server) $host">> /etc/hosts
             sudo iptables -t nat -A OUTPUT -p tcp --destination $(dig +short https-echo-server) -j DNAT --to-destination $(dig +short https-echo-server):9999
             ;;
    *)       echo "Unsupported protocol: $protocol. no action taken for service $gatewayService"
              #  Protocols supported by the gateway but not this script are: "grpc", "grpcs", "tcp", "tls", "tls_passthrough", "udp", "ws", "wss"
             ;;
    esac

done < <(yq e -o=j -I=0 '.services[]' /opt/kong/kong_gateway_config.yml)


# Preserve the initial entrypoint
/docker-entrypoint.sh "kong" "docker-start"


