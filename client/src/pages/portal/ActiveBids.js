import React, { useState, useEffect, useContext } from "react";
import { Row, Col, message } from "antd";

import { BlockchainContext } from "../../App";
import ItemDetailsCard from "../../components/ItemDetailsCard";

const ItemCard = ({ item, fetchListings, fetchBalance }) => {
  const { userAccount, contract } = useContext(BlockchainContext);
  let actions = [
    <div
      onClick={() => {
        contract.methods
          .closeBid(item.itemId)
          .send({ from: userAccount, gas: 3000000 })
          .then((item) => {
            fetchListings();
            message.success("Bidding closed", 1);
            fetchBalance();
          })
          .catch((err) => {
            message.error(err.message, 3);
            fetchBalance();
          });
      }}
    >
      Stop Bidding
    </div>,
  ];

  return (
    <Col>
      <ItemDetailsCard item={item} actions={actions} />
    </Col>
  );
};

const ActiveBids = ({ items, fetchListings, fetchBalance }) => {
  const [activeItems, setActiveItems] = useState([]);
  useEffect(() => {
    setActiveItems(
      items.filter((item) => item.auctionType != 3 && item.auctionStatus == 0)
    );
  }, [items]);
  return activeItems.length == 0 ? (
    <div style={{ margin: "2rem 0" }}>No items found</div>
  ) : (
    <Row
      style={{ width: "100%", marginTop: "3rem" }}
      align="center"
      gutter={[26, 26]}
    >
      {activeItems.map((item, key) => {
        return (
          <ItemCard
            item={item}
            key={key}
            fetchListings={fetchListings}
            fetchBalance={fetchBalance}
          />
        );
      })}
    </Row>
  );
};

export default ActiveBids;
