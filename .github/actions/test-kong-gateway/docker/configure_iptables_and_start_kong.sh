#!/bin/bash

# Short circuit all dns lookups to the echo server ip by finding all hosts in the gateway config and adding a dns entry for them
grep -o '\s*host:.*' /opt/kong/kong_gateway_config.yml | cut -f2 -d: | while IFS= read -r line; do sudo echo "$(dig +short echo-server) $line">> /etc/hosts; done

# Route all outbound traffic on port 443 to port 9999 of the echo server. The echo server handles https requests on this port.
sudo iptables -t nat -A OUTPUT -p tcp --dport 443 -j DNAT --to-destination $(dig +short echo-server):9999

# Route all other outbound traffic to port 8888 of the echo server. The echo server handles http requests on this port.
sudo iptables -t nat -A OUTPUT -p tcp -j DNAT --to-destination $(dig +short echo-server):8888

# Preserve the initial entrypoint
/docker-entrypoint.sh "kong" "docker-start"


