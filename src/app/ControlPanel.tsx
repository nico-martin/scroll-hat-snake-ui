import React from 'react';
import ArrowControls from './ArrowControls';

const ControlPanel = ({
  className = '',
  characteristic,
}: {
  className?: string;
  characteristic: BluetoothRemoteGATTCharacteristic;
}) => {
  return (
    <div>
      <ArrowControls
        onChange={(dirIndex) =>
          characteristic.writeValue(new Uint8Array([dirIndex]))
        }
      />
    </div>
  );
};

export default ControlPanel;
