import React from 'react';
import useDidMount from './useDidMount';

export default function usePostInitDebouncing(fn, deps) {
  const didMount = useDidMount();

  // eslint-disable-next-line consistent-return
  React.useEffect(() => {
    if (didMount) {
      const timeout = setTimeout(() => {
        fn();
      }, 1000);
      return () => clearTimeout(timeout);
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
