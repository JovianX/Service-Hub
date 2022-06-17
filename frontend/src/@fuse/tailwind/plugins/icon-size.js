const plugin = require('tailwindcss/plugin');

const iconSize = plugin(
  ({ addUtilities, theme, e, variants }) => {
    const values = theme('iconSize');

    addUtilities(
      Object.entries(values).map(([key, value]) => ({
        [`.${e(`icon-size-${key}`)}`]: {
          width: value,
          height: value,
          minWidth: value,
          minHeight: value,
          fontSize: value,
          lineHeight: value,
          [`svg`]: {
            width: value,
            height: value,
          },
        },
      })),
      variants('iconSize')
    );
  },
  {
    theme: {
      iconSize: (theme) => ({
        ...theme('spacing'),
      }),
    },
    variants: {
      iconSize: ['responsive'],
    },
  }
);

module.exports = iconSize;
