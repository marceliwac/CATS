import React from 'react';
import styles from './HelpSectionImage.module.scss';

export default function HelpSectionImage(props) {
  const { src, alt, description } = props;

  return (
    <div className={styles.helpSectionImage}>
      <img src={src} alt={alt} />
      <p>{description}</p>
    </div>
  );
}
