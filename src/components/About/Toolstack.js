import React from "react";
import { Col, Row } from "react-bootstrap";
import {
  SiVisualstudiocode,
  SiInkscape ,
  SiAdobeillustrator ,
  SiFigma
} from "react-icons/si";
import { FaWindows } from "react-icons/fa";


function Toolstack() {
  return (
    <Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
      <Col xs={4} md={2} className="tech-icons">
        <FaWindows />
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiVisualstudiocode />
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiFigma />
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiAdobeillustrator  />
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiInkscape  />
      </Col>
    </Row>
  );
}

export default Toolstack;
