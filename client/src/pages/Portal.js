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

import { BlockchainContext } from "../App";
import Chip from "../components/Chip";
import { sampleImages } from "../components/SampleImages";
import placeholderImg from "../assets/placeholderImage.jpg";

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

const Portal = (props) => {
  const [items, setItems] = useState([]);

  const { userAccount, contract } = useContext(BlockchainContext);

  const fetchListings = () => {
    contract.methods
      .viewSellerListings(userAccount)
      .call()
      .then((data) => JSON.parse(data))
      .then((data) => setItems(data));
  };

  useEffect(() => fetchListings(), []);

  const [modal, setModal] = useState({
    visible: false,
    itemName: "",
    itemDescription: "",
    askingPrice: 0,
    bidType: 3,
  });

  return (
    <>
      <Row style={{ width: "100%" }} gutter={[26, 26]}>
        <Col flex="1">
          <Chip
            text={"Add Item"}
            onClick={() => setModal({ ...modal, visible: true })}
          />
        </Col>
        <Col flex="1">
          <Chip text={"View Active Bids"} />
        </Col>
        <Col flex="1">
          <Chip text={"Reveal Bids / Deliver Items"} />
        </Col>
      </Row>

      {items.length == 0 ? (
        <div style={{ margin: "2rem 0" }}>You haven't added any item yet</div>
      ) : (
        <Row
          style={{ width: "100%", marginTop: "3rem" }}
          align="center"
          gutter={[26, 26]}
        >
          {items.map((item, key) => {
            return (
              <ItemCard
                item={item}
                key={key}
                isPortal={true}
                setModal={() => {}}
              />
            );
          })}
        </Row>
      )}

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
              message.success("Item Added Successfully, ", 2.5);
            })
            .catch((err) => message.error(err, 2.5));

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
