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
import ItemDetailsCard from "../components/ItemDetailsCard";

const ItemCard = ({ item, setModal, generateIdentity }) => {
  let actions = [];
  console.log(item);
  if (item.auctionType == 3) {
    actions = [
      <div
        onClick={() => {
          generateIdentity();
          setModal({ visible: true, ...item });
        }}
      >
        Buy
      </div>,
    ];
  } else {
    if (item.alreadyBid == "0x01") {
      actions = [<div>Bid Placed</div>];
    } else {
      actions = [
        <div onClick={() => setModal({ visible: true, ...item })}>
          Place Bid
        </div>,
      ];
    }
  }
  return (
    <Col>
      <ItemDetailsCard item={item} actions={actions} />
    </Col>
  );
};

const Marketplace = ({ fetchBalance }) => {
  const [items, setItems] = useState([]);

  const { userAccount, contract } = useContext(BlockchainContext);
  const [loading, setLoading] = useState(true);

  const fetchListings = () => {
    contract.methods
      .viewActiveListings(false)
      .call()
      .then((data) => JSON.parse(data))
      .then((data) => {
        setItems(data);
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
      {modal.auctionType == 3 ? (
        <Modal
          title={modal.itemName}
          centered
          visible={modal.visible}
          onOk={() => {
            contract.methods
              .verifyBid(modal.itemId, "", input.publicKey)
              .send({
                from: userAccount,
                gas: 3000000,
                value: modal.askingPrice,
              })
              .then((item) => {
                fetchListings();
                message.success("Item Bought", 1);
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
          okText={"Buy"}
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
              Copy and keep this key safe in order to receive your delivery
            </div>
          </Space>
        </Modal>
      ) : (
        <Modal
          title={modal.itemName}
          centered
          visible={modal.visible}
          onOk={() => {
            message.loading("Placing the bid..", 0.6);
            const hashedString = keccak256(
              userAccount + input.confirmKey + input.bid
            );
            contract.methods
              .bidItem(modal.itemId, hashedString)
              .send({
                from: userAccount,
                gas: 3000000,
              })
              .then((item) => {
                fetchListings();
                message.success("Bid placed successfully", 1);
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
          okText={"Place Bid"}
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
              placeholder="Enter your bid amount"
              style={{ width: "100%" }}
              addonAfter={
                <EthereumIcon style={{ height: "1rem", marginRight: "5px" }} />
              }
              value={input.bid != 0 && input.bid}
              onChange={(value) => setInput({ ...input, bid: value })}
            />
            <Input
              placeholder="Enter a secret code to verify bid later on"
              value={input.confirmKey}
              onChange={(event) =>
                setInput({ ...input, confirmKey: event.target.value })
              }
            />
          </Space>
        </Modal>
      )}
    </>
  );
};

export default Marketplace;
