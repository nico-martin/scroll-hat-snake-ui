import React from 'react';
import { Icon } from '@theme';
import cn from '@common/utils/classnames';
import styles from './IntensityControls.css';
import useBLECharacteristic from './hooks/useBLECharacteristic';

const IntensityControls = ({
  className = '',
  charLed,
}: {
  className?: string;
  charLed: BluetoothRemoteGATTCharacteristic;
}) => {
  const [value, setValue] = React.useState<number>(null);
  const { value: ledValue } = useBLECharacteristic(charLed, {
    read: true,
    notify: true,
  });
  const intensity = ledValue ? ledValue.getUint8(0) : null;

  React.useEffect(() => {
    setValue(intensity);
  }, [intensity]);

  React.useEffect(() => {
    value && charLed.writeValue(new Uint8Array([value]));
  }, [value]);

  return value ? (
    <div className={cn(className, styles.root)}>
      <Icon icon="mdi/brightness-half" className={styles.icon} />
      <input
        className={cn(styles.input)}
        type="range"
        min={50}
        max={255}
        value={value}
        onMouseUp={(e) =>
          setValue(parseInt((e.target as HTMLInputElement).value))
        }
        onTouchEnd={(e) =>
          setValue(parseInt((e.target as HTMLInputElement).value))
        }
      />
    </div>
  ) : null;
};

export default IntensityControls;
