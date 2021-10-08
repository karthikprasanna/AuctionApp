import React, { useState, useEffect } from "react";
import { Card, Avatar, Row, Col, Tag, Modal, InputNumber, message } from "antd";

import { sampleImages } from "../components/SampleImages";
import { ReactComponent as EthereumIcon } from "../assets/ethereum-icon.svg";

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

const Marketplace = (props) => {
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
  const [modal, setModal] = useState({ visible: false, itemId: "" });
  const [bid, setBid] = useState();

  return items.length == 0 ? (
    "No items found"
  ) : (
    <>
      <Row align="center" gutter={[26, 26]}>
        {items.map((item, key) => {
          return <ItemCard item={item} setModal={setModal} />;
        })}
      </Row>

      <Modal
        title="Painting By Picasso, 1756"
        centered
        visible={modal.visible}
        onOk={() => {
          message
            .loading("Placing the bid..", 2.5)
            .then(() => message.success("Bid Placed Successfully", 2.5))
            .catch(() => message.error("Error while placing the bid", 2.5));
          setModal({ visible: false, itemId: "" });
          setBid();
        }}
        onCancel={() => {
          setModal({ visible: false, itemId: "" });
          setBid();
        }}
        okText="Place Bid"
      >
        <img
          style={{
            width: "100%",
            maxHeight: "240px",
            objectFit: "cover",
            marginBottom: "20px",
          }}
          src={sampleImages[0]}
        />
        <InputNumber
          placeholder="Enter your bid amount"
          style={{ width: "100%" }}
          addonAfter={
            <EthereumIcon style={{ height: "1rem", marginRight: "5px" }} />
          }
          value={bid}
          onChange={(value) => setBid(value)}
        />
      </Modal>
    </>
  );
};

export default Marketplace;
