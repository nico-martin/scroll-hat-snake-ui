import React from 'react';
import ArrowControls from './ArrowControls';
import IntensityControls from './IntensityControls';
import Score from './Score';

const ControlPanel = ({
  className = '',
  charDirections,
  charSnakeLength,
  charGamecount,
  charLed,
  charGamestate,
}: {
  className?: string;
  charDirections: BluetoothRemoteGATTCharacteristic;
  charSnakeLength: BluetoothRemoteGATTCharacteristic;
  charGamecount: BluetoothRemoteGATTCharacteristic;
  charLed: BluetoothRemoteGATTCharacteristic;
  charGamestate: BluetoothRemoteGATTCharacteristic;
}) => {
  return (
    <div>
      <Score charSnakeLength={charSnakeLength} />
      <IntensityControls charLed={charLed} />
      <ArrowControls
        onChange={(dirIndex) =>
          charDirections.writeValue(new Uint8Array([dirIndex]))
        }
      />
    </div>
  );
};

export default ControlPanel;
