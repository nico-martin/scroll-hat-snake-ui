import React from 'react';

const decoder = new TextDecoder();

const IntensityControls = ({
  className = '',
  charLed,
}: {
  className?: string;
  charLed: BluetoothRemoteGATTCharacteristic;
}) => {
  const [init, setInit] = React.useState<boolean>(false);
  const [value, setValue] = React.useState<number>();

  React.useEffect(() => {
    value && charLed.writeValue(new Uint8Array([value]));
  }, [value]);

  React.useEffect(() => {
    charLed.readValue().then((v) => {
      setValue(parseInt(decoder.decode(v)));
      setInit(true);
    });
  }, []);

  return init ? (
    <input
      type="range"
      min={50}
      max={255}
      value={value}
      onMouseUp={(e) =>
        setValue(parseInt((e.target as HTMLInputElement).value))
      }
    />
  ) : null;
};

export default IntensityControls;
