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
import EthCrypto from "eth-crypto";

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
  let actions = [];
  if (item.auctionType == 3 && item.itemStatus == 2) {
    actions = [
      <div
        onClick={() => {
          contract.methods
            .closeBid(item.itemId)
            .send({ from: userAccount, gas: 3000000 })
            .then((item) => {
              fetchListings();
              message.success("Item delivered successfully", 2.5);
              fetchBalance();
            })
            .catch((err) => {
              message.error(err.message, 3);
              fetchBalance();
            });
        }}
      >
        Deliver Item
      </div>,
    ];
  } else if (item.auctionType != 3 && item.auctionStatus == 1) {
    actions = [
      <div
        onClick={() =>
          setModal({
            visible: true,
            ...item,
          })
        }
      >
        Reveal Bid and Deliver Item
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

const RevealBids = ({ items, fetchListings, fetchBalance }) => {
  const [activeItems, setActiveItems] = useState([]);
  const [modal, setModal] = useState({
    visible: false,
  });
  const { userAccount, contract } = useContext(BlockchainContext);

  useEffect(() => {
    setActiveItems(
      items.filter(
        (item) =>
          (item.auctionType == 3 && item.itemStatus == 2) ||
          (item.auctionType != 3 && item.auctionStatus == 1)
      )
    );
  }, [items]);

  const deliverItem = () =>
    contract.methods
      .getKey(modal.itemId)
      .call()
      .then((buyerKey) => {
        EthCrypto.encryptWithPublicKey(buyerKey, modal.secretKey)
          .then((encryptedPassword) =>
            contract.methods
              .giveAccess(modal.itemId)
              .send({ from: userAccount, gas: 3000000 })
              .then((item) => {
                fetchListings();
                message.success("Item Delivered Successfully", 2.5);
                fetchBalance();
              })
              .catch((err) => {
                message.error(err.message, 3);
                fetchBalance();
              })
          )
          .catch((err) => {
            message.error(err.message, 3);
            fetchBalance();
          });
      })
      .catch((err) => {
        message.error(err.message, 3);
        fetchBalance();
      });

  return (
    <>
      {activeItems.length == 0 ? (
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
                setModal={setModal}
              />
            );
          })}
        </Row>
      )}

      <Modal
        title={modal.itemName}
        centered
        visible={modal.visible}
        onOk={() => {
          if (modal.auctionType == 3) {
            message.loading("Delivering Item ..", 1);
            deliverItem();
          } else {
            message.loading("Revealing Bid and Delivering Item ..", 1);
            contract.methods
              .revealBid(modal.itemId)
              .send({ from: userAccount, gas: 3000000 })
              .then(() => deliverItem())
              .catch((err) => {
                message.error(err.message, 3);
                fetchBalance();
              });
          }

          setModal({
            visible: false,
          });
        }}
        onCancel={() => {
          setModal({
            visible: false,
          });
        }}
        okText={
          modal.auctionType == 3 && modal.itemStatus == 2
            ? "Deliver Item"
            : "Reveal Bid & Deliver Item"
        }
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <img
            style={{
              width: "100%",
              maxHeight: "130px",
              objectFit: "cover",
              marginBottom: "20px",
            }}
            src={sampleImages[(modal.itemId - 1) % 9]}
          />
          <Input
            placeholder="Enter Secret Key"
            value={modal.secretKey}
            onChange={(event) =>
              setModal({ ...modal, secretKey: event.target.value })
            }
          />
        </Space>
      </Modal>
    </>
  );
};

export default RevealBids;
