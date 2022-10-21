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

JovianX **Service Hub** is a Platform Engineering tool to create and manage on-demand services using Helm and Kubernetes.


<table><tbody><tr><td><a href="https://github.com/JovianX/service-hub/stargazers">⭐ Star the project if you like it 🤩</a></td><td>👍 <a href="https://github.com/JovianX/Service-Hub/pulls">PRs are welcome</a></td><td><a href="https://discord.gg/CmFvFJDXZv">💬 Join Discord</a></td></tr></tbody></table>


[![Stand With Ukraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/badges/StandWithUkraine.svg)](https://stand-with-ukraine.pp.ua) ![GitHub closed pull requests](https://img.shields.io/github/issues-pr-closed/JovianX/Service-Hub) ![Discord](https://img.shields.io/discord/1014893148599754894) 

---

![](https://user-images.githubusercontent.com/2787296/194758301-d50ad7a3-ea8d-4b56-91bf-01bf732c4fce.png)

# 🦄 Features:

*   **Helm Manager**
    *   Manage Helm Releases, Monitor application Health, Set Releases TTL, Update release values, Upgrade versions, Manage repositories, etc'
    *   Helm Restful API - Full restful API for Helm
    *   Helm UI - Allow operators and SRE quickly manage the helm application via WebUI.
*   **Application Templates**
    *   Create application templates and reversion
    *   Allow operators to create applications from templates    
*   **Login with GitHub**
*   **Basic RBAC**

## 🚀 Roadmap


*   **Context-based Helm values** - Set Helm values based on application context(Cloud provider, region, etc')
*   **Service Endpoint Monitoring** - Monitor service HTTP endpoints for service availability and health
*   **RBAC** - Role-based access control
*   **Login with Google**
*   **Instal the project via Helm Chart** 

# 👷 Installation

<table><tbody><tr><td>🌎 &nbsp;Service-Hub SaaS at &nbsp; &nbsp;👉 <a href="https://hub.jovianx.app/"><strong>https://hub.jovianx.app</strong></a>&nbsp;</td></tr></tbody></table>

### OR

Clone the repo locally

```
git clone https://github.com/JovianX/service-hub.git
```

Change directory to `service-hub`

```
cd service-hub
```

Build the project Docker images 

```
make build
```

Start the project(starts Docker-compose)

```
make up
```

Open your browser and go to `localhost:3000` :

```
xdg-open 'http://localhost:3000'
```

# 🤽‍♀️ Getting Strated - Usage

1.  Sign up
2.  Add your cluster

# Documentation

For product documentation refer to the [Documentation Folder](documentation/README.md).

# 📜 License

Copyright 2022 JovianX Ltd.

Licensed under GNU AFFERO GENERAL PUBLIC LICENSE(AGPL). 

![JovianX](https://jovianx.com/wp-content/uploads/2021/05/Logo2-2.png)
