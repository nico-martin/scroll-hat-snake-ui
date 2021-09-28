import React from 'react';
import { Icon } from '@theme';
import cn from '@common/utils/classnames';
import styles from './ArrowControls.css';

const ArrowControls = ({
  className = '',
  onChange,
  disabled = false,
}: {
  className?: string;
  onChange: (direction: number) => void;
  disabled?: boolean;
}) => {
  const up = () => onChange(0x00);
  const left = () => onChange(0x01);
  const right = () => onChange(0x02);
  const down = () => onChange(0x03);

  const keydown = (e) => {
    if (e.keyCode == '38') {
      up();
    } else if (e.keyCode == '40') {
      down();
    } else if (e.keyCode == '37') {
      left();
    } else if (e.keyCode == '39') {
      right();
    }
  };

  React.useEffect(() => {
    !disabled && window.addEventListener('keydown', keydown);
    return () => {
      window.removeEventListener('keydown', keydown);
    };
  }, [disabled]);

  return (
    <div className={cn(styles.root, className)}>
      <div className={styles.buttons}>
        <button
          className={cn(styles.button, styles.arrowUp)}
          onMouseDown={up}
          onTouchStart={up}
        >
          <Icon className={styles.icon} icon="mdi/arrow" />
        </button>
        <button
          className={cn(styles.button, styles.arrowLeft)}
          onMouseDown={left}
          onTouchStart={left}
        >
          <Icon className={styles.icon} icon="mdi/arrow" />
        </button>
        <button
          className={cn(styles.button, styles.arrowRight)}
          onMouseDown={right}
          onTouchStart={right}
        >
          <Icon className={styles.icon} icon="mdi/arrow" />
        </button>
        <button
          className={cn(styles.button, styles.arrowDown)}
          onMouseDown={down}
          onTouchStart={down}
        >
          <Icon className={styles.icon} icon="mdi/arrow" />
        </button>
      </div>
    </div>
  );
};

export default ArrowControls;
