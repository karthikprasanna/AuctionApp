import React, { useState, useEffect, useContext } from "react";
import { Row, Col, Modal, message, Input, Space } from "antd";
import EthCrypto from "eth-crypto";

import { BlockchainContext } from "../../App";
import { sampleImages } from "../../components/SampleImages";
import ItemDetailsCard from "../../components/ItemDetailsCard";

const ItemCard = ({ item, setModal }) => {
  let actions = [];
  if (item.auctionType == 3 && item.itemStatus == 2) {
    actions = [
      <div
        onClick={() =>
          setModal({
            visible: true,
            ...item,
          })
        }
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
      <ItemDetailsCard item={item} actions={actions} />
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
          .then((encryptedPassword) => JSON.stringify(encryptedPassword))
          .then((encryptedPassword) => {
            contract.methods
              .giveAccess(modal.itemId, encryptedPassword)
              .send({ from: userAccount, gas: 3000000 })
              .then((item) => {
                fetchListings();
                message.success("Item Delivered Successfully", 1);
                fetchBalance();
              })
              .catch((err) => {
                message.error(err.message, 3);
                fetchBalance();
              });
          })
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
            message.loading("Delivering Item ..", 0.6);
            deliverItem();
          } else {
            message.loading("Revealing Bid and Delivering Item ..", 0.6);
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
