```shell
       JovianX
         _____                         _                   _    _           _
        / ____|                       (_)                 | |  | |         | |
       | (___     ___   _ __  __   __  _    ___    ___    | |__| |  _   _  | |__
        \___ \   / _ \ | '__| \ \ / / | |  / __|  / _ \   |  __  | | | | | | '_ \
        ____) | |  __/ | |     \ V /  | | | (__  |  __/   | |  | | | |_| | | |_) |
       |_____/   \___| |_|      \_/   |_|  \___|  \___|   |_|  |_|  \__,_| |_.__/

                Create X-as-a-Service on Kubernetes with Helm
```

[\<\< Back to the documentation](README.md)

# 🍱 Application Templates

### Feature Overview

Application Templates allow users (Developers, DevOps, SREs, or other members) to deploy applications via a simple Self-Service web UI.  Application Templates allow creating a self-service experience for software.

<table><tbody><tr><td><strong>Application Templates</strong></td><td><strong>Self-Service</strong></td></tr><tr><td colspan="2"><figure class="image"><img src="https://user-images.githubusercontent.com/2787296/198906162-5aaa83df-7a7b-4ec5-b1e0-3a6f455a010e.png"></figure></td></tr></tbody></table>

Users (with the `Admin` role) can create application templates. An application template defines its `components` (Helm Charts), and `inputs` we expect the user to provide when deploying the application. 

The `components`  in the template are the definitions of Helm Chats, and all values that are set by default when deploying the application.

The `inputs` definition creates a UI that asks the user to provide values when deploying the application. We support the following  `inputs` types: `text`, `textarea`, `number`, `select` , `radio_select`  , `switch` , `checkbox`, `slider`.

Users (with the `Operator` or `Admin` roles) can deploy applications via the Self-Service console.

### **Creating a new template**

1.  Navigate to Templates in the side menu. 
2.  Click on "Add Template"

![](https://user-images.githubusercontent.com/2787296/200311033-990e852e-9194-49e4-9340-3c86098710bc.png)

3\. Set a description for the template, which is a free text describing the purpose of the template, or the specific change you added.

4\. Add a template 

![](https://user-images.githubusercontent.com/2787296/200311419-e6c3100e-41bc-4306-92a9-045c01e0a9e7.png)

**Simple Template example:** 

```yaml
# Template reference and documentation at https://github.com/JovianX/Service-Hub/blob/main/documentation/templates.md

name: my-new-service                            # Required. Name of service.

components:                                     # Required. Application components list.
  - name: redis                                 # Required. Component name.
    type: helm_chart                            # Required. Component type.
    chart: bitnami/redis                        # Required. Chart name in format `<repository name>/<application name>`.
    version: 17.0.6                             # Optional. Chart version to install.
    values:                                     # Optional. Helm chart values to install/update.
      - db:
          username: {{ inputs.username }}       # Example of usage dynamic tempalte variables.

inputs:                                         # Optional. User input list.
  - name: username                              # Required. Input name. Used in template dynamic variables. Must be unique acros all inputs.
    type: text                                  # Required. Input type.
    label: 'User Name'                          # Optional. User friendly short input title.
    default: 'John Connor'                      # Optional. Default input value. Used if was no input from user.
    description: 'Enter app username'           # Optional. Valuable for user description of this input.
```

**Managing Reversions**

**Settingh Default Template**

**Deploying an application from a template**

When writing a template you can defined what 

You can provide a Self-Service experience 

Application templates can be deployed by you or other team members 

Self-Service experience 

### Template Reference

To get the complete template reference

```shell
curl -X 'GET'   'https://api.hub.jovianx.app/api/v1/template/schema?format=yaml'   -H 'accept: application/json'  | sed 's/\\n/\n/g' 
```

### Complete Template Example

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

The comprehensive example would produce the following: 

![](https://user-images.githubusercontent.com/2787296/200312035-a296071a-d841-47dd-9e7d-8abbacef73b7.png)
