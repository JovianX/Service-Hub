import { ThemeProvider } from '@mui/material/styles';
import { memo, useEffect, useLayoutEffect } from 'react';

const useEnhancedEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

function FuseTheme(props) {
  const { direction, theme } = props;
  const { mode } = theme.palette;

  useEnhancedEffect(() => {
    document.body.dir = direction;
  }, [direction]);

  useEffect(() => {
    document.body.classList.add(mode === 'light' ? 'light' : 'dark');
    document.body.classList.remove(mode === 'light' ? 'dark' : 'light');
  }, [mode]);

  // console.warn('FuseTheme:: rendered',mainTheme);
  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
}

export default memo(FuseTheme);
