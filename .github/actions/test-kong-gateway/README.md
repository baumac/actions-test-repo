# `test-kong-gateway`

An action to test Kong Gateway configurations.

## Prerequisites

None.

## Usage

Action input parameters:

- `gateway-config-path` (required): The relative path from the repo root to the file of the gateway configuration.
- `test-assertions-path` (required): The relative path from the repo root to the file containing the test assertions.
```yaml
      - name: Test Kong Gateway Configuration
        uses: Kong/shared-actions/test-kong-gateway@<ref>
        with:
          gateway-config-path: ./relative/path/to/gateway/config/config.yaml
          assertions-path: ./relative/path/to/gateway/test/assertions.yaml
```

## How It Works
1. Docker Compose starts a Kong Gateway container, and an echo-server container. 
2. The IP tables of the Kong Gateway container are updated to route all outbound traffic to the echo server
3. An assertion runner makes requests to the gateway and receives a response of the echoed request made by the gateway   

## Limitations:
1. Only http and https endpoints are supported. Other protocols will require adding echo servers that support those protocols and using IP tables to reroute the requests to those echo servers.
2. Additional Gateway config, such as Redis and the Db are removed
