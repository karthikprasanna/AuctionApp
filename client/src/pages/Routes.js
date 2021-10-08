import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Marketplace from "./Marketplace";
import Portal from "./Portal";
import Cart from "./Cart";
import NotFound from "./NotFound";

const Routes = (props) => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Marketplace />
        </Route>
        <Route exact path="/portal">
          <Portal />
        </Route>
        <Route exact path="/cart">
          <Cart />
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
