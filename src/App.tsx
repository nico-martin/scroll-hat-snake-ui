import React from 'react';
import ReactDOM from 'react-dom';
import { Icon, Loader, Message } from '@theme';
import cn from '@common/utils/classnames';
import styles from './App.css';
import BluetoothButton from './app/BluetoothButton';
import ControlPanel from './app/ControlPanel';
import Footer from './app/Footer';

const BROWSER_SUPPORT = 'bluetooth' in navigator;

const BLE_UUID = {
  SERVICE_GAME: '75c7c8d2-7121-4267-b885-eb3f4a21faf5',
  CHAR_DIRECTIONS: '35a1022c-fdd3-11eb-9a03-0242ac130003',
};

const App = () => {
  const [bleDevice, setBleDevice] = React.useState<BluetoothDevice>(null);
  const [bleCharDirections, setBleCharDirections] =
    React.useState<BluetoothRemoteGATTCharacteristic>(null);
  const [buttonLoading, setButtonLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');
  const [powerOffLoading, setPowerOffLoading] = React.useState<boolean>(false);

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
        optionalServices: [BLE_UUID.SERVICE_GAME],
      });
      setBleDevice(device);
      device.addEventListener('gattserverdisconnected', onDisconnected);
      const server = await device.gatt.connect();
      const serviceGame = await server.getPrimaryService(BLE_UUID.SERVICE_GAME);

      const charDirections = await serviceGame.getCharacteristic(
        BLE_UUID.CHAR_DIRECTIONS
      );

      setBleCharDirections(charDirections);
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
          <ControlPanel characteristic={bleCharDirections} />
          <div className={styles.device}>
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
              <p>
                <b>Device Info</b>
              </p>
              <p>Name: {bleDevice.name}</p>
            </div>
          </div>
        </React.Fragment>
      )}
      <Footer className={cn(styles.footer)} />
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector('#app'));
