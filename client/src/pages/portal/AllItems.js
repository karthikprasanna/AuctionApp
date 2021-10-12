import React from "react";
import { Row, Col } from "antd";

import ItemDetailsCard from "../../components/ItemDetailsCard";

const ItemCard = ({ item }) => {
  let actions = [];
  return (
    <Col>
      <ItemDetailsCard item={item} actions={actions} />
    </Col>
  );
};

const AllItems = ({ items }) => {
  return items.length == 0 ? (
    <div style={{ margin: "2rem 0" }}>You haven't added any item yet</div>
  ) : (
    <Row
      style={{ width: "100%", marginTop: "3rem" }}
      align="center"
      gutter={[26, 26]}
    >
      {items.map((item, key) => {
        return <ItemCard item={item} key={key} />;
      })}
    </Row>
  );
};

export default AllItems;
