import React, { useState } from "react"
import "./App.css"
import NextImageTimer from "./NextImageTimer"
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Image from 'react-bootstrap/Image'
import Toggle from 'react-toggle'
import "react-toggle/style.css"

const Constants = {
  imageSwitchDurationHumanSec: 3,
  imageSwitchDurationAISec: 4,
}


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
  const [isMistake, setIsMistake] = useState(false);
  const [isFastMode, setIsFastMode] = useState(false);


  function getImageSwitchDuration() {
    if (isFinished()) {
      return 0
    }
    var tempTimeout = images[currImgIdx]["is_human"] ? Constants.imageSwitchDurationHumanSec : Constants.imageSwitchDurationAISec
    if (isFastMode) {
      return Math.floor(tempTimeout / 2)
    }
    return tempTimeout
  }
    

  function changeImage() {
    setIsTimerActive(true)
    return new Promise(res => setTimeout(function () {
      setCurrImgIdx(previousValue => ++previousValue)
      setIsMistake(false)
      setIsTimerActive(false)
    }, getImageSwitchDuration() * 1000)
    );
  }

  async function handleClick(btnName) {
    if ((images[currImgIdx]["is_human"] && btnName === "human") || (!images[currImgIdx]["is_human"] && btnName === "robot")) {
      // correct
      setScore(previousValue => ++previousValue)
    } else {
      setIsMistake(true)
      setScore(0)
    }

    await changeImage()
  }

  function renderPostClick() {
    return (
      <Row className={`${isTimerActive ? "visible" : "invisible"} pt-2"`}>
        <span className="text-muted small">By {images[currImgIdx]["by"]}</span>
        {!images[currImgIdx]["is_human"] && <span className="text-muted small">Prompt: {images[currImgIdx]["prompt"]}</span>}

        {isTimerActive && <NextImageTimer seconds={getImageSwitchDuration()} />}
        {!isTimerActive && <h4>easter egg is back</h4>}
      </Row>
    )
  }

  function isFinished() {
    return currImgIdx >= images.length
  }

  function toggleFastMode() {
    setIsFastMode(previousValue => !previousValue)
  }

  return (
    <Container className="text-center py-5" fluid="md">
      <Row>
        <Col className="text-center"><h1>This Image Does Not Exist</h1></Col>
      </Row>

      {!isFinished() &&
        <Row className="py-2">
          <Col className="text-center">
            <span className={`${isMistake ? "text-danger fw-bolder fs-4" : ""} ${isTimerActive && !isMistake ? "text-success" : ""}`}>Score: {score}</span>
          </Col>
        </Row>
      }

      <Row className="justify-content-center pb-2" xs={12} md={6} lg={6} sm={4}>
        <Col lg={12}>
          <span>Fast mode</span>
          <Toggle id='cheese-status' defaultChecked={isFastMode} onChange={toggleFastMode} />
        </Col>
      </Row>

      {isFinished() && <Row className="justify-content-center">
        Done! You score <h1 className="text-success">{score}</h1>
      </Row>
      }

      {currImgIdx < images.length && <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={6} lg={6} sm={4}>
            <Image src={images[currImgIdx]["img"]} className="img-fluid rounded mx-auto d-block shadow" style={{ height: '18rem' }} alt="Generated art" />
          </Col>
        </Row>

        <Row>
          <Col md={{ span: 6, offset: 3 }}>
            <Row className="justify-content-center">
              <Col><Button className="btn-xlarge" disabled={isTimerActive} variant="outlined" onClick={() => handleClick('robot')}><span role="img" aria-label="robot">🤖</span></Button></Col>
              <Col><Button className="btn-xlarge" disabled={isTimerActive} variant="outlined" onClick={() => handleClick('human')}><span role="img" aria-label="human">👩‍🎨</span></Button></Col>
            </Row>
          </Col>
        </Row>

        {renderPostClick()}
      </Container>
      }
    </Container>
  );
}

export default App;
