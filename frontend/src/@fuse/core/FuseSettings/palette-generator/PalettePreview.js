import clsx from 'clsx';
import { Box } from '@mui/system';

function PalettePreview(props) {
  const { palette, className } = props;

  return (
    <Box
      className={clsx(
        'w-200 text-left rounded-6 relative font-bold shadow overflow-hidden',
        className
      )}
      sx={{
        backgroundColor: palette.background.default,
        color: palette.text.primary,
      }}
      type="button"
    >
      <Box
        className="w-full h-56 px-8 pt-8 relative"
        sx={{
          backgroundColor: palette.primary.main,
          color: (theme) =>
            palette.primary.contrastText || theme.palette.getContrastText(palette.primary.main),
        }}
      >
        <span className="text-12">Header (Primary)</span>

        <Box
          className="flex items-center justify-center w-20 h-20 rounded-full absolute bottom-0 right-0 -mb-10 shadow text-10 mr-4"
          sx={{
            backgroundColor: palette.secondary.main,
            color: (theme) =>
              palette.secondary.contrastText ||
              theme.palette.getContrastText(palette.secondary.main),
          }}
        >
          <span className="">S</span>
        </Box>
      </Box>
      <div className="pl-8 pr-28 -mt-24 w-full">
        <Box
          className="w-full h-96 rounded-4 relative shadow p-8"
          sx={{
            backgroundColor: palette.background.paper,
            color: palette.text.primary,
          }}
        >
          <span className="text-12 opacity-75">Paper</span>
        </Box>
      </div>

      <div className="px-8 py-8 w-full">
        <span className="text-12 opacity-75">Background</span>
      </div>

      {/* <pre className="language-js p-24 w-400">{JSON.stringify(palette, null, 2)}</pre> */}
    </Box>
  );
}

export default PalettePreview;
