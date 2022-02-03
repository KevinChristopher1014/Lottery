import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

import { Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';

import { Provider } from 'react-redux' ;
import { createStore , applyMiddleware , compose } from 'redux' ;
import thunk from 'redux-thunk' ;

import root from './redux/reducers' ;

const Store = createStore(
  root,
  compose(applyMiddleware(thunk))
)

const getLibrary = (provider) => {
  return new ethers.providers.Web3Provider(provider) ;
}
ReactDOM.render(

    <Web3ReactProvider getLibrary={getLibrary}>
      <Provider store={Store}>
        <App />
      </Provider>
    </Web3ReactProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
