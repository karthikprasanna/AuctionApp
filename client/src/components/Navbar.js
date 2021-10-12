import React, { useState } from "react";
import { Layout, Menu, Row, Col } from "antd";
import { Link, useLocation } from "react-router-dom";

import { ReactComponent as EthereumIcon } from "../assets/ethereum-icon.svg";

const { Header } = Layout;

const parseBalance = (num, decimal) =>
  Math.round(10 ** decimal * (num / 10 ** 18)) / 10 ** decimal;

const Navbar = ({ balance }) => {
  const [currentPage, setCurrentPage] = useState(useLocation().pathname);

  return (
    <Header
      style={{
        position: "fixed",
        zIndex: 1,
        width: "100%",
        background: "#141414",
        borderBottom: "1px solid #303030",
        padding: "0",
      }}
    >
      <Row>
        <Col style={{ paddingLeft: "50px" }}>Auction-Bay</Col>
        <Col flex="1">
          <Menu
            mode="horizontal"
            defaultSelectedKeys={[currentPage]}
            style={{ border: "0", justifyContent: "center" }}
          >
            <Menu.Item key="/">
              <Link to="/">Market Place</Link>
            </Menu.Item>
            <Menu.Item key="/portal">
              <Link to="/portal">Seller Portal</Link>
            </Menu.Item>
            <Menu.Item key="/mybids">
              <Link to="/mybids">My Bids</Link>
            </Menu.Item>
            <Menu.Item key="/orders">
              <Link to="/orders">Orders</Link>
            </Menu.Item>
          </Menu>
        </Col>
        <Col>
          <div
            style={{
              background: "#177ddc",
              padding: "0 20px",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <EthereumIcon style={{ height: "1rem", marginRight: "5px" }} />
            {balance}
          </div>
        </Col>
      </Row>
    </Header>
  );
};

export default Navbar;
