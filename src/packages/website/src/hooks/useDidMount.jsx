import React from 'react';

export default function useDidMount() {
  const mountRef = React.useRef(false);

  React.useEffect(() => {
    mountRef.current = true;
  }, []);

  return mountRef.current;
}
