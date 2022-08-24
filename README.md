```
   _____                         _                   _    _           _
  / ____|                       (_)                 | |  | |         | |
 | (___     ___   _ __  __   __  _    ___    ___    | |__| |  _   _  | |__
  \___ \   / _ \ | '__| \ \ / / | |  / __|  / _ \   |  __  | | | | | | '_ \
  ____) | |  __/ | |     \ V /  | | | (__  |  __/   | |  | | | |_| | | |_) |
 |_____/   \___| |_|      \_/   |_|  \___|  \___|   |_|  |_|  \__,_| |_.__/

    Create X-as-a-Service on Kubernetes with Helm
```

## Service Hub for Kubernetes
JovianX **Service Hub** is a DevOps tool to create on-demand services using Helm and Kubernetes.


## Serivce tempalte example:
```
name: my-new-service
charts:                                      # required
  - name: my-application
    chart: my-charts-repo/myapp
    version: 4.20.0
    values:
      - myvalue: somevalue
        someparam:
            nested:
                im: cool
        users:
          username: {{ inputs.username }}
      - controller:
          ingressClass: {{ inputs.ingress_class_name }}

  - name: redis
    chart: bitnami/redis
    version: 17.0.6
    values:
      - url: https://vault.example.com
        db:
          username: {{ inputs.username }}

inputs:                                      # optional
  - name: username                           # required
    type: string                             # required, Options: string, select, checkbox
    lable: 'User Name'                       # optional
    defualt: 'user'                          # optional

  - name: some_user_input
    type: string
    lable: 'Enter your name'
    defualt: 'John'
```
