import React from "react";
import { Card, Tag } from "antd";

import { sampleImages } from "./SampleImages";

const { Meta } = Card;

const ItemDetailsCard = ({ item, actions }) => {
  return (
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
  );
};

export default ItemDetailsCard;
