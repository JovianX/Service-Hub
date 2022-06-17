import _ from '@lodash';
import { useRef } from 'react';

function useDebounce(func, wait, options) {
  return useRef(_.debounce(func, wait, options)).current;
}

export default useDebounce;
