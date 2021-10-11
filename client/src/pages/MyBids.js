import React, { useState, useEffect, useContext } from "react";
import {
  Card,
  Avatar,
  Row,
  Col,
  Tag,
  Modal,
  InputNumber,
  message,
  Spin,
  Input,
  Tooltip,
  Space,
} from "antd";
import EthCrypto from "eth-crypto";
import keccak256 from "keccak256";
import { CopyOutlined } from "@ant-design/icons";

import { BlockchainContext } from "../App";
import { sampleImages } from "../components/SampleImages";
import { ReactComponent as EthereumIcon } from "../assets/ethereum-icon.svg";

const { Meta } = Card;

const ItemCard = ({ item, setModal, generateIdentity }) => {
  let actions = [];
  if (item.auctionStatus == 0) {
    actions = [<div>Bidding is active</div>];
  } else if (item.auctionStatus == 1) {
    actions = [
      <div
        onClick={() => {
          generateIdentity();
          setModal({ visible: true, ...item });
        }}
      >
        Verify Bid
      </div>,
    ];
  } else if (item.auctionStatus == 2) {
    actions = [<div>Sold</div>];
  }
  return (
    <Col>
      <Card
        style={{ width: 300, margin: "20px 0" }}
        cover={
          <img
            style={{ width: "100%" }}
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

const MyBids = ({ fetchBalance }) => {
  const [items, setItems] = useState([]);

  const { userAccount, contract } = useContext(BlockchainContext);
  const [loading, setLoading] = useState(true);

  const fetchListings = () => {
    contract.methods
      .viewActiveListings(true)
      .call()
      .then((data) => JSON.parse(data))
      .then((data) => {
        console.log(data);
        setItems(data.filter((item) => item.alreadyBid == "0x01"));
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => fetchListings(), []);

  const [modal, setModal] = useState({ visible: false });
  const [input, setInput] = useState({
    bid: 0,
    confirmKey: "",
    publicKey: "",
    privateKey: "",
  });

  const generateIdentity = () => {
    setInput({ ...input, ...EthCrypto.createIdentity() });
  };

  return (
    <>
      {loading && (
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spin />
        </div>
      )}
      {!loading &&
        (items.length == 0 ? (
          <div style={{ margin: "2rem 0" }}>No items found</div>
        ) : (
          <Row align="center" gutter={[26, 26]}>
            {items.map((item, key) => {
              return (
                <ItemCard
                  item={item}
                  setModal={setModal}
                  generateIdentity={generateIdentity}
                />
              );
            })}
          </Row>
        ))}

      <Modal
        title={modal.itemName}
        centered
        visible={modal.visible}
        onOk={() => {
          message.loading("Verifying bid..", 0.6);
          const hashedString = keccak256(
            userAccount + input.confirmKey + input.bid
          );
          contract.methods
            .verifyBid(modal.itemId, input.confirmKey, input.publicKey)
            .send({
              from: userAccount,
              gas: 3000000,
              value: input.bid,
            })
            .then((item) => {
              fetchListings();
              message.success("Bid verified successfully", 1);
              fetchBalance();
            })
            .catch((err) => {
              message.error(err.message, 3);
              fetchBalance();
            });
          setModal({ visible: false });
          setInput({
            bid: 0,
            confirmKey: "",
            publicKey: "",
            privateKey: "",
          });
        }}
        onCancel={() => {
          setModal({ visible: false });
          setInput({
            bid: 0,
            confirmKey: "",
            publicKey: "",
            privateKey: "",
          });
        }}
        okText={"Verify Bid"}
      >
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <img
            style={{
              width: "100%",
              maxHeight: "240px",
              objectFit: "cover",
            }}
            src={sampleImages[(modal.itemId - 1) % 9]}
          />
          <InputNumber
            placeholder="Enter your previously sent bid amount"
            style={{ width: "100%" }}
            addonAfter={
              <EthereumIcon style={{ height: "1rem", marginRight: "5px" }} />
            }
            value={input.bid != 0 && input.bid}
            onChange={(value) => setInput({ ...input, bid: value })}
          />
          <Input
            placeholder="Enter the secret code"
            value={input.confirmKey}
            onChange={(event) =>
              setInput({ ...input, confirmKey: event.target.value })
            }
          />
          <Input
            placeholder="Secret Delivery key"
            value={input.privateKey}
            suffix={
              <Tooltip title="Click to copy">
                <CopyOutlined
                  onClick={() =>
                    navigator.clipboard.writeText(input.privateKey)
                  }
                />
              </Tooltip>
            }
          />
          <div
            style={{
              textAlign: "center",
              color: "rgba(255, 255, 255, 0.45)",
            }}
          >
            Copy and keep this key safe in order to receive your delivery, if
            you win this auction.
          </div>
        </Space>
      </Modal>
    </>
  );
};

export default MyBids;
