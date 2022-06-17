const config = {
  title: 'Layout 3 - Horizontal',
  defaults: {
    mode: 'container',
    containerWidth: 1120,
    scroll: 'content',
    navbar: {
      display: true,
      style: 'fixed',
    },
    toolbar: {
      display: true,
      style: 'static',
      position: 'below',
    },
    footer: {
      display: true,
      style: 'fixed',
    },
    leftSidePanel: {
      display: true,
    },
    rightSidePanel: {
      display: true,
    },
  },
  form: {
    mode: {
      title: 'Mode',
      type: 'radio',
      options: [
        {
          name: 'Boxed',
          value: 'boxed',
        },
        {
          name: 'Full Width',
          value: 'fullwidth',
        },
        {
          name: 'Container',
          value: 'container',
        },
      ],
    },
    containerWidth: {
      title: 'Container Width (px)',
      type: 'number',
    },
    navbar: {
      type: 'group',
      title: 'Navbar',
      children: {
        display: {
          title: 'Display',
          type: 'switch',
        },
        style: {
          title: 'Style',
          type: 'radio',
          options: [
            {
              name: 'Fixed',
              value: 'fixed',
            },
            {
              name: 'Static',
              value: 'static',
            },
          ],
        },
      },
    },
    toolbar: {
      type: 'group',
      title: 'Toolbar',
      children: {
        display: {
          title: 'Display',
          type: 'switch',
        },
        position: {
          title: 'Position',
          type: 'radio',
          options: [
            {
              name: 'Above',
              value: 'above',
            },
            {
              name: 'Below',
              value: 'below',
            },
          ],
        },
        style: {
          title: 'Style',
          type: 'radio',
          options: [
            {
              name: 'Fixed',
              value: 'fixed',
            },
            {
              name: 'Static',
              value: 'static',
            },
          ],
        },
      },
    },
    footer: {
      type: 'group',
      title: 'Footer',
      children: {
        display: {
          title: 'Display',
          type: 'switch',
        },
        style: {
          title: 'Style',
          type: 'radio',
          options: [
            {
              name: 'Fixed',
              value: 'fixed',
            },
            {
              name: 'Static',
              value: 'static',
            },
          ],
        },
      },
    },
  },
};

export default config;
