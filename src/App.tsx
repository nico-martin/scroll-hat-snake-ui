import React from 'react';
import ReactDOM from 'react-dom';
import { Icon, Loader, Message } from '@theme';
import cn from '@common/utils/classnames';
import styles from './App.css';
import BluetoothButton from './app/BluetoothButton';
import ControlPanel from './app/ControlPanel';
import Device from './app/Device';
import Footer from './app/Footer';
import IntensityControls from './app/IntensityControls';

const BROWSER_SUPPORT = 'bluetooth' in navigator;

const BLE_UUID = {
  SERVICE_BATTERY: 0x180f,
  CHAR_BATTERY: 0x2a19,
  CHAR_BATTERY_LOADING: '17324f48-a9c3-487a-83ff-e6046cf48b51',
  SERVICE_GAME: '75c7c8d2-7121-4267-b885-eb3f4a21faf5',
  CHAR_DIRECTIONS: '35a1022c-fdd3-11eb-9a03-0242ac130003',
  CHAR_SNAKE_LENGTH: 'b7d1871e-766f-4382-831f-525d14c32d1e',
  CHAR_GAMECOUNT: '0144e26e-849f-415d-a9c0-db05e4a37230',
  CHAR_LED_INTENSITY: '0e5781c5-d5b5-402c-82f8-307e4350f5ce',
  CHAR_GAMESTATE: '015703a5-edf1-4559-939e-e70adb14916d',
};

const App = () => {
  const [bleDevice, setBleDevice] = React.useState<BluetoothDevice>(null);
  const [bleCharBattery, setBleCharBattery] =
    React.useState<BluetoothRemoteGATTCharacteristic>(null);
  const [bleCharBatteryLoading, setBleCharBatteryLoading] =
    React.useState<BluetoothRemoteGATTCharacteristic>(null);
  const [bleCharDirections, setBleCharDirections] =
    React.useState<BluetoothRemoteGATTCharacteristic>(null);
  const [bleCharSnakeLength, setBleCharSnakeLength] =
    React.useState<BluetoothRemoteGATTCharacteristic>(null);
  const [bleCharGamecount, setBleCharGamecount] =
    React.useState<BluetoothRemoteGATTCharacteristic>(null);
  const [bleCharLed, setBleCharLed] =
    React.useState<BluetoothRemoteGATTCharacteristic>(null);
  const [bleCharGamestate, setBleCharGamestate] =
    React.useState<BluetoothRemoteGATTCharacteristic>(null);
  const [buttonLoading, setButtonLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');

  const onDisconnected = (event) => {
    const device = event.target;
    console.log(`Device ${device.name} is disconnected.`);
    setBleCharDirections(null);
  };

  const connect = async (): Promise<void> => {
    setButtonLoading(true);
    try {
      const device: BluetoothDevice = await navigator.bluetooth.requestDevice({
        //acceptAllDevices: true,
        filters: [{ name: 'Scroll Hat Snake' }],
        optionalServices: [BLE_UUID.SERVICE_GAME, BLE_UUID.SERVICE_BATTERY],
      });
      setBleDevice(device);
      device.addEventListener('gattserverdisconnected', onDisconnected);
      const server = await device.gatt.connect();
      const serviceGame = await server.getPrimaryService(BLE_UUID.SERVICE_GAME);
      const serviceBattery = await server.getPrimaryService(
        BLE_UUID.SERVICE_BATTERY
      );

      Promise.all([
        serviceGame.getCharacteristic(BLE_UUID.CHAR_DIRECTIONS),
        serviceGame.getCharacteristic(BLE_UUID.CHAR_SNAKE_LENGTH),
        serviceGame.getCharacteristic(BLE_UUID.CHAR_GAMECOUNT),
        serviceGame.getCharacteristic(BLE_UUID.CHAR_LED_INTENSITY),
        serviceGame.getCharacteristic(BLE_UUID.CHAR_GAMESTATE),
        serviceBattery.getCharacteristic(BLE_UUID.CHAR_BATTERY),
        serviceBattery.getCharacteristic(BLE_UUID.CHAR_BATTERY_LOADING),
      ]).then(
        ([
          directions,
          snakeLength,
          gamecount,
          led,
          gamestate,
          battery,
          batteryLoading,
        ]) => {
          setBleCharDirections(directions);
          setBleCharSnakeLength(snakeLength);
          setBleCharGamecount(gamecount);
          setBleCharLed(led);
          setBleCharGamestate(gamestate);
          setBleCharBattery(battery);
          setBleCharBatteryLoading(batteryLoading);
        }
      );
    } catch (error) {
      setError(error.toString());
    }
    setButtonLoading(false);
  };

  return (
    <div className={styles.root}>
      {bleCharDirections === null ? (
        <div className={styles.connectionErrorContainer}>
          {error !== '' && (
            <Message type="error" className={styles.connectionError}>
              {error}
            </Message>
          )}
          {BROWSER_SUPPORT ? (
            <BluetoothButton
              loading={buttonLoading}
              connect={connect}
              className={styles.bluetoothButton}
            />
          ) : (
            <Message type="error" className={styles.connectionError}>
              Your browser does not support the WebBluetooth API:{' '}
              <a href="https://caniuse.com/web-bluetooth" target="_blank">
                https://caniuse.com/web-bluetooth
              </a>
            </Message>
          )}
        </div>
      ) : (
        <React.Fragment>
          <ControlPanel
            charDirections={bleCharDirections}
            charSnakeLength={bleCharSnakeLength}
            charGamecount={bleCharGamecount}
            charGamestate={bleCharGamestate}
          />
          <IntensityControls
            className={styles.ledControls}
            charLed={bleCharLed}
          />
          <Device
            className={styles.device}
            bleDevice={bleDevice}
            bleCharBattery={bleCharBattery}
            bleCharBatteryLoading={bleCharBatteryLoading}
          />
        </React.Fragment>
      )}
      <Footer className={cn(styles.footer)} />
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector('#app'));
