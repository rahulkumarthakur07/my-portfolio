import React from "react";
import Card from "react-bootstrap/Card";
import { ImPointRight } from "react-icons/im";

function AboutCard() {
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p style={{ textAlign: "justify" }}>
            Hi Everyone, I am <span className="purple">Rahul Sharma </span>
            from <span className="purple"> Kathmandu, Nepal.</span>
            <br />
            I am currently working at fiverr & upwork as a react native Developer.
            <br />
            I have completed React Native , Next js , Graphics Design and Web Development Course from Youtube & Udemy.
            <br />
            <br />
            Apart from coding, some other activities that I love to do!
          </p>
          <ul>
            <li className="about-activity">
              <ImPointRight /> Playing Games
            </li>
            <li className="about-activity">
              <ImPointRight /> Learning New Stuffs
            </li>
            <li className="about-activity">
              <ImPointRight /> Travelling
            </li>
          </ul>

          <p style={{ color: "rgb(155 126 172)" }}>
            "Every line of code is a chance to improve the world."{" "}
          </p>
          <footer className="blockquote-footer">Rahul Sharma</footer>
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default AboutCard;
