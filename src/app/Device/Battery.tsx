import React from 'react';
import { Icon } from '@theme';
import cn from '@common/utils/classnames';
import styles from './Battery.css';

const decoder = new TextDecoder();

const Battery = ({
  className = '',
  bleCharBattery,
  bleCharBatteryLoading,
}: {
  className?: string;
  bleCharBattery: BluetoothRemoteGATTCharacteristic;
  bleCharBatteryLoading: BluetoothRemoteGATTCharacteristic;
}) => {
  const [batteryPercentage, setBatteryPercentage] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const updateBatteryPercentage = (e) =>
    setBatteryPercentage(e.target.value.getUint8(0));
  const updateBatteryLoading = (e) =>
    setIsLoading(e.target.value.getUint8(0) === 1);

  React.useEffect(() => {
    bleCharBattery
      .readValue()
      .then((value) => setBatteryPercentage(value.getUint8(0)));
    bleCharBatteryLoading
      .readValue()
      .then((value) => setIsLoading(value.getUint8(0) === 1));

    bleCharBattery.addEventListener(
      'characteristicvaluechanged',
      updateBatteryPercentage
    );
    bleCharBatteryLoading.addEventListener(
      'characteristicvaluechanged',
      updateBatteryLoading
    );

    bleCharBattery.startNotifications();
    bleCharBatteryLoading.startNotifications();

    return () => {
      bleCharBattery.removeEventListener(
        'characteristicvaluechanged',
        updateBatteryPercentage
      );
      bleCharBatteryLoading.removeEventListener(
        'characteristicvaluechanged',
        updateBatteryPercentage
      );
      bleCharBattery.stopNotifications();
      bleCharBatteryLoading.stopNotifications();
    };
  }, []);

  const batteryStep = React.useMemo(
    () => Math.ceil(batteryPercentage / 10) * 10,
    [batteryPercentage]
  );

  return (
    <p className={cn(className, styles.root)}>
      {batteryPercentage === 0 ? (
        <span>...</span>
      ) : (
        <span className={styles.battery}>
          <Icon
            className={styles.batteryIcon}
            icon={`mdi/battery-${batteryStep === 0 ? 10 : batteryStep}`}
          />{' '}
          {batteryPercentage}% {isLoading && <Icon icon="mdi/lightning" />}
        </span>
      )}
    </p>
  );
};

export default Battery;
