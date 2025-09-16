import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import routes from './routes';
import './styles/global.css';

const App = () => {
  return (
    <Router>
      <Switch>
        {routes.map(({ path, Component }, index) => (
          <Route key={index} path={path} component={Component} />
        ))}
      </Switch>
    </Router>
  );
};

export default App;