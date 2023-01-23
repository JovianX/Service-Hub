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

Application Templates allow the creation of a self-service experience for software, so users (Developers, DevOps, SREs, or other members) cloud very easily deploy applications via a simple Self-Service web UI.  

<table><tbody><tr><td><strong>Application Templates - Admin defines components and user inputs</strong></td><td><strong>Self-Service - Operators can deploy the app</strong></td></tr><tr><td colspan="2"><figure class="image"><img src="https://user-images.githubusercontent.com/2787296/198906162-5aaa83df-7a7b-4ec5-b1e0-3a6f455a010e.png"></figure></td></tr></tbody></table>

Admins (users with the `Admin` role) can create application templates. An application template defines the `components` (Helm Charts) that should be deployed, and `inputs` expected from the user to provide when deploying the application. We can use `inputs` to configure `components` settings.

The `components`  in the template are the definitions of Helm Chats, and the values that are set by default when deploying the application.

The `inputs` definition creates a UI that asks the user to provide values when deploying the application. The values provided by the user when deploying the application can be used to configure the application. The following are supported  `inputs` types: `text`, `textarea`, `number`, `select` , `radio_select`  , `switch` , `checkbox`, `slider`.

Users (with the `Operator` or `Admin` roles) can deploy applications via the Self-Service web UI (or RESTful API).

### Template variables

You can insert values in template dynamically with template variables. Template variables starting from `{{` and end with `}}` they have doted syntaxs, for instance: `{{ part1.part2 }}`.

#### **User inputs**

