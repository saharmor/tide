import React, { useState } from "react"
import "./App.css"
import NextImageTimer from "./NextImageTimer"
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

const images = [
  {
    img: 'https://pbs.twimg.com/media/FRm3uewVIAAcHGO?format=jpg&name=medium',
    is_human: false,
    prompt: 'cats singing',
    by: '@bakztfuture with DALL-E 2',
  },
  {
    img: 'https://images.unsplash.com/photo-1648737966670-a6a53917ed19?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80',
    is_human: true,
    by: '@jgrishey on Unsplash',
  },
  {
    img: 'https://pbs.twimg.com/media/FRwqFOpUUAEUMZq?format=jpg&name=medium',
    is_human: false,
    prompt: 'avocado armchair',
    by: '@bakztfuture with DALL-E 2',
  },
  {
    img: 'https://images.unsplash.com/photo-1651454060241-a218f790be13?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2342&q=80',
    is_human: true,
    by: '@mattxfotographs on Unsplash',
  }
].sort(() => Math.random() - 0.5)

const App = () => {
  const [score, setScore] = useState(0);
  const [currImgIdx, setCurrImgIdx] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

  function changeImage() {
    setIsTimerActive(true)
    return new Promise(res => setTimeout(function () {
      setCurrImgIdx(previousValue => ++previousValue)
      setIsTimerActive(false)
    }, 3000)
    );
  }



  async function handleClick(btnName) {
    if ((images[currImgIdx]["is_human"] && btnName === "human") || (!images[currImgIdx]["is_human"] && btnName === "robot")) {
      // correct
      setScore(previousValue => ++previousValue)
    } else {
      setScore(0)
    }

    await changeImage()
  }

  function renderPostClick() {
    if (!isTimerActive) {
      return
    }
    if (!images[currImgIdx]["is_human"]) {
      return (
        <>
          <span className="text-muted small">By {images[currImgIdx]["by"]}</span>
          <span className="text-muted small">Prompt: {images[currImgIdx]["prompt"]}</span>
          <NextImageTimer seconds={3} />
        </>
      )
    } else {
      return <>
        <span className="text-muted small">By {images[currImgIdx]["by"]}</span>
        <NextImageTimer seconds={3} />
      </>
    }
  }

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
            <img src={images[currImgIdx]["img"]} className="img-thumbnail shadow-2-strong" style={{ maxWidth: '24rem', maxHeight: '24em' }} alt="Generated art" />
          </Col>
        </Row>

        <Row className="pt-2">
          {renderPostClick()}
        </Row>
        <Row className="py-2">
          <Col md={{ span: 6, offset: 3 }}>
            <Row className="text-center">
              <Col><Button className="btn-xlarge" variant="outlined" onClick={() => handleClick('robot')}><span role="img" aria-label="robot">🤖</span></Button></Col>
              <Col><Button className="btn-xlarge" variant="outlined" onClick={() => handleClick('human')}><span role="img" aria-label="human">👩‍🎨</span></Button></Col>
            </Row>
          </Col>
        </Row>
      </div>
      }
    </Container>
  );
}

export default App;
