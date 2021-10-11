import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Layout } from "antd";

import { BlockchainContext } from "../App";
import Navbar from "../components/Navbar";
import Marketplace from "./Marketplace";
import Portal from "./Portal";
import MyBids from "./MyBids";
import Orders from "./Orders";
import NotFound from "./NotFound";

const { Content, Footer } = Layout;

const Routes = (props) => {
  const { web3, userAccount } = useContext(BlockchainContext);
  const [balance, setBalance] = useState(0);

  const fetchBalance = () => {
    web3.eth
      .getBalance(userAccount)
      .then((currentBalance) => setBalance(currentBalance));
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  return (
    <BrowserRouter>
      <Layout>
        <Navbar balance={balance} />
        <Content
          className="site-layout"
          style={{
            padding: "50px 50px",
            marginTop: 64,
            minHeight: "80vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            flexDirection: "column",
          }}
        >
          <Switch>
            <Route exact path="/">
              <Marketplace fetchBalance={fetchBalance} />
            </Route>
            <Route exact path="/portal">
              <Portal fetchBalance={fetchBalance} />
            </Route>
            <Route exact path="/mybids">
              <MyBids fetchBalance={fetchBalance} />
            </Route>
            <Route exact path="/orders">
              <Orders fetchBalance={fetchBalance} />
            </Route>
            <Route>
              <NotFound />
            </Route>
          </Switch>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Made with{" "}
          <span role="img" aria-label="blue-heart">
            💙
          </span>{" "}
          by Team BlockDaggers
        </Footer>
      </Layout>
    </BrowserRouter>
  );
};

export default Routes;
