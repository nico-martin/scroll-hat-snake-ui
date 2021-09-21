import React from 'react';

const decoder = new TextDecoder();

const Score = ({
  className = '',
  charSnakeLength,
}: {
  className?: string;
  charSnakeLength: BluetoothRemoteGATTCharacteristic;
}) => {
  const [score, setScore] = React.useState<number>(0);

  const handleNotifications = (e) =>
    setScore(parseInt(decoder.decode(e.target.value)));

  React.useEffect(() => {
    charSnakeLength.addEventListener(
      'characteristicvaluechanged',
      handleNotifications
    );
    charSnakeLength.startNotifications();

    return () =>
      charSnakeLength.removeEventListener(
        'characteristicvaluechanged',
        handleNotifications
      );
  }, []);

  return <p>Score: {score}</p>;
};

export default Score;
