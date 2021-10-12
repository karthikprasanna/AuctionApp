import React, { useState, useEffect, useContext } from "react";
import { Row, Col, Modal, message, Spin, Input, Tooltip, Space } from "antd";
import EthCrypto from "eth-crypto";
import { CopyOutlined } from "@ant-design/icons";

import { BlockchainContext } from "../App";
import { sampleImages } from "../components/SampleImages";
import ItemDetailsCard from "../components/ItemDetailsCard";

const ItemCard = ({ item, setModal }) => {
  let actions = [];
  if (item.itemStatus == 2) {
    actions = [<div>Processing Delivery</div>];
  } else {
    actions = [
      <div
        onClick={() => {
          setModal({ visible: true, ...item });
        }}
      >
        Access Item
      </div>,
    ];
  }
  return (
    <Col>
      <ItemDetailsCard item={item} actions={actions} />
    </Col>
  );
};

const Orders = ({ fetchBalance }) => {
  const [items, setItems] = useState([]);

  const { userAccount, contract } = useContext(BlockchainContext);
  const [loading, setLoading] = useState(true);

  const fetchListings = () => {
    contract.methods
      .viewActiveListings(true)
      .call()
      .then((data) => JSON.parse(data))
      .then((data) => {
        // console.log(data);
        setItems(data.filter((item) => item.bidWinner == userAccount));
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => fetchListings(), []);

  const [modal, setModal] = useState({ visible: false });
  const [input, setInput] = useState({
    confirmKey: "",
  });

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
              return <ItemCard item={item} key={key} setModal={setModal} />;
            })}
          </Row>
        ))}

      <Modal
        title={modal.itemName}
        centered
        visible={modal.visible}
        onOk={() => {
          contract.methods
            .accessItem(modal.itemId)
            .call()
            .then((item) => JSON.parse(item))
            .then((item) => {
              EthCrypto.decryptWithPrivateKey(input.confirmKey, item)
                .then((decryptedString) => {
                  Modal.info({
                    title: "Here is your password",
                    centered: true,
                    content: (
                      <Input
                        placeholder="Ordered Password"
                        value={decryptedString}
                        suffix={
                          <Tooltip title="Click to copy">
                            <CopyOutlined
                              onClick={() =>
                                navigator.clipboard.writeText(decryptedString)
                              }
                            />
                          </Tooltip>
                        }
                      />
                    ),
                  });
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
          setModal({ visible: false });
          setInput({
            confirmKey: "",
          });
        }}
        onCancel={() => {
          setModal({ visible: false });
          setInput({
            confirmKey: "",
          });
        }}
        okText={"Receive Delivery"}
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
            placeholder="Enter delivery key"
            value={input.confirmKey}
            onChange={(event) => setInput({ confirmKey: event.target.value })}
          />
        </Space>
      </Modal>
    </>
  );
};

export default Orders;
