import React, { useState, useEffect, useContext } from "react";
import {
  Row,
  Col,
  Card,
  Tag,
  Modal,
  message,
  InputNumber,
  Input,
  Space,
  Select,
} from "antd";

import { BlockchainContext } from "../../App";
import { sampleImages } from "../../components/SampleImages";

const { Meta } = Card;

const ItemCard = ({
  item,
  setModal,
  isPortal,
  fetchListings,
  fetchBalance,
}) => {
  const { userAccount, contract } = useContext(BlockchainContext);
  let actions = [
    <div
      onClick={() => {
        contract.methods
          .closeBid(item.itemId)
          .send({ from: userAccount, gas: 3000000 })
          .then((item) => {
            fetchListings();
            message.success("Bid closed", 2.5);
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
      <Card
        style={{ width: 300, margin: "20px 0" }}
        cover={
          <img
            style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }}
            src={sampleImages[(item.itemId - 1) % 9]}
          />
        }
        actions={actions}
      >
        <Meta title={item.itemName} description={item.itemDescription} />
        {item.auctionType == 0 && (
          <Tag
            style={{
              marginTop: "20px",
            }}
            color="blue"
          >
            First Price Auction
          </Tag>
        )}
        {item.auctionType == 1 && (
          <Tag
            style={{
              marginTop: "20px",
            }}
            color="volcano"
          >
            Second Price Auction
          </Tag>
        )}
        {item.auctionType == 2 && (
          <Tag
            style={{
              marginTop: "20px",
            }}
            color="magenta"
          >
            Average Price Auction
          </Tag>
        )}
        {item.auctionType == 3 && (
          <Tag
            style={{
              marginTop: "20px",
            }}
            color="green"
          >
            Price: {item.askingPrice} Wei
          </Tag>
        )}
      </Card>
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
