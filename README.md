<div align=center>

![image](https://user-images.githubusercontent.com/2787296/198906916-9904da29-3005-49e6-a109-b4238dc9ace1.png)

# JovianX Service Hub
<table><tbody><tr><td><a href="https://github.com/JovianX/service-hub/stargazers"> Thank you dear stargazers! ⭐🤩 </a></td><td> <a href="https://github.com/JovianX/Service-Hub/pulls">Issues/PRs are welcome 👍 </a></td><td><a href="https://discord.gg/CmFvFJDXZv"> Join Discord 💬 </a></td></tr></tbody></table>

![GitHub Repo stars](https://img.shields.io/github/stars/JovianX/Service-Hub?style=social)
![GitHub closed pull requests](https://img.shields.io/github/issues-pr-closed/JovianX/Service-Hub)
![GitHub contributors](https://img.shields.io/github/contributors/JovianX/Service-Hub)
![Discord](https://img.shields.io/discord/1014893148599754894)
[![StandWithUkraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/badges/StandWithUkraine.svg)](https://github.com/vshymanskyy/StandWithUkraine/blob/main/docs/README.md)
</div>


JovianX **Service Hub** is a tool to create and manage on-demand services using Helm and Kubernetes (used by Platform Engineers).



```
         _____                         _                   _    _           _
        / ____|                       (_)                 | |  | |         | |
       | (___     ___   _ __  __   __  _    ___    ___    | |__| |  _   _  | |__
        \___ \   / _ \ | '__| \ \ / / | |  / __|  / _ \   |  __  | | | | | | '_ \
        ____) | |  __/ | |     \ V /  | | | (__  |  __/   | |  | | | |_| | | |_) |
       |_____/   \___| |_|      \_/   |_|  \___|  \___|   |_|  |_|  \__,_| |_.__/

                Create X-as-a-Service on Kubernetes with Helm
```
# 🦄 Features:

**Application Templates** ([Docs](documentation/templates.md))

- Create application templates from Helm Charts.
- Manage template changes and reversions.
- Allow operators to create applications from templates.

<table><tbody>
<tr align=center>
<td><b>Application Templates</b></td><td><b>Self-Service</b></td>
</tr>
<tr><td colspan=2>
<img src="https://user-images.githubusercontent.com/2787296/198906162-5aaa83df-7a7b-4ec5-b1e0-3a6f455a010e.png">
</td></tr>
</tbody></table>




**Helm Manager**

- Manage Helm Releases, Monitor application Health, Set Releases TTL, Update release values, Upgrade versions, Manage repositories, etc'
- Manage Helm Releases across multiple clusters.
- Helm Restful API - Full restful API for Helm
- Helm UI - Allow operators and SRE quickly manage the helm application via WebUI.

![](https://user-images.githubusercontent.com/2787296/194758301-d50ad7a3-ea8d-4b56-91bf-01bf732c4fce.png)

**Login with GitHub or email/password**
**Basic RBAC**

## 🚀 Roadmap

- **Context-based Helm values** - Set Helm values based on application context(Cloud provider, region, etc')
- **Service Endpoint Monitoring** - Monitor service HTTP endpoints for service availability and health
- **RBAC** - Role-based access control
- **Login with Google**
- **Installation via Helm Chart**

# 👷 Installation

<table><tbody><tr><td>🌎 &nbsp;Service-Hub SaaS at &nbsp; &nbsp;👉 <a href="https://hub.jovianx.app/"><strong>https://hub.jovianx.app</strong></a>&nbsp;</td></tr></tbody></table>

### OR

```
curl https://raw.githubusercontent.com/JovianX/Service-Hub/main/docker-compose.yaml -o docker-compose.yaml
docker-compose up
xdg-open 'http://localhost:3000'
```

# 🤽‍♀️ Getting Strated - Usage

1.  Create account with email/Password or GitHub login https://hub.jovianx.app/sign-up
2.  Add your Kubernetes cluster https://youtu.be/gkUHn_gnS1c?t=10

![](https://raw.githubusercontent.com/JovianX/Service-Hub/main/documentation/JovianX_Service_Hub_Getting_Started.gif)

https://www.youtube.com/watch?v=gkUHn_gnS1c

# Documentation

For product documentation refer to the [Documentation Folder](documentation/README.md).

# Contributors
<a href = "https://github.com/JovianX/Service-Hub/graphs/contributors">
  <img src = "https://contrib.rocks/image?repo=JovianX/Service-Hub"/>
</a>

# 📜 License

Copyright 2022 JovianX Ltd.

Licensed under the Apache License, Version 2.0 (the "License");

![JovianX](https://jovianx.com/wp-content/uploads/2021/05/Logo2-2.png)
