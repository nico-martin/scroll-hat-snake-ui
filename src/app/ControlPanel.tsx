import React from 'react';
import { Button } from '@theme';
import cn from '@common/utils/classnames';
import ArrowControls from './ArrowControls';
import styles from './ControlPanel.css';
import useBLENotification from './hooks/useBLENotification';

const decoder = new TextDecoder();

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
  const { value: snakeLengthChar } = useBLENotification(charSnakeLength, {
    read: true,
    notify: true,
  });
  const { value: gamecountChar } = useBLENotification(charGamecount, {
    read: true,
    notify: true,
  });
  const { value: gamestateChar, writeValue: writeGamestat } =
    useBLENotification(charGamestate, {
      read: true,
      notify: true,
      write: true,
    });

  React.useEffect(() => {
    return () => {
      writeGamestat(new Uint8Array([1]));
    };
  }, []);

  const gamestateCharValue = gamestateChar ? gamestateChar.getUint8(0) : null;

  return gamestateCharValue !== null ? (
    <div className={cn(className, styles.root)}>
      <div className={styles.about}>
        <p className={styles.aboutItem}>
          Score:{' '}
          {snakeLengthChar ? parseInt(decoder.decode(snakeLengthChar)) : 0}
        </p>
        <p className={styles.aboutItem}>
          Game: {gamecountChar ? parseInt(decoder.decode(gamecountChar)) : 0}
        </p>
      </div>
      <div className={styles.controls}>
        {gamestateCharValue === 1 && (
          <p className={styles.gameOver}>GAME OVER</p>
        )}
        {gamestateCharValue === 2 && (
          <Button onClick={() => writeGamestat(new Uint8Array([0]))}>
            Start Game
          </Button>
        )}
        {(gamestateCharValue === 0 || gamestateCharValue === 3) && (
          <ArrowControls
            className={styles.arrowControls}
            onChange={(dirIndex) =>
              charDirections.writeValue(new Uint8Array([dirIndex]))
            }
            disabled={gamestateCharValue === 3}
          />
        )}
      </div>
    </div>
  ) : null;
};

export default ControlPanel;
