import React from 'react';

import APIClient from '../util/APIClient';

export default function useApiData(props) {
  const { path, params } = props;
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const reload = React.useCallback(() => {
    APIClient.get(path, {
      params: params || {},
    })
      .then((result) => {
        setData(result.data);
      })
      .catch((e) => {
        setError(e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [params, path]);

  React.useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, error, isLoading, reload };
}
