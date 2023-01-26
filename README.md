<div align=center>
         
![Service Hub](https://user-images.githubusercontent.com/2787296/214809231-da86cf75-82e8-4c7d-9e58-12e690d5282c.png)

        
         
     
| **Please star ⭐ the repo if you find it useful. Issues and PRs are more then WELCOME!** |
| --- |
         
<table><tbody><tr><td><a href="https://github.com/JovianX/service-hub/stargazers"> Thank you dear stargazers! ⭐🤩 </a></td><td> <a href="https://github.com/JovianX/Service-Hub//blob/main/documentation/">Docs 🕮 </a></td><td><a href="https://discord.gg/CmFvFJDXZv"> Questions? Ask on Discord 💬 </a></td></tr></tbody></table>

![GitHub Repo stars](https://img.shields.io/github/stars/JovianX/Service-Hub)
![GitHub closed pull requests](https://img.shields.io/github/issues-pr-closed/JovianX/Service-Hub)
![GitHub contributors](https://img.shields.io/github/contributors/JovianX/Service-Hub)
![Subreddit subscribers](https://img.shields.io/reddit/subreddit-subscribers/platform_engineering)
![Discord](https://img.shields.io/discord/1014893148599754894)
[![StandWithUkraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/badges/StandWithUkraine.svg)](https://github.com/vshymanskyy/StandWithUkraine/blob/main/docs/README.md)
</div>

# JovianX Service Hub
JovianX **Service Hub** is a tool to create and manage a Self-Service for your internal stakeholders. It allows exposing on-demand catalog of infrastrucutre services (for example databases, s3 buckets, Airflow workflow execution, services with pre-configured or pre-loaded datasets , etc') via a simple to follow Web UI and CLI. 

(Service Hub is commonly used by Platform and DevOps Engineers).

# How Service Hub works?
Serivce Hub allows internal users to create services from a catalog, the catalog is based on serivce tempaltes that you can create and manage. A temaptle defines 4 optinal etlements: **Inputs**, **Components**, **Hooks**, and **Outputs**. Serivce Hub has native integration with Kubernets, components can be defined with Helm charts and Kubernets objects. 


# Use Cases
- **Self-service infrastructure** 
- **Developmnet enviromnets for developers** via self-service UI/CLI/IDE to accelerate and shorten the developmnet cylce. 
- **Testing and review envriomnents** to allow non-developer stackholders (Product Management, Sales, Support) to review developmnet progress early in the dev cycle. 

# 🦄 Features:

**Deploy environmnets from Templates** ([Docs](documentation/templates.md))

- Create application templates from Helm Charts.
- Manage template changes and reversions.
- Allow operators to create applications from templates.

<table><tbody>
<tr align=center>
<td><b>Templates</b> (For Platform Engineers)</td><td><b>Self-Service Environmnets</b> (For Software Engineers)</td>
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
<img referrerpolicy="no-referrer-when-downgrade" src="https://static.scarf.sh/a.png?x-pxid=44b1bb3d-1d33-4c7a-bf39-18379b658acc" />
