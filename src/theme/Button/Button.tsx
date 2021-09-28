import React from 'react';
import { Icon, Loader } from '@theme';
import cn from '@common/utils/classnames';
import styles from './Button.css';

const Button = ({
  children,
  onClick,
  className = '',
  icon = '',
  loading = false,
  disabled = false,
  large = false,
  ...props
}: {
  children?: any;
  onClick?: Function;
  className?: string;
  icon?: string;
  loading?: boolean;
  disabled?: boolean;
  large?: boolean;
  [key: string]: any;
}) => {
  return (
    <button
      onClick={() => onClick()}
      className={cn(styles.root, className, {
        [styles.isLoading]: loading,
        [styles.isLarge]: large,
        [styles.hasIcon]: icon !== '',
      })}
      disabled={disabled || loading}
      {...props}
    >
      <Loader className={styles.loader} />
      {icon !== '' && <Icon icon={icon} className={cn(styles.icon)} />}
      <span className={styles.content}>{children}</span>
    </button>
  );
};

export default Button;
