
import React from 'react' ;

import { BrowserRouter , Switch , Route , Redirect } from 'react-router-dom' ;

import Smart from './pages/Smart';

function App() {
  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route exact path="/smart" component={Smart} />
          <Redirect from="/" to="/smart" />
        </Switch>      
      </BrowserRouter>
    </>
  );
}

export default App;
