import React from 'react';
import { Icon, Loader } from '@theme';
import cn from '@common/utils/classnames';
import styles from './Device.css';
import Battery from './Device/Battery';

const Device = ({
  className = '',
  bleDevice,
  bleCharBattery,
  bleCharBatteryLoading,
}: {
  className?: string;
  bleDevice: BluetoothDevice;
  bleCharBattery: BluetoothRemoteGATTCharacteristic;
  bleCharBatteryLoading: BluetoothRemoteGATTCharacteristic;
}) => {
  const [powerOffLoading, setPowerOffLoading] = React.useState<boolean>(false);

  return (
    <div className={cn(className, styles.root)}>
      <button
        className={styles.powerOff}
        disabled={powerOffLoading}
        onClick={() => {
          if (bleDevice) {
            bleDevice.gatt.disconnect();
            setPowerOffLoading(false);
          }
        }}
      >
        {powerOffLoading ? (
          <Loader className={styles.powerOffLoader} />
        ) : (
          <Icon icon="mdi/power" />
        )}
      </button>
      <div className={styles.deviceInfo}>
        <p>{bleDevice.name}</p>
        <Battery
          bleCharBattery={bleCharBattery}
          bleCharBatteryLoading={bleCharBatteryLoading}
        />
      </div>
    </div>
  );
};

export default Device;
