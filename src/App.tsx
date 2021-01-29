import { ipcRenderer } from 'electron';
import React, { FC } from 'react';
import { render } from 'react-dom';
import { GlobalStyle } from './styles/GlobalStyle';

import Greetings from './components/Greetings';

const mainElement = document.createElement('div');
mainElement.setAttribute('id', 'root');
document.body.appendChild(mainElement);
ipcRenderer.on('github-oath-reply', (event, { access_token }) => {
  console.log('accesstoken', access_token);
});

const App: FC = () => {
  return (
    <>
      <GlobalStyle />
      <Greetings />
    </>
  );
};

render(<App />, mainElement);
