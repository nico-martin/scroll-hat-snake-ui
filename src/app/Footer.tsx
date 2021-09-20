import React from 'react';
import { Icon, PortalBox } from '@theme';
import cn from '@common/utils/classnames';
import pkg from './../../package.json';
import styles from './Footer.css';

const Footer = ({ className = '' }: { className?: string }) => {
  const [isFullScreen, setIsFullScreen] = React.useState<boolean>(false);
  const [infos, setInfos] = React.useState<boolean>(false);

  return (
    <footer className={cn(className, styles.root)}>
      <button className={cn(styles.button)} onClick={() => setInfos(true)}>
        <Icon icon="mdi/info" />
      </button>
      <span className={styles.version}>
        <a
          href="https://github.com/nico-martin/scroll-hat-snake-ui"
          target="_blank"
        >
          WebBluetooth Scroll Hat Snake
        </a>{' '}
        v{pkg.version}
      </span>
      <button
        className={cn(styles.button)}
        onClick={() =>
          isFullScreen
            ? document.exitFullscreen().then(() => setIsFullScreen(false))
            : document
                .querySelector('html')
                .requestFullscreen()
                .then(() => setIsFullScreen(true))
        }
      >
        <Icon icon={`mdi/${isFullScreen ? 'fullscreen-exit' : 'fullscreen'}`} />
      </button>
      {infos && (
        <PortalBox
          close={() => setInfos(false)}
          title="WebBluetooth Light Bulb"
        >
          <div className={styles.info}>
            <p>
              <b>WebBluetooth Scroll Hat Snake</b> is a web-based UI to control a
              "Scroll Hat Snake" Game over WebBluetooth by{' '}
              <a href="https://nico.dev" target="_blank">
                Nico Martin
              </a>
              .
            </p>
            <p>
              You can find more about this interface on{' '}
              <a
                href="https://github.com/nico-martin/scroll-hat-snake-ui"
                target="_blank"
              >
                GitHub
              </a>
              .
            </p>
            <h2>Privacy</h2>
            <p>This web app does not collect any personal data.</p>
            <p>
              If you have further questions, please contact{' '}
              <a href="mailto:nico@sayhello.ch">nico@sayhello.ch</a>
            </p>
          </div>
        </PortalBox>
      )}
    </footer>
  );
};

export default Footer;
