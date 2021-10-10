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

import { sampleImages } from "../../components/SampleImages";

const { Meta } = Card;
const { TextArea } = Input;
const { Option } = Select;

const ItemCard = ({ item, setModal, isPortal }) => {
  let actions = [];
  if (isPortal) {
  } else {
    actions = [
      <div onClick={() => setModal({ visible: true, itemId: "" })}>
        Place Bid
      </div>,
    ];
  }
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

const RevealBids = ({ items }) => {
  return items.length == 0 ? (
    <div style={{ margin: "2rem 0" }}>You haven't added any item yet</div>
  ) : (
    <Row
      style={{ width: "100%", marginTop: "3rem" }}
      align="center"
      gutter={[26, 26]}
    >
      {items.map((item, key) => {
        return (
          <ItemCard item={item} key={key} isPortal={true} setModal={() => {}} />
        );
      })}
    </Row>
  );
};

export default RevealBids;
