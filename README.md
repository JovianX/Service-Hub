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

<table><tbody><tr><td><a href="https://github.com/JovianX/service-hub/stargazers">⭐ Star the project if you like it 🤩</a></td><td><a href="https://discord.gg/sAWBJxrh">💬 Join our Discord</a></td></tr></tbody></table>

![](https://user-images.githubusercontent.com/2787296/194758301-d50ad7a3-ea8d-4b56-91bf-01bf732c4fce.png)

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
*   **Login with Google/GitHub**

## 👷 Installation

<table><tbody><tr><td>👉🌎 Service-Hub SaaS at <a href="https://hub.jovianx.app/"><strong>https://hub.jovianx.app</strong></a></td></tr></tbody></table>

### OR

Clone the repo locally

```shell
git clone https://github.com/JovianX/service-hub.git
```

Change directory to `service-hub`

```shell
cd service-hub
```

Start the project

```shell
make up
```

Open your browser and go to `localhost:3000` :

```shell
xdg-open 'http://localhost:3000'
```

## 🤽‍♀️ Usage

1.  Create your account and user
    1.  HOW TO DOC
2.  Connect to your Kubernetes clusters
    1.  HOW TO DOC

### 🍱 Application template example:

```yaml
name: my-new-service                            # Required. Name of service.

# List of applicatoin components.
#
# Each component should have unique name across all other components.
# Available components types:
#     helm_chart:
#         Component that represent helm chart.
#         Currently chart can be specified in `chart` parameter in format
#         `<repository name>/<application name>`(don't forget to add required
#         repository to Service Hub).
#         Optionally Version of installing chart, can be defined with `version`
#         parameter.
#         Helm chart values can defined in `values` parameter.
components:                                     # Required. Application components list.
  - name: redis                                 # Required. Component name.
    type: helm_chart                            # Required. Component type.
    chart: bitnami/redis                        # Required. Chart name in format `<repository name>/<application name>`.
    version: 17.0.6                             # Optional. Chart version to install.
    values:                                     # Optional. Helm chart values to install/update.
      - db:
          username: {{ inputs.username }}       # Example of usage dynamic tempalte variables.

# List of user inputs. These inputs allow collect data from user before
# application launch.
# Each input must have unique name. That name is used in dynamic template
# variables, `{{ inputs.username }}` for instance.
# Available next inputs types:
#     Boolean:
#     Inputs that handling boolean values.
#     Option provided in `options` parameter. Option name must be unique across
#     all input's options. If default option defined it must be in list of
#     input's options.
#         checkbox:
#             Input with checkbox widget, where user can tick option with
#             checkmark.
#         switch:
#             Input with toggle widget(on/off), where user can toggle option.
#     Choice:
#     Inputs where user can select option from predefined list.
#         select:
#             Input with select widget, where user can choose option from
#             dropdown list.
#         radio_select:
#             Input with radio button widget, where user can select option by
#             clicking on it.
#     Numeric:
#         Inputs that handling integer and float values.
#         number:
#             Input with textbox widget where user can enter integer or float
#             value.
#         slider:
#             Input with slider widget where user can enter value by pooling
#             pointer.
#     Textual:
#     Inputs that handling single and multi line strings.
#         text:
#             Input with textbox widget. Suitable for simple single-line string,
#             entity name for instance.
#         textarea:
#             Input with textarea widget. Suitable for long multi-line string,
#             some description for example.
inputs:                                         # Optional. User input list.
  - name: text_example                              # Required. Input name. Used in template dynamic variables. Must be unique acros all inputs.
    type: text                                  # Required. Input type.
    label: 'User Name'                          # Optional. User friendly short input title.
    default: 'John Connor'                      # Optional. Default input value. Used if was no input from user.
    description: 'Input description for user.'  # Optional. Valuable for user description of this input.

  - name: textarea_example
    type: textarea
    label: 'Short Bio'
    default: 'This is a short bio for Jon'

  - name: select_example
    type: select
    label: 'Select one options from the dropdown'
    default: 'option_b'                         # Optional. Default option. Must be in list of input's options.
    options:
    - name: option_a                            # Required. Option name. Must be unique across all input's options.
      value: 'option_a_value'                   # Required. Option value that will put into dynamic template variable(in this case `{{ inputs.select_example }}`).
      description: 'Helpful hit for user regarding this option.'  # Optional. User valuable description what consequences will face user if choose this option.
      label: 'Option A'                         # Optional. User friendly short option title.
    - name: option_b
      value: 'option_b_value'
      label: 'Option B'

  - name: radio_select_example
    type: radio_select
    label: 'Select one options clicking on radio button.'
    default: 'option_b'                         # Optional. Default option. Must be in list of input's options.
    options:
    - name: option_a                            # Required. Option name. Must be unique across all input's options.
      value: 'option_a_value'                   # Required. Option value that will put into dynamic template variable(in this case `{{ inputs.radio_select_example }}`).
      description: 'Helpful hit for user regarding this option.'  # Optional. User valuable description what consequences will face user if choose this option.
      label: 'Option A'                         # Optional. User friendly short option title.
    - name: option_b
      value: 'option_b_value'
      label: 'Option B'

  - name: switch_example
    type: switch
    label: 'Toggle this off or on'
    default: true  # or false

  - name: checkbox_example
    type: checkbox
    label: 'Enable or disable this'
    default: false  # or true

  - name: slider_example
    type: slider
    label: 'Choose some numeric value.'
    min: 1                                      # Required. Minimal value.
    max: 10                                     # Required. Maximal value.
    step: 0.5                                   # Required. Step of pointer.
    default: 5                                  # Optional. Default input value. Must be greater or equal minimal value and less of equal maximal value.

  - name: number_example
    type: number
    label: 'Enter some numeric value'
    min: 1                                      # Optional. Minimal value.
    max: 10                                     # Optional. Maximal value.
    default: 5
```

## 📜 License

Copyright 2022 JovianX Ltd.

Licensed under GNU AFFERO GENERAL PUBLIC LICENSE(AGPL).

![](=250x)

![JovianX](https://jovianx.com/wp-content/uploads/2021/05/Logo2-2.png)
