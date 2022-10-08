```
    JovianX
      _____                         _                   _    _           _
     / ____|                       (_)                 | |  | |         | |
    | (___     ___   _ __  __   __  _    ___    ___    | |__| |  _   _  | |__
     \___ \   / _ \ | '__| \ \ / / | |  / __|  / _ \   |  __  | | | | | | '_ \
     ____) | |  __/ | |     \ V /  | | | (__  |  __/   | |  | | | |_| | | |_) |
    |_____/   \___| |_|      \_/   |_|  \___|  \___|   |_|  |_|  \__,_| |_.__/
   
             Create X-as-a-Service on Kubernetes with Helm
```

<table><tbody><tr><td><a href="https://github.com/JovianX/service-hub/stargazers">🤩 Star the project if you like it ⭐</a></td><td><a href="https://discord.gg/sAWBJxrh">💬 Join our Discord</a></td></tr></tbody></table>

## 🌉 JovianX Service Hub for Kubernetes

JovianX **Service Hub** is a Platform Engineering tool to create on-demand services using Helm and Kubernetes.

## 🦄 Features:

*   **Helm Manager**
    *   Manage Helm Releases, Monitor application Health, Set Releases TTL, Update release values, Upgrade versions, Manage repositories, etc'
    *   Helm Restful API - Full restful API for Helm
    *   Helm UI - Allow operators and SRE quickly manage the helm application via WebUI.

## 🚀 Roadmap - WIP

*   **Application Templates**
    *   Create application templates and reversion
    *   Allow operators to create applications from templates
*   **Context-based Helm values** - Set Helm values based on application context(Cloud provider, region, etc')
*   **Service Endpoint Monitoring** - Monitor service HTTP endpoints for service availability and health
*   **RBAC** - Role-based access control 

## 👷 Installation

### Docker Compose

Get the docker-compose file

```shell
# curl https://raw.githubusercontent.com/JovianX/service-hub/main/docker-compose.yaml
```

Run the docker-compose file 

```shell
# docker-compose up
```

## 🤽‍♀️ Usage

### 🍱 Application template example:

```text
name: my-new-service						 # required
charts:                                      # required
  - name: redis
    chart: bitnami/redis
    version: 17.0.6
    values:
      - db:
          username: {{ inputs.username }}

inputs:                                      # optional
  - name: username                           # required
    type: string                             # required, Options: string, select, checkbox
    label: 'User Name'                       # optional
    default: 'jon'                           # optional  
```

## License

Copyright 2022 JovianX Ltd.

Licensed under GNU AFFERO GENERAL PUBLIC LICENSE(AGPL).

![JovianX](https://jovianx.com/wp-content/uploads/2021/05/Logo2-2.png)
