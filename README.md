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

# What is JovianX Service Hub?
JovianX **Service Hub** is a tool that enables Self-Service for internal stakeholders. It exposes an on-demand catalog of infrastrucutre services (for example databases, s3 buckets, Airflow workflow execution, services with or without pre-configured or pre-loaded datasets , etc') via a simple to follow Web UI and CLI. 

Service Hub is commonly used by Platform and DevOps Engineers.


# 🦄 Features:
- Self-Service Portal based on Tempaltes Catalog
- Login with GitHub or email/password
- Basic RBAC
- Templates Catalog ([Docs](documentation/templates.md))
  - Create service templates with Helm Charts.
  - Use Kubernetes jobs as serivce lifecyle(create/delete/etc') hooks
  - Remplate reversioning.
  - TTL 
 
<table><tbody>
<tr align=center>
<td><b>Templates |</b> Platform Engineers create service catalog via tempaltes </td><td><b>Self-Service</b></td>
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


## Use Cases
- **Self-service infrastructure** Allow internal stackholders a very simple and maanged way to access infrastrucutre.  
- **Developmnet enviromnets**  accelerate and shorten the developmnet cylce via self-service app and infra componnets via  UI/CLI/IDE.
- **Testing and review envriomnents** to allow non-developer stackholders (Product Management, Sales, Support) to review developmnet progress early in the dev cycle. 

# How Service Hub works?
Serivce Hub allows internal users to create services from a catalog. The catalog is based on serivce tempaltes that you can create and manage. 
A temaptle defines 4 optinal etlements: 
- **Inputs**  define the user inpus to collecto from the user
- **Components** define what components should be set up when instantiating the service
- **Hooks** can run scripts or trigger external APIs and services during diffenreny service lifecycle evetns(create, delete, etc')
- **Outputs** define the output shown to the users after they create their serivce 

Serivce Hub has native integration with Kubernets,thus components can setup Helm charts, Hooks( such as pre-install, post-delete, etc') can setup Kubernetes Jobs.

When a user creates a services from the templates catalog, Service Hub generates a web-form UI from the *Inputs* definition, asking the user to provide inputs to complete service creation. When the the user provides the input values Service Hub passes the provided values to the Components and hooks, allowing creation of pre-scripted services following inputs end-users provide. 


## Architecture
![Service Hub Architecutre](https://user-images.githubusercontent.com/2787296/215046290-a89d375f-ecf0-4ac6-9409-dabeb40f55ba.svg)

## 🚀 Roadmap

- **Context-based Helm values** - Set Helm values based on application context(Cloud provider, region, etc')
- **Service Endpoint Monitoring** - Monitor service HTTP endpoints for service availability and health
- **RBAC** - Role-based access control
- **Login with Google**
- **Installation via Helm Chart**

# 👷 Installation

## SaaS

<table><tbody><tr><td>🌎 &nbsp;Service-Hub SaaS at &nbsp; &nbsp;👉 <a href="https://hub.jovianx.app/"><strong>https://hub.jovianx.app</strong></a>&nbsp;</td></tr></tbody></table>

OR

## Docker Compose

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
