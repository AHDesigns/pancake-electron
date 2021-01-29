import { ipcRenderer, shell } from 'electron';
import React from 'react';

import { Container, Image, Text } from './styles';
import Button from '../Button';

const Greetings: React.FC = () => {
  return (
    <Container>
      <Image
        src="https://www.vectorlogo.zone/logos/reactjs/reactjs-icon.svg"
        alt="ReactJS logo"
      />
      <Text>
        An Electron boilerplate including TypeScript, React, Jest and ESLint.
      </Text>
      <Button
        onClick={() => {
          ipcRenderer.send('github-oauth', 'getToken');
          console.log('emit');
        }}
      >
        I am the new button
      </Button>
      <Button
        onClick={() => {
          shell.openExternal('https://github.com/settings/tokens/new');
        }}
      >
        Login
      </Button>
    </Container>
  );
};

export default Greetings;
