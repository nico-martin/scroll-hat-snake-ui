import React from 'react';
import cn from '@common/utils/classnames';
import ArrowControls from './ArrowControls';
import styles from './ControlPanel.css';
import useBLENotification from './hooks/useBLENotification';

const decoder = new TextDecoder();

const GAME_STATES = ['GAME', 'STOP', 'RESTART', 'PAUSE'];

const ControlPanel = ({
  className = '',
  charDirections,
  charSnakeLength,
  charGamecount,
  charGamestate,
}: {
  className?: string;
  charDirections: BluetoothRemoteGATTCharacteristic;
  charSnakeLength: BluetoothRemoteGATTCharacteristic;
  charGamecount: BluetoothRemoteGATTCharacteristic;
  charGamestate: BluetoothRemoteGATTCharacteristic;
}) => {
  const { value: snakeLengthChar } = useBLENotification(charSnakeLength);
  const { value: gamecountChar } = useBLENotification(charGamecount);
  const { value: gamestateChar, writeValue: writeGamestat } =
    useBLENotification(charGamestate);

  const gamestateCharValue = gamestateChar ? gamestateChar.getUint8(0) : null;

  console.log('gamestateCharValue', gamestateCharValue);

  return gamestateCharValue !== null ? (
    <div className={cn(className, styles.root)}>
      <div className={styles.about}>
        <p>
          Score:{' '}
          {snakeLengthChar ? parseInt(decoder.decode(snakeLengthChar)) : 0}
        </p>
        <p>
          Game: {gamecountChar ? parseInt(decoder.decode(gamecountChar)) : 0}
        </p>
      </div>
      <div className={styles.controls}>
        {gamestateCharValue === 1 && <p>GAME OVER</p>}
        {gamestateCharValue === 2 && (
          <button onClick={() => writeGamestat(new Uint8Array([0]))}>
            START
          </button>
        )}
        {(gamestateCharValue === 0 || gamestateCharValue === 3) && (
          <ArrowControls
            className={styles.arrowControls}
            onChange={(dirIndex) =>
              charDirections.writeValue(new Uint8Array([dirIndex]))
            }
          />
        )}
      </div>
    </div>
  ) : null;
};

export default ControlPanel;
