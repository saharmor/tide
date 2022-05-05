import React, { useState } from "react";
import "./App.css";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

const images = [
  {
    img: 'https://pbs.twimg.com/media/FRm3uewVIAAcHGO?format=jpg&name=medium',
    is_human: false,
    prompt: 'cats singing',
  },
  {
    img: 'https://images.unsplash.com/photo-1648737966670-a6a53917ed19?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80',
    is_human: true
  },
  {
    img: 'https://pbs.twimg.com/media/FRwqFOpUUAEUMZq?format=jpg&name=medium',
    is_human: false,
    prompt: 'avocado armchair',
  },
  {
    img: 'https://images.unsplash.com/photo-1651454060241-a218f790be13?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2342&q=80',
    is_human: true
  }
].sort(() => Math.random() - 0.5)

const App = ({ classes }) => {
  const [score, setScore] = useState(0);
  const [usedImages, setUsedImages] = useState([]);
  const [currImgIdx, setCurrImgIdx] = useState(0);

  function getImagesRandomOrder() {
    return images.sort(() => Math.random() - 0.5)
  }


  function handleClick(btnName) {
    if ((images[currImgIdx]["is_human"] && btnName === "human") || (!images[currImgIdx]["is_human"] && btnName === "robot")) {
      // correct
      setScore(previousValue => ++previousValue)
    } else {
      setScore(0)
    }
    setCurrImgIdx(previousValue => ++previousValue)
  }

    console.log(currImgIdx)
  return (
    <Container className="text-center py-5" fluid="md">
      <Row>
        <Col className="text-center"><h1 >This Image Does Not Exist</h1></Col>
      </Row>

      <Row className="py-2">
        <Col className="text-center">
          Score: <span>{score}</span>
        </Col>
      </Row>
      {currImgIdx >= images.length && <Row className="justify-content-center">
        Done!
      </Row>
      }
      {currImgIdx < images.length && <div>
        <Row>
          <Col className="text-center">
            <img src={images[currImgIdx]["img"]} className="img-thumbnail shadow-2-strong" style={{ maxWidth: '24rem' , maxHeight: '24em'}}
            /></Col>
        </Row>

        <Row className="py-2">
          <Col md={{ span: 6, offset: 3 }}>
            <Row className="text-center">
              <Col><Button className="btn-xlarge" variant="outlined" onClick={() => handleClick('robot')}>🤖</Button></Col>
              <Col><Button className="btn-xlarge" variant="outlined" onClick={() => handleClick('human')}>👩‍🎨</Button></Col>
            </Row>
          </Col>
        </Row>
      </div>
      }
    </Container>
  );
}

export default App;
