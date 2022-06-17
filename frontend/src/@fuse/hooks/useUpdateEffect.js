import { useEffect, useRef } from 'react';

const useUpdateEffect = (effect, deps) => {
  const isInitialMount = useRef(true);
  // eslint-disable-next-line
	useEffect(
    isInitialMount.current
      ? () => {
          isInitialMount.current = false;
        }
      : effect,
    deps
  );
};

export default useUpdateEffect;
