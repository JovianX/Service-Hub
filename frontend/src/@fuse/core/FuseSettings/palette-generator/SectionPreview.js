import clsx from 'clsx';
import Box from '@mui/material/Box';
import { darken, lighten } from '@mui/material/styles';
import { red } from '@mui/material/colors';

function SectionPreview(props) {
  const { section, className } = props;
  return (
    <div
      className={clsx(
        'flex w-128 h-80 rounded-md overflow-hidden border-1 hover:opacity-80',
        className
      )}
    >
      <Box
        sx={{
          backgroundColor:
            section === 'navbar'
              ? red['100']
              : (theme) =>
                  theme.palette.mode === 'light'
                    ? lighten(theme.palette.background.default, 0.4)
                    : lighten(theme.palette.background.default, 0.02),
          '& > div': {
            backgroundColor:
              section === 'navbar'
                ? red['200']
                : (theme) =>
                    theme.palette.mode === 'light'
                      ? darken(theme.palette.background.default, 0.1)
                      : lighten(theme.palette.background.default, 0.1),
          },
        }}
        className="w-32 pt-12 px-6 space-y-1"
      >
        <div className="h-4 rounded-sm" />
        <div className="h-4 rounded-sm" />
        <div className="h-4 rounded-sm" />
        <div className="h-4 rounded-sm" />
        <div className="h-4 rounded-sm" />
      </Box>
      <div className="flex flex-col flex-auto border-l">
        <Box
          sx={{
            backgroundColor:
              section === 'toolbar'
                ? red['100']
                : (theme) =>
                    theme.palette.mode === 'light'
                      ? lighten(theme.palette.background.default, 0.4)
                      : lighten(theme.palette.background.default, 0.02),
            '& > div': {
              backgroundColor:
                section === 'toolbar'
                  ? red['200']
                  : (theme) =>
                      theme.palette.mode === 'light'
                        ? darken(theme.palette.background.default, 0.1)
                        : lighten(theme.palette.background.default, 0.1),
            },
          }}
          className={clsx('h-12 flex items-center justify-end h-full pr-6')}
        >
          <div className="w-4 h-4 ml-4 rounded-full" />
          <div className="w-4 h-4 ml-4 rounded-full" />
          <div className="w-4 h-4 ml-4 rounded-full" />
        </Box>
        <Box
          sx={{
            backgroundColor:
              section === 'main'
                ? red['100']
                : (theme) =>
                    theme.palette.mode === 'light'
                      ? lighten(theme.palette.background.default, 0.4)
                      : lighten(theme.palette.background.default, 0.02),
          }}
          className={clsx('flex flex-auto border-t border-b')}
        />
        <Box
          sx={{
            backgroundColor:
              section === 'footer'
                ? red['100']
                : (theme) =>
                    theme.palette.mode === 'light'
                      ? lighten(theme.palette.background.default, 0.4)
                      : lighten(theme.palette.background.default, 0.02),
            '& > div': {
              backgroundColor:
                section === 'footer'
                  ? red['200']
                  : (theme) =>
                      theme.palette.mode === 'light'
                        ? darken(theme.palette.background.default, 0.1)
                        : lighten(theme.palette.background.default, 0.1),
            },
          }}
          className={clsx('h-12 flex items-center pr-6')}
        >
          <div className="w-4 h-4 ml-4 rounded-full" />
          <div className="w-4 h-4 ml-4 rounded-full" />
          <div className="w-4 h-4 ml-4 rounded-full" />
        </Box>
      </div>
    </div>
  );
}

export default SectionPreview;
