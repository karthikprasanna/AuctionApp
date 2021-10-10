import React, { useState, useEffect, useContext } from "react";
import {
  Row,
  Col,
  Modal,
  message,
  InputNumber,
  Input,
  Space,
  Select,
  Spin,
} from "antd";

import { BlockchainContext } from "../App";
import AllItems from "./portal/AllItems";
import ActiveBids from "./portal/ActiveBids";
import RevealBids from "./portal/RevealBids";
import Chip from "../components/Chip";
import placeholderImg from "../assets/placeholderImage.jpg";

const { TextArea } = Input;
const { Option } = Select;

const Portal = ({ fetchBalance }) => {
  const [items, setItems] = useState([]);

  const { userAccount, contract } = useContext(BlockchainContext);
  const [loading, setLoading] = useState(true);

  const fetchListings = () => {
    contract.methods
      .viewSellerListings(userAccount)
      .call()
      .then((data) => JSON.parse(data))
      .then((data) => {
        setItems(data);
        setLoading(false);
      });
  };

  useEffect(() => fetchListings(), []);

  const [modal, setModal] = useState({
    visible: false,
    itemName: "",
    itemDescription: "",
    askingPrice: 0,
    bidType: 3,
  });

  const [page, setPage] = useState(0);

  return (
    <>
      <Row style={{ width: "100%" }} gutter={[26, 26]}>
        <Col flex="1">
          <Chip
            text={"Add Item"}
            onClick={() => setModal({ ...modal, visible: true })}
          />
        </Col>
        <Col flex="1" onClick={() => setPage(page != 1 ? 1 : 0)}>
          <Chip text={page != 1 ? "View Active Bids" : "View All Items"} />
        </Col>
        <Col flex="1" onClick={() => setPage(page != 2 ? 2 : 0)}>
          <Chip
            text={page != 2 ? "Reveal Bids / Deliver Items" : "View All Items"}
          />
        </Col>
      </Row>

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
      {!loading && page == 0 && <AllItems items={items} />}
      {!loading && page == 1 && <ActiveBids items={items} />}
      {!loading && page == 2 && <RevealBids items={items} />}

      <Modal
        title="Add a new item"
        centered
        visible={modal.visible}
        onOk={() => {
          message.loading("Adding Item ..", 1);
          contract.methods
            .addItem(
              modal.itemName,
              modal.itemDescription,
              modal.askingPrice,
              modal.bidType
            )
            .send({ from: userAccount, gas: 3000000 })
            .then((item) => {
              fetchListings();
              message.success("Item Added Successfully", 2.5);
              fetchBalance();
            })
            .catch((err) => {
              message.error(err.message, 3);
              fetchBalance();
            });

          setModal({
            visible: false,
            itemName: "",
            itemDescription: "",
            askingPrice: 0,
            bidType: 3,
          });
        }}
        onCancel={() => {
          setModal({
            visible: false,
            itemName: "",
            itemDescription: "",
            askingPrice: 0,
            bidType: 3,
          });
        }}
        okText="Add Item"
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <img
            style={{
              width: "100%",
              maxHeight: "130px",
              objectFit: "cover",
              marginBottom: "20px",
            }}
            src={placeholderImg}
          />
          <Input
            placeholder="Item Name"
            value={modal.itemName}
            onChange={(event) =>
              setModal({ ...modal, itemName: event.target.value })
            }
          />
          <TextArea
            placeholder="Item Description"
            rows={3}
            value={modal.itemDescription}
            onChange={(event) =>
              setModal({ ...modal, itemDescription: event.target.value })
            }
          />
          <Select
            style={{ width: "100%" }}
            value={modal.bidType}
            onChange={(value) => setModal({ ...modal, bidType: value })}
            placeholder="Sell Type"
          >
            <Option value={3}>Direct Sell</Option>
            <Option value={0}>First Price Auction</Option>
            <Option value={1}>Second Price Auction</Option>
            <Option value={2}>Average Price Auction</Option>
          </Select>
          {modal.bidType === 3 && (
            <InputNumber
              min={0}
              step={1}
              placeholder="Price (in wei)"
              style={{ width: "100%" }}
              value={modal.askingPrice != 0 && modal.askingPrice}
              onChange={(value) =>
                setModal({ ...modal, askingPrice: parseInt(value) })
              }
            />
          )}
        </Space>
      </Modal>
    </>
  );
};

export default Portal;
