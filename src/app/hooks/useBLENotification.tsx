import React from 'react';

const useBLENotification = (
  characteristic: BluetoothRemoteGATTCharacteristic,
  initialRead: boolean = true
): {
  value: DataView;
  writeValue: (DataView) => void;
} => {
  const [value, setValue] = React.useState<DataView>(null);

  const listener = (e) => setValue(e.target.value);

  const writeValue = (data: DataView) => characteristic.writeValue(data);

  React.useEffect(() => {
    initialRead && characteristic.readValue().then((value) => setValue(value));
    characteristic.addEventListener('characteristicvaluechanged', listener);
    characteristic.startNotifications();

    return () => {
      characteristic.removeEventListener(
        'characteristicvaluechanged',
        listener
      );
      characteristic.stopNotifications();
    };
  }, []);

  return { value, writeValue };
};

export default useBLENotification;
