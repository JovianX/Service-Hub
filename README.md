# JovianX Service-Hub

JovianX **Service Hub** is a Platform Engineering tool to create and manage on-demand services using Helm and Kubernetes.

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

<table><tbody><tr><td><a href="https://github.com/JovianX/service-hub/stargazers">⭐ Star the project if you like it 🤩</a></td><td>👍 <a href="https://github.com/JovianX/Service-Hub/pulls">PRs are welcome</a></td><td><a href="https://discord.gg/CmFvFJDXZv">💬 Join Discord</a></td></tr></tbody></table>

![GitHub Repo stars](https://img.shields.io/github/stars/JovianX/Service-Hub?style=social)
![GitHub closed pull requests](https://img.shields.io/github/issues-pr-closed/JovianX/Service-Hub)
![Discord](https://img.shields.io/discord/1014893148599754894)
![Stand With Ukraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/badges/StandWithUkraine.svg)

---

# 🦄 Features:

**Application Templates**

- Create application templates from Helm Charts.
- Manage template changes and reversions.
- Allow operators to create applications from templates.

<table><tbody><tr><td>Application Template Reversioning</td><td>Developer Self-Service Experience</td></tr><tr><td><img src="https://user-images.githubusercontent.com/2787296/197898326-c2057c4f-5b8c-4c76-a34e-1296dfa311d1.png"></td><td><img src="https://user-images.githubusercontent.com/2787296/197898363-e82ae5dd-edf0-4a27-beae-ef8f558341c0.png"></td></tr></tbody></table>

**Helm Manager**

- Manage Helm Releases, Monitor application Health, Set Releases TTL, Update release values, Upgrade versions, Manage repositories, etc'
- Manage Helm Releases across multiple clusters.
- Helm Restful API - Full restful API for Helm
- Helm UI - Allow operators and SRE quickly manage the helm application via WebUI.

![](https://user-images.githubusercontent.com/2787296/194758301-d50ad7a3-ea8d-4b56-91bf-01bf732c4fce.png)

**Login with GitHub or email/password **
**Basic RBAC**

## 🚀 Roadmap

- **Context-based Helm values** - Set Helm values based on application context(Cloud provider, region, etc')
- **Service Endpoint Monitoring** - Monitor service HTTP endpoints for service availability and health
- **RBAC** - Role-based access control
- **Login with Google**
- **Instal the project via Helm Chart**

# 👷 Installation

<table><tbody><tr><td>🌎 &nbsp;Service-Hub SaaS at &nbsp; &nbsp;👉 <a href="https://hub.jovianx.app/"><strong>https://hub.jovianx.app</strong></a>&nbsp;</td></tr></tbody></table>

### OR

Clone the repo locally

```
git clone https://github.com/JovianX/service-hub.git
cd service-hub
make build
make up
xdg-open 'http://localhost:3000'
```

# 🤽‍♀️ Getting Strated - Usage

1.  Create account with email/Password or GitHub login https://hub.jovianx.app/sign-up
2.  Add your Kubernetes cluster https://youtu.be/gkUHn_gnS1c?t=10

![](https://raw.githubusercontent.com/JovianX/Service-Hub/main/documentation/JovianX_Service_Hub_Getting_Started.gif)

https://www.youtube.com/watch?v=gkUHn_gnS1c

# Documentation

For product documentation refer to the [Documentation Folder](documentation/README.md).

# 📜 License

Copyright 2022 JovianX Ltd.

Licensed under the Apache License, Version 2.0 (the "License");

![JovianX](https://jovianx.com/wp-content/uploads/2021/05/Logo2-2.png)
