import React from 'react';
import styles from './Rulesets.module.scss';
import useApiData from '../../../../hooks/useApiData';
import Loading from '../../Common/Loading/Loading';
import { getErrorComponentFromHttpError } from '../../Common/Error/Error';

export default function Rulesets() {
  const { data, error, isLoading } = useApiData({
    path: `/participant/rulesets`,
  });

  if (isLoading) {
    return <Loading message="Fetching ruleset..." />;
  }

  if (error || data === null) {
    return getErrorComponentFromHttpError(error);
  }

  return <p>{JSON.stringify(data)}</p>;
}