These template variables start from `inputs.` that follows by name of input. Pattern: `{{ inputs.<input name> }}`.
Values for variables will be provided by application consumer during application launch. Check full tempalte [example](#markdown-header-complete-template-example) to see how to declare user inputs.

#### **Kubernetes entities manifests**

With these template variables you can get access to arbitrary Kubernetes entity deployed by Helm.
Pattern: `{{ components.<component name>.manifest.<entity kind>.<entity name>.<doted path to attribute> }}`.
- component name - name of application Helm component.
- entity kind - Kind of Kubernetes entity. For instance: `PersistentVolumeClaim`, `Service`.
- entity name - Name of Kubernetes entity. Compared with `metadata.name` of entity instance.

### **Creating a new template**

1.  Navigate to Templates in the side menu. 
2.  Click on "Add Template"

![](https://user-images.githubusercontent.com/2787296/200358986-792846c5-dd12-48af-99c9-0823f89750e5.png)

3\. Set a description for the template, which is a free text describing the purpose of the template, or the purpose of a specific change added.

4\. Add the application template, and click on "Add".

![](https://user-images.githubusercontent.com/2787296/200311419-e6c3100e-41bc-4306-92a9-045c01e0a9e7.png)

**Here's a simple template example:**

```yaml
# Template reference and documentation at
# https://github.com/JovianX/Service-Hub/blob/main/documentation/templates.md

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
Every change, edit, or update of a template creates a new template reversion. You can upgrade or roll back an application to match a reversion.

**Default Template**
When deploying an application, the default template is automatically selected,

**Setting a Default Template**
To set the default template, hover over a non-default template, and click on the "Default" button that appears.  

![image](https://user-images.githubusercontent.com/2787296/200361559-a3b0f2e7-70da-4135-86cb-1c0150353f74.png)

**Deploying an application from a template**

1.  To deploy a new application navigate to the applications menu
2.  Click on "Deploy Application"

![image](https://user-images.githubusercontent.com/2787296/200362320-3683c0ee-f64a-46d0-b87c-1f8d007edd75.png)

1.  Select the Template and reversion
2.  Fill inputs
3.  Select the target cluster, and namespace, and Click on "Deploy"

![](https://user-images.githubusercontent.com/2787296/200364569-5337d5a2-6f08-4fb3-9dd2-0a48fbc13142.png)

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
    enabled: true                               # Optional. If false, component will be skipped installation or upgrade. Default: true.
    chart: bitnami/redis                        # Required. Chart name in format `<repository name>/<application name>`.
    version: 17.0.6                             # Optional. Chart version to install.
    values:                                     # Optional. Helm chart values to install/update.
      - db:
          username: {{ inputs.text_example }}   # Example of usage dynamic tempalte variables.
      - replica:
          serviceAccount:
            create: false
      - master:
          serviceAccount:
            create: false

  - name: mongodb
    type: helm_chart
    chart: bitnami/mongodb
    version: 13.4.1
    values:
      - auth:
          rootPassword: {{ inputs.text_example }}

  - name: rabbitmq
    type: helm_chart
    chart: bitnami/rabbitmq
    version: 11.1.1
    values:
      - db:
          username: {{ inputs.text_example }}

# List of application hooks.
#
# Available hooks types:
#     kubernetes_job:
#         Hook that creates Kubernetes Job and execute arbitrary command there.
#
# For now available next hook's triggers:
#     pre_install:
#         Executed before installing of application's components.
#
#     post_install:
#         Executed after successful application's components installation.
#
#     pre_upgrade:
#         Executed before installing(if any) or updating(if any) or
#         deleting(if any) of application's components.
#
#         Application can be upgraded with new version of template. During this
#         upgrade some application components will appear in new template so they
#         must be installed. Some other components can stay but change so they
#         must be updated. Other components can disappear in new template so they
#         must be uninstalled.
#
#     post_upgrade:
#         Executed after successful application template change.
#
#     pre_terminate:
#         Executed before application termination.
#
#     post_terminate:
#         Executed after successful application termination.
hooks:
  pre_install:
    - name: pre-install-hook                    # Required. Hook name. Must be unique for trigger type.
      type: kubernetes_job                      # Required. Hook type. Currently can be only `kubernetes_job`.
      enabled: true                             # Optional. Enables of disables hook execution. Default is true.
      image: 'alpine'                           # Required if type is `kubernetes_job`. Name of Docker image to use
                                                # during Job creation.
      namespace: some-namespace                 # Optional. Used with type `kubernetes_job`. Namespace where to create
                                                # Job.
      on_failure: stop                          # Optional. Used with type `kubernetes_job`. Describes what to do with
                                                # application installation or upgrade if hook execution fails(or reached
                                                # timeout). Can have next options: `stop` or `continue`. `stop` -
                                                # application install/upgrade considered as failed. `continue` - hook
                                                # execution will have no influance on application install/upgrade.
      timeout: 120                              # Optional. Hook execution deadline in seconds. If hook did namage to
                                                # finish execution in specified time hook considered as failed(timeout).
                                                # Default value is 300(5 minutes).
      command: ['/bin/sh', '-c']                # Required if type is `kubernetes_job`. Container command.
      args:                                     # Required if type is `kubernetes_job`. Container command arguments.
        - env; sleep 1;
      env:                                      # Optional. Used with type `kubernetes_job`. Container environment
                                                # variables to set in container.
        - name: JX_ENV_KEY
          value: "Hello World"
        - name: SOME_OTHER_ENV_VAR
          value: "Hello there."

  post_install:
    - name: post-install-hook
      type: kubernetes_job
      image: 'appropriate/curl'
      command: ['/bin/sh', '-c']
      args:
        - curl https://www.google.com/search?q=service_hub;

  pre_upgrade:
    - name: pre-upgrade-hook
      type: kubernetes_job
      image: 'appropriate/curl'
      command: ['/bin/sh', '-c']
      args:
        - curl https://www.google.com/search?q=service_hub__pre_upgrade;

  post_upgrade:
    - name: post-upgrade-hook
      type: kubernetes_job
      image: 'appropriate/curl'
      command: ['/bin/sh', '-c']
      args:
        - curl https://www.google.com/search?q=service_hub__post_upgrade;

  pre_terminate:
    - name: pre-terminate-hook
      type: kubernetes_job
      image: 'appropriate/curl'
      command: ['/bin/sh', '-c']
      args:
        - curl https://www.google.com/search?q=service_hub__pre_terminate;

  post_terminate:
    - name: post-terminate-hook
      type: kubernetes_job
      image: 'appropriate/curl'
      command: ['/bin/sh', '-c']
      args:
        - curl https://www.google.com/search?q=service_hub__post_terminate;

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
  - name: text_example                          # Required. Input name. Used in template dynamic variables. Must be unique acros all inputs.
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

# If you need show message to user, you can use output.
#     notes:
#         Simple multiline text. Template variables can be used here to make message more adaptive.
outputs:
    notes: 'Message that informs that Mongo DB cluster IP is: {{ components.mongodb.manifest.Service.mongodb.spec.cluster_ip }}'
```

The comprehensive example would produce the following inputs:

![](https://user-images.githubusercontent.com/2787296/200312035-a296071a-d841-47dd-9e7d-8abbacef73b7.png)

## Complete Template Reference

```yaml
additionalProperties: false
definitions:
  CheckboxInput:
    additionalProperties: false
    description: Input with checkbox widget.
    properties:
      default:
        description: Default value of input if it was not provided by user.
        example: true
        title: Default
        type: boolean
      description:
        description: Input help text for user.
        title: Description
        type: string
      immutable:
        default: false
        description: If `True`, value cannot be changed.
        title: Immutable
        type: boolean
      label:
        description: User friendly name of input.
        example: User Name
        minLength: 1
        title: Label
        type: string
      name:
        description: Name of value that will be used in template.
        example: username
        minLength: 1
        title: Name
        type: string
      type:
        description: Type of form input.
        enum:
        - !!python/object/apply:constants.templates.InputTypes
          - checkbox
        example: !!python/object/apply:constants.templates.InputTypes
        - checkbox
        title: Type
        type: string
    required:
    - name
    - type
    title: CheckboxInput
    type: object
  Component:
    additionalProperties: false
    description: Application component schema.
    properties:
      chart:
        description: Helm chart name.
        example: roboll/vault-secret-manager
        minLength: 1
        title: Chart
        type: string
      name:
        description: Helm release name
        example: vault
        minLength: 1
        title: Name
        type: string
      type:
        allOf:
        - $ref: '#/definitions/ComponentTypes'
        description: Type of applicatoin component.
        example: !!python/object/apply:constants.templates.ComponentTypes
        - helm_chart
      values:
        description: Helm values that will be provided during chart install/upgrade.
          The later element in the list has a higher priority.
        items:
          type: object
        title: Values
        type: array
      version:
        description: Helm chart version.
        example: 1.24.1
        minLength: 1
        title: Version
        type: string
    required:
    - name
    - type
    - chart
    title: Component
    type: object
  ComponentTypes:
    description: \"\
    Template application components types.\
    \"
    enum:
    - helm_chart
    title: ComponentTypes
    type: string
  InputOption:
    description: Input option schema.
    properties:
      description:
        description: Option help text for user.
        title: Description
        type: string
      label:
        description: User friendly name of option.
        example: Option 1
        minLength: 1
        title: Label
        type: string
      name:
        description: Option name.
        example: option_a
        minLength: 1
        title: Name
        type: string
      value:
        description: Value of option that will put into template dynamic variable.
        example: option_a_value
        title: Value
    required:
    - name
    title: InputOption
    type: object
  NumberInputs:
    additionalProperties: false
    description: Inputs where user can set only integer or float in text field.
    properties:
      default:
        anyOf:
        - type: integer
        - type: number
        description: Default value of input if it was not provided by user.
        example: 5
        title: Default
      description:
        description: Input help text for user.
        title: Description
        type: string
      immutable:
        default: false
        description: If `True`, value cannot be changed.
        title: Immutable
        type: boolean
      label:
        description: User friendly name of input.
        example: User Name
        minLength: 1
        title: Label
        type: string
      max:
        anyOf:
        - type: integer
        - type: number
        description: Maximal possible input value.
        example: 10
        title: Max
      min:
        anyOf:
        - type: integer
        - type: number
        description: Minimal possible input value.
        example: 1
        title: Min
      name:
        description: Name of value that will be used in template.
        example: username
        minLength: 1
        title: Name
        type: string
      type:
        description: Type of form input.
        enum:
        - !!python/object/apply:constants.templates.InputTypes
          - number
        example: !!python/object/apply:constants.templates.InputTypes
        - number
        title: Type
        type: string
    required:
    - name
    - type
    title: NumberInputs
    type: object
  RadioSelectInput:
    additionalProperties: false
    description: 'Inputs where user can choose one option by clicking on radio button
      of radio

      select widget.'
    properties:
      default:
        description: Default value of input if it was not provided by user.
        example: option_value_1
        title: Default
        type: string
      description:
        description: Input help text for user.
        title: Description
        type: string
      immutable:
        default: false
        description: If `True`, value cannot be changed.
        title: Immutable
        type: boolean
      label:
        description: User friendly name of input.
        example: User Name
        minLength: 1
        title: Label
        type: string
      name:
        description: Name of value that will be used in template.
        example: username
        minLength: 1
        title: Name
        type: string
      options:
        description: Set of input options.
        items:
          $ref: '#/definitions/InputOption'
        minItems: 2
        title: Options
        type: array
      type:
        description: Type of form input.
        enum:
        - !!python/object/apply:constants.templates.InputTypes
          - radio_select
        example: !!python/object/apply:constants.templates.InputTypes
        - radio_select
        title: Type
        type: string
    required:
    - name
    - type
    - options
    title: RadioSelectInput
    type: object
  SelectInput:
    additionalProperties: false
    description: Inputs where user can choose one option from dropdown list widget.
    properties:
      default:
        description: Default value of input if it was not provided by user.
        example: option_value_1
        title: Default
        type: string
      description:
        description: Input help text for user.
        title: Description
        type: string
      immutable:
        default: false
        description: If `True`, value cannot be changed.
        title: Immutable
        type: boolean
      label:
        description: User friendly name of input.
        example: User Name
        minLength: 1
        title: Label
        type: string
      name:
        description: Name of value that will be used in template.
        example: username
        minLength: 1
        title: Name
        type: string
      options:
        description: Set of input options.
        items:
          $ref: '#/definitions/InputOption'
        minItems: 2
        title: Options
        type: array
      type:
        description: Type of form input.
        enum:
        - !!python/object/apply:constants.templates.InputTypes
          - select
        example: !!python/object/apply:constants.templates.InputTypes
        - select
        title: Type
        type: string
    required:
    - name
    - type
    - options
    title: SelectInput
    type: object
  SliderInput:
    additionalProperties: false
    description: Inputs where user can set number by moving slider pointer.
    properties:
      default:
        anyOf:
        - type: integer
        - type: number
        description: Default value of input if it was not provided by user.
        example: 5
        title: Default
      description:
        description: Input help text for user.
        title: Description
        type: string
      immutable:
        default: false
        description: If `True`, value cannot be changed.
        title: Immutable
        type: boolean
      label:
        description: User friendly name of input.
        example: User Name
        minLength: 1
        title: Label
        type: string
      max:
        anyOf:
        - type: integer
        - type: number
        description: Maximal possible input value.
        example: 10
        title: Max
      min:
        anyOf:
        - type: integer
        - type: number
        description: Minimal possible input value.
        example: 1
        title: Min
      name:
        description: Name of value that will be used in template.
        example: username
        minLength: 1
        title: Name
        type: string
      step:
        anyOf:
        - type: integer
        - type: number
        description: Step of slider pointer.
        example: 0.5
        title: Step
      type:
        description: Type of form input.
        enum:
        - !!python/object/apply:constants.templates.InputTypes
          - slider
        example: !!python/object/apply:constants.templates.InputTypes
        - slider
        title: Type
        type: string
    required:
    - name
    - type
    - min
    - max
    - step
    title: SliderInput
    type: object
  SwitchInput:
    additionalProperties: false
    description: Input with toggle widget.
    properties:
      default:
        description: Default value of input if it was not provided by user.
        example: true
        title: Default
        type: boolean
      description:
        description: Input help text for user.
        title: Description
        type: string
      immutable:
        default: false
        description: If `True`, value cannot be changed.
        title: Immutable
        type: boolean
      label:
        description: User friendly name of input.
        example: User Name
        minLength: 1
        title: Label
        type: string
      name:
        description: Name of value that will be used in template.
        example: username
        minLength: 1
        title: Name
        type: string
      type:
        description: Type of form input.
        enum:
        - !!python/object/apply:constants.templates.InputTypes
          - switch
        example: !!python/object/apply:constants.templates.InputTypes
        - switch
        title: Type
        type: string
    required:
    - name
    - type
    title: SwitchInput
    type: object
  TextInput:
    additionalProperties: false
    description: User inputs where user can choose one or more option from predefined
      set.
    properties:
      default:
        description: Default value of input if it was not provided by user.
        example: some default text
        title: Default
        type: string
      description:
        description: Input help text for user.
        title: Description
        type: string
      immutable:
        default: false
        description: If `True`, value cannot be changed.
        title: Immutable
        type: boolean
      label:
        description: User friendly name of input.
        example: User Name
        minLength: 1
        title: Label
        type: string
      name:
        description: Name of value that will be used in template.
        example: username
        minLength: 1
        title: Name
        type: string
      type:
        description: Type of form input.
        enum:
        - !!python/object/apply:constants.templates.InputTypes
          - text
        example: !!python/object/apply:constants.templates.InputTypes
        - text
        title: Type
        type: string
    required:
    - name
    - type
    title: TextInput
    type: object
  TextareaInput:
    additionalProperties: false
    description: User inputs where user can choose one or more option from predefined
      set.
    properties:
      default:
        description: Default value of input if it was not provided by user.
        example: some default text
        title: Default
        type: string
      description:
        description: Input help text for user.
        title: Description
        type: string
      immutable:
        default: false
        description: If `True`, value cannot be changed.
        title: Immutable
        type: boolean
      label:
        description: User friendly name of input.
        example: User Name
        minLength: 1
        title: Label
        type: string
      name:
        description: Name of value that will be used in template.
        example: username
        minLength: 1
        title: Name
        type: string
      type:
        description: Type of form input.
        enum:
        - !!python/object/apply:constants.templates.InputTypes
          - textarea
        example: !!python/object/apply:constants.templates.InputTypes
        - textarea
        title: Type
        type: string
    required:
    - name
    - type
    title: TextareaInput
    type: object
description: Template schema.
properties:
  components:
    description: Application components.
    items:
      $ref: '#/definitions/Component'
    minItems: 1
    title: Components
    type: array
  inputs:
    default: []
    description: Input that should be provided by user.
    items:
      discriminator:
        mapping:
          ? !!python/object/apply:constants.templates.InputTypes
          - checkbox
          : '#/definitions/CheckboxInput'
          ? !!python/object/apply:constants.templates.InputTypes
          - number
          : '#/definitions/NumberInputs'
          ? !!python/object/apply:constants.templates.InputTypes
          - radio_select
          : '#/definitions/RadioSelectInput'
          ? !!python/object/apply:constants.templates.InputTypes
          - select
          : '#/definitions/SelectInput'
          ? !!python/object/apply:constants.templates.InputTypes
          - slider
          : '#/definitions/SliderInput'
          ? !!python/object/apply:constants.templates.InputTypes
          - switch
          : '#/definitions/SwitchInput'
          ? !!python/object/apply:constants.templates.InputTypes
          - text
          : '#/definitions/TextInput'
          ? !!python/object/apply:constants.templates.InputTypes
          - textarea
          : '#/definitions/TextareaInput'
        propertyName: type
      oneOf:
      - $ref: '#/definitions/CheckboxInput'
      - $ref: '#/definitions/NumberInputs'
      - $ref: '#/definitions/RadioSelectInput'
      - $ref: '#/definitions/SelectInput'
      - $ref: '#/definitions/SliderInput'
      - $ref: '#/definitions/SwitchInput'
      - $ref: '#/definitions/TextareaInput'
      - $ref: '#/definitions/TextInput'
    title: Inputs
    type: array
  name:
    description: Name of application which describes this template
    example: My Application
    minLength: 1
    title: Name
    type: string
required:
- name
- components
title: TemplateSchema
type: object
```
