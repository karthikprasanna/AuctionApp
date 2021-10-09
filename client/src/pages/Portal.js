import React, { useState, useEffect } from "react";
import { Row, Col, Card, Tag } from "antd";

import Chip from "../components/Chip";
import { sampleImages } from "../components/SampleImages";

const { Meta } = Card;

const ItemCard = ({ item, setModal }) => {
  return (
    <Col>
      <Card
        style={{ width: 300, margin: "20px 0" }}
        cover={<img style={{ width: "100%" }} src={sampleImages[0]} />}
        actions={[
          true ? (
            <div onClick={() => setModal({ visible: true, itemId: "" })}>
              Place Bid
            </div>
          ) : (
            "Bid Placed"
          ),
        ]}
      >
        <Meta
          title="Painting By Picasso, 1756"
          description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus magni labore saepe ipsam dolores iure."
        />
        <Tag
          style={{
            marginTop: "20px",
          }}
          color="green"
        >
          First Price Auction
        </Tag>
      </Card>
    </Col>
  );
};

const Portal = (props) => {
  const [items, setItems] = useState([
    {
      name: "Abc Def",
      auctionType: "Abc",
      seller: "ASas",
    },
    {
      name: "Abc Def",
      auctionType: "Abc",
      seller: "ASas",
    },
    {
      name: "Abc Def",
      auctionType: "Abc",
      seller: "ASas",
    },
    {
      name: "Abc Def",
      auctionType: "Abc",
      seller: "ASas",
    },
    {
      name: "Abc Def",
      auctionType: "Abc",
      seller: "ASas",
    },
    {
      name: "Abc Def",
      auctionType: "Abc",
      seller: "ASas",
    },
    {
      name: "Abc Def",
      auctionType: "Abc",
      seller: "ASas",
    },
    {
      name: "Abc Def",
      auctionType: "Abc",
      seller: "ASas",
    },
    {
      name: "Abc Def",
      auctionType: "Abc",
      seller: "ASas",
    },
  ]);
  return (
    <>
      <Row style={{ width: "100%" }} gutter={[26, 26]}>
        <Col flex="1">
          <Chip text={"Add Item"} />
        </Col>
        <Col flex="1">
          <Chip text={"View Active Bids"} />
        </Col>
        <Col flex="1">
          <Chip text={"Reveal Bids / Deliver Items"} />
        </Col>
      </Row>
      <Row style={{ width: "100%" }} align="center" gutter={[26, 26]}>
        {items.map((item, key) => {
          return <ItemCard item={item} setModal={() => {}} />;
        })}
      </Row>
    </>
  );
};

export default Portal;
