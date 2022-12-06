import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import { Button, List, ToggleButton, ToggleButtonGroup } from '@mui/material';
import MonacoEditor from '@uiw/react-monacoeditor';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import FuseLoading from '@fuse/core/FuseLoading';
import DialogModal from 'app/shared-components/DialogModal';
import { getContextList } from 'app/store/clustersSlice';
import {
  deleteTemplate,
  getTemplatesList,
  selectInfoMessage,
  selectIsTemplatesLoading,
  selectTemplates,
} from 'app/store/templatesSlice';
import { selectUser } from 'app/store/userSlice';

import CatalogList from './CatalogsList/CatalogList';
import TemplatesModal from './TemplateModal/TemplatesModal';
import { TemplateProvider } from './TemplateProvider';
import TemplatesListItem from './TemplatesListItem';

const TemplatesList = () => {
  const dispatch = useDispatch();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [templates, setTemplates] = useState([]);
  const [transformedTemplates, setTransformedTemplates] = useState([]);
  const [templateId, setTemplateId] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [templateYamlText, setTemplateYamlText] = useState('');

  const [infoMessageError, setInfoMessageError] = useState('');
  const [infoMessageSuccess, setInfoMessageSuccess] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({
    action: '',
    title: '',
    confirmText: '',
    template: {},
  });
  const [editTemplateId, setEditTemplateId] = useState('');
  const [alignment, setAlignment] = useState('catalog');

  const templatesData = useSelector(selectTemplates);
  const isLoading = useSelector(selectIsTemplatesLoading);
  const infoMessage = useSelector(selectInfoMessage);
  const user = useSelector(selectUser);

  useEffect(() => {
    dispatch(getTemplatesList());
    dispatch(getContextList());
  }, [dispatch]);

  useEffect(() => {
    setTemplateId(selectedTemplateId);
  }, [selectedTemplateId]);

  useEffect(() => {
    setTemplates([
      {
        id: 23,
        created_at: 1667557455.310733,
        name: 'my-new-service        2',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur',
        revision: 4,
        enabled: true,
        default: false,
        template:
          "name: my-new-service        2                    # Required. Name of service.\n\n# List of applicatoin components.\n#\n# Each component should have unique name across all other components.\n# Available components types:\n#     helm_chart:\n#         Component that represent helm chart.\n#         Currently chart can be specified in chart parameter in format\n#         <repository name>/<application name>`(don't forget to add required\n#         repository to Service Hub).\n#         Optionally Version of installing chart, can be defined with `version`\n#         parameter.\n#         Helm chart values can defined in `values parameter.\ncomponents:                                    # Required. Application components list.\n  - name: redis                           # Required. Component name.\n    type: helm_chart                            # Required. Component type.\n    chart: bitnami/redis                        # Required. Chart name in format <repository name>/<application name>.\n    version: 17.0.6                             # Optional. Chart version to install.\n    values:                                     # Optional. Helm chart values to install/update.\n      - db:\n          username: {{ inputs.username }}       # Example of usage dynamic tempalte variables.\n\n# List of user inputs. These inputs allow collect data from user before\n# application launch.\n# Each input must have unique name. That name is used in dynamic template\n# variables, {{ inputs.username }} for instance.\n# Available next inputs types:\n#     Boolean:\n#     Inputs that handling boolean values.\n#     Option provided in options parameter. Option name must be unique across\n#     all input's options. If default option defined it must be in list of\n#     input's options.\n#         checkbox:\n#             Input with checkbox widget, where user can tick option with\n#             checkmark.\n#         switch:\n#             Input with toggle widget(on/off), where user can toggle option.\n#     Choice:\n#     Inputs where user can select option from predefined list.\n#         select:\n#             Input with select widget, where user can choose option from\n#             dropdown list.\n#         radio_select:\n#             Input with radio button widget, where user can select option by\n#             clicking on it.\n#     Numeric:\n#         Inputs that handling integer and float values.\n#         number:\n#             Input with textbox widget where user can enter integer or float\n#             value.\n#         slider:\n#             Input with slider widget where user can enter value by pooling\n#             pointer.\n#     Textual:\n#     Inputs that handling single and multi line strings.\n#         text:\n#             Input with textbox widget. Suitable for simple single-line string,\n#             entity name for instance.\n#         textarea:\n#             Input with textarea widget. Suitable for long multi-line string,\n#             some description for example.\ninputs:                                         # Optional. User input list.\n  - name: text_example                              # Required. Input name. Used in template dynamic variables. Must be unique acros all inputs.\n    type: text                                  # Required. Input type.\n    label: 'User Name'                          # Optional. User friendly short input title.\n    default: 'John Connor'                      # Optional. Default input value. Used if was no input from user.\n    description: 'Input description for user.'  # Optional. Valuable for user description of this input.\n\n  - name: textarea_example\n    type: textarea\n    label: 'Short Bio'\n    default: 'This is a short bio for Jon'\n\n  - name: select_example\n    type: select\n    label: 'Select one options from the dropdown'\n    default: 'option_b'                         # Optional. Default option. Must be in list of input's options.\n    options:\n    - name: option_a                            # Required. Option name. Must be unique across all input's options.\n      value: 'option_a_value'                   # Required. Option value that will put into dynamic template variable(in this case `{{ inputs.select_example }}`).\n      description: 'Helpful hit for user regarding this option.'  # Optional. User valuable description what consequences will face user if choose this option.\n      label: 'Option A'                         # Optional. User friendly short option title.\n    - name: option_b\n      value: 'option_b_value'\n      label: 'Option B'\n\n  - name: radio_select_example\n    type: radio_select\n    label: 'Select one options clicking on radio button.'\n    default: 'option_b'                         # Optional. Default option. Must be in list of input's options.\n    options:\n    - name: option_a                            # Required. Option name. Must be unique across all input's options.\n      value: 'option_a_value'                   # Required. Option value that will put into dynamic template variable(in this case `{{ inputs.radio_select_example }}`).\n      description: 'Helpful hit for user regarding this option.'  # Optional. User valuable description what consequences will face user if choose this option.\n      label: 'Option A'                         # Optional. User friendly short option title.\n    - name: option_b\n      value: 'option_b_value'\n      label: 'Option B'\n\n  - name: switch_example\n    type: switch\n    label: 'Toggle this off or on'\n    default: true  # or false\n\n  - name: checkbox_example\n    type: checkbox\n    label: 'Enable or disable this'\n    default: false  # or true\n\n  - name: slider_example\n    type: slider\n    label: 'Choose some numeric value.'\n    min: 1                                      # Required. Minimal value.\n    max: 10                                     # Required. Maximal value.\n    step: 0.5                                   # Required. Step of pointer.\n    default: 5                                  # Optional. Default input value. Must be greater or equal minimal value and less of equal maximal value.\n\n  - name: number_example\n    type: number\n    label: 'Enter some numeric value'\n    min: 1                                      # Optional. Minimal value.\n    max: 10                                     # Optional. Maximal value.\n    default: 5",
        parsed_template: {
          name: 'my-new-service        2',
          components: [
            {
              name: 'redis',
              type: 'helm_chart',
              chart: 'bitnami/redis',
              version: '17.0.6',
              values: [
                {
                  db: {
                    username: '{{{ inputs.username }}}',
                  },
                },
              ],
            },
          ],
          inputs: [
            {
              name: 'text_example',
              type: 'text',
              label: 'User Name',
              default: 'John Connor',
              description: 'Input description for user.',
            },
            {
              name: 'textarea_example',
              type: 'textarea',
              label: 'Short Bio',
              default: 'This is a short bio for Jon',
            },
            {
              name: 'select_example',
              type: 'select',
              label: 'Select one options from the dropdown',
              default: 'option_b',
              options: [
                {
                  name: 'option_a',
                  value: 'option_a_value',
                  description: 'Helpful hit for user regarding this option.',
                  label: 'Option A',
                },
                {
                  name: 'option_b',
                  value: 'option_b_value',
                  label: 'Option B',
                },
              ],
            },
            {
              name: 'radio_select_example',
              type: 'radio_select',
              label: 'Select one options clicking on radio button.',
              default: 'option_b',
              options: [
                {
                  name: 'option_a',
                  value: 'option_a_value',
                  description: 'Helpful hit for user regarding this option.',
                  label: 'Option A',
                },
                {
                  name: 'option_b',
                  value: 'option_b_value',
                  label: 'Option B',
                },
              ],
            },
            {
              name: 'switch_example',
              type: 'switch',
              label: 'Toggle this off or on',
              default: true,
            },
            {
              name: 'checkbox_example',
              type: 'checkbox',
              label: 'Enable or disable this',
              default: false,
            },
            {
              name: 'slider_example',
              type: 'slider',
              label: 'Choose some numeric value.',
              min: 1,
              max: 10,
              step: 0.5,
              default: 5,
            },
            {
              name: 'number_example',
              type: 'number',
              label: 'Enter some numeric value',
              min: 1,
              max: 10,
              default: 5,
            },
          ],
        },
        creator: {
          id: 'a2acdb5d-8552-4e4e-9123-1a8481ca667f',
          email: 'ee@ee.com',
          is_active: true,
          is_verified: false,
          role: 'admin',
        },
        organization: {
          id: 3,
          title: 'Weber PLC',
        },
      },
    ]);
    // setTemplates(templatesData);
  }, [templatesData]);

  useEffect(() => {
    if (templates.length) {
      const unique = [...new Set(templates.map((item) => item.name))];
      const res = unique.map((item) => ({
        name: item,
        templates: templates.filter((searchItem) => searchItem.name === item).reverse(),
      }));
      setTransformedTemplates(res);
      if (!selectedTemplateId) {
        setTemplateId(res[0].templates[0].id);
      }
    }
  }, [templates]);

  useEffect(() => {
    if (infoMessage?.status) {
      showMessage(infoMessage);
      dispatch(getTemplatesList());
    }
  }, [infoMessage]);

  useEffect(() => {
    const templateIndex = transformedTemplates.findIndex((template) => {
      return template.templates.find((item) => templateId === item.id);
    });
    const oneTemplate = templates.find((template) => templateId === template.id);
    if (oneTemplate?.template.substring(0, 1) === '\n') {
      setTemplateYamlText(oneTemplate?.template.substring(1));
    } else {
      setTemplateYamlText(oneTemplate?.template);
    }
    setSelectedIndex(templateIndex);
    setInfoMessageError('');
  }, [templateId]);

  useEffect(() => {
    const oneTemplate = templates.find((template) => editTemplateId === template.id);
    if (oneTemplate?.template.substring(0, 1) === '\n') {
      setTemplateYamlText(oneTemplate?.template.substring(1));
    } else {
      setTemplateYamlText(oneTemplate?.template);
    }
  }, [editTemplateId]);

  const showMessage = (res) => {
    if (res.status === 'success') {
      setInfoMessageSuccess(res.message);
    } else {
      setInfoMessageError(res.message);
    }
    setTimeout(() => {
      setInfoMessageError('');
      setInfoMessageSuccess('');
    }, 2000);
  };

  const toggleDeleteModalOpen = () => {
    setIsDeleteModalOpen(!isDeleteModalOpen);
  };
  const handleDeleteTemplate = () => {
    setInfoMessageError('');
    setInfoMessageSuccess('');
    toggleDeleteModalOpen();
  };
  const handleDeleteCancel = () => {
    toggleDeleteModalOpen();
  };
  const handleDeleteConfirm = async () => {
    await dispatch(deleteTemplate(templateId));

    toggleDeleteModalOpen();
  };

  const handleOnChangeTemplate = (value) => {
    setTemplateYamlText(value);
  };

  const handleClickEdit = () => {
    try {
      const template = templates.find((template) => templateId === template.id);
      setModalInfo({
        action: 'EDIT',
        title: `Edit ${template.name}`,
        confirmText: 'Save',
        template,
      });
      setOpenModal(true);
    } catch (e) {
      setInfoMessageError('Please select a template');
      setTimeout(() => {
        setInfoMessageError('');
      }, 2000);
    }
  };

  const handleClickAdd = () => {
    setInfoMessageError('');
    setModalInfo({
      action: 'CREATE',
      title: 'New template',
      confirmText: 'Add',
    });
    setOpenModal(true);
  };

  const handleChangeAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  if (isLoading) {
    return (
      <div className='w-full flex flex-col min-h-full'>
        <FuseLoading />
      </div>
    );
  }
  return (
    <div className='p-24'>
      {user?.role === 'admin' && (
        <div className='flex justify-between items-center mb-12'>
          <ToggleButtonGroup
            color='primary'
            value={alignment}
            exclusive
            onChange={handleChangeAlignment}
            aria-label='Platform'
          >
            <ToggleButton value='catalog'>
              Catalog <GridViewIcon className='ml-6' />
            </ToggleButton>
            <ToggleButton value='templates'>
              Templates <ViewListIcon className='ml-6' />
            </ToggleButton>
          </ToggleButtonGroup>
          <Button color='primary' variant='contained' onClick={handleClickAdd}>
            Add templete
          </Button>
        </div>
      )}

      {user?.role === 'admin' && alignment === 'templates' ? (
        <div className='flex justify-between'>
          <List className='w-5/12 pt-0 h-[70vh] overflow-y-scroll mr-12'>
            {transformedTemplates?.map((template, index) => (
              <TemplatesListItem
                key={template.name}
                selectedIndex={selectedIndex}
                mainIndex={index}
                template={template.templates}
                setTemplateId={setTemplateId}
                setSelectedTemplateId={setSelectedTemplateId}
                setTemplates={setTemplates}
                alignment={alignment}
              />
            ))}
          </List>

          <div className='w-7/12'>
            <div style={{ height: 'calc(100vh - 364px)' }}>
              <MonacoEditor
                height='100%'
                value={templateYamlText}
                language='yaml'
                onChange={handleOnChangeTemplate.bind(this)}
                options={{ theme: 'vs-dark', readOnly: true, automaticLayout: true }}
              />
            </div>
            <div className='mt-36 flex justify-between items-center'>
              <Button size='large' color='error' variant='outlined' onClick={handleDeleteTemplate}>
                Delete
              </Button>
              <div>
                <div>{infoMessageError && <p className='text-red'>{infoMessageError}</p>}</div>
                <div>{infoMessageSuccess && <p className='text-green'>{infoMessageSuccess}</p>}</div>
              </div>
              <Button size='large' color='primary' variant='outlined' onClick={handleClickEdit}>
                Edit
              </Button>
            </div>
          </div>

          <DialogModal
            isOpen={isDeleteModalOpen}
            onClose={handleDeleteCancel}
            title='Delete template'
            text='Are you sure you want to proceed?'
            onCancel={handleDeleteCancel}
            cancelText='Cancel'
            onConfirm={handleDeleteConfirm}
            confirmText='Delete'
            fullWidth
          />
        </div>
      ) : (
        <div className='flex'>
          <CatalogList transformedTemplates={transformedTemplates} />
        </div>
      )}
      <TemplateProvider>
        <TemplatesModal
          setTemplates={setTemplates}
          openModal={openModal}
          setOpenModal={setOpenModal}
          modalInfo={modalInfo}
          setEditTemplateId={setEditTemplateId}
        />
      </TemplateProvider>
    </div>
  );
};

export default TemplatesList;
