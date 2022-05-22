import React, { useState } from "react"
import "./App.css"
import imagesJson from "./images.json"
import Footer from "./Footer"
import SocialShare from "./SocialShare"
import GameActions from "./GameActions"

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Image from 'react-bootstrap/Image'


import { v4 as uuidv4 } from 'uuid'

const Constants = {
  imageSwitchDurationHumanSec: 2,
  imageSwitchDurationAISec: 2,
  imagesPerBatch: 30,
  remoteLmbda: 'https://7tknlfte8j.execute-api.us-west-1.amazonaws.com',
}
const humanImages = imagesJson.filter((item) => item.is_human).sort(() => Math.random() - 0.5)
const machineImages = imagesJson.filter((item) => !item.is_human).sort(() => Math.random() - 0.5)
const totalImgCount = humanImages.length + machineImages.length

const sessionId = uuidv4()

const App = () => {
  const [score, setScore] = useState(0);
  const [doneImgsCount, setDoneImgsCount] = useState(0);
  const [currHumanIdx, setCurrHumanIdx] = useState(0);
  const [currMachineIdx, setCurrMachineIdx] = useState(1);

  const [currImg, setCurrImg] = useState(machineImages[0]);
  const [isDalle, setIsDalle] = useState(false);

  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isBatchFinished, setIsBatchFinished] = useState(false);

  function getImageSwitchDuration() {
    if (isBetweenStates()) {
      return 0
    }

    return currImg["is_human"] ? Constants.imageSwitchDurationHumanSec : Constants.imageSwitchDurationAISec
  }

  function isBatchOver() {
    return doneImgsCount !== 0 && ((doneImgsCount + 1) % Constants.imagesPerBatch === 0)
  }

  function moveNextImage() {
    setCurrImg(getNextImage())
  }

  function getNextImage() {
    const randomResult = Math.random() < 0.5
    if (currMachineIdx < machineImages.length && ((currHumanIdx === humanImages.length - 1) || randomResult)) {
      setCurrMachineIdx(previousValue => ++previousValue)
      return machineImages[currMachineIdx]
    } else {
      setCurrHumanIdx(previousValue => ++previousValue)
      return humanImages[currHumanIdx]
    }
  }

  function changeImage() {
    setIsTimerActive(true)
    setIsBatchFinished(false)

    return new Promise(res => setTimeout(function () {
      setIsDalle(false)
      setDoneImgsCount(previousValue => ++previousValue)
      if (!isBatchOver()) {
        moveNextImage()
      } else {
        setIsBatchFinished(true)
      }
      setIsCorrect(false)
      setIsTimerActive(false)
    }, getImageSwitchDuration() * 1000)
    );
  }

  async function saveDB() {
    const params = {
      "imageId": currImg["id"],
      "runningNum": currImg["running_num"],
      "url": currImg["url"],
      "isHuman": currImg["is_human"],
      "isCorrect": isCorrect,
      "sessionId": sessionId,
    }

    await fetch(Constants.remoteLmbda, { // TODO handle errors
      method: 'POST',
      body: JSON.stringify(params),
    })
  }

  async function handleClick(btnName) {
    if (isTimerActive) {
      return
    }

    if ((currImg["is_human"] && btnName === "human") || (!currImg["is_human"] && btnName === "robot")) {
      // correct
      setScore(previousValue => ++previousValue)
      setIsCorrect(true)
    } else {
      setIsCorrect(false)
    }

    if (currImg["on"] === "DALL-E 2") {
      setIsDalle(true)
    }
    await changeImage()
    await saveDB()
  }

  function getImageByText() {
    if (currImg["is_human"]) {
      return currImg["by"] + " on " + currImg["on"]
    }
    return currImg["by"] + " with " + currImg["on"]
  }

  function getImagePath() {
    if (!isDalle) {
      return "images/" + currImg["running_num"] + ".jpeg"
    }
    return "images/original/" + currImg["running_num"] + ".jpeg"
  }

  function renderPostClick() {
    return (
      <Row className={`pt-2" fs-4 prompt-height`}>
        <span className="text-muted small">By <a href={currImg['url']} target="_blank" rel="noopener noreferrer">{getImageByText()}</a></span>
        {!currImg["is_human"] && <span className="text-muted small">Instruction: {currImg["prompt"]}</span>}
      </Row>
    )
  }

  function playAgain() {
    moveNextImage()
    setIsBatchFinished(false)
    setScore(0)
  }

  function isFinishedAll() {
    return doneImgsCount === totalImgCount
  }

  function isBetweenStates() {
    return isBatchFinished || isFinishedAll()
  }

  function getImagesLeftCount() {
    // check if last batch
    if ((totalImgCount - doneImgsCount < Constants.imagesPerBatch) && (totalImgCount % Constants.imagesPerBatch !== 0)) {
      return totalImgCount % Constants.imagesPerBatch
    }

    return Constants.imagesPerBatch
  }


  return (
    <Container className="text-center justify-content-center align-items-center" fluid="md">
      <Row className="pt-4">
        <Col className="text-center"><span className="fs-1">This Image Does Not Exist</span></Col>
      </Row>
      <Row className="pt-1 pb-3 justify-content-center">
        <Col lg={5} md={6} sm={6} xs={10}><span className="fs-6 text-secondary">Can you tell if an image was generated by a human or a machine?</span></Col>
      </Row>

      {isBetweenStates() && <Row className="justify-content-center text-center">
        <Col xs={12}>Done! Your score: <h1 className="text-success">{score}</h1></Col>
        <Col xs={12}>Challenge your friends&nbsp;
          <SocialShare url={"https://thisimagedoesnotexist.com"} title={`Can you tell if an image was generated by a human or a machine? I scored ${score}!`} />
        </Col>
        {!isFinishedAll() && <Col xs={8} className="pt-2">
          <Button className="btn-sm" color="primary" onClick={playAgain}>Play again with new images</Button>
        </Col>}
      </Row>
      }

      {!isBetweenStates() &&
        <Row className="justify-content-center align-items-center pb-2 py-4" xs={12} md={6} lg={6} sm={4}>
          <Col>
            <span className="small">{doneImgsCount % Constants.imagesPerBatch + 1}/{getImagesLeftCount()}</span>
          </Col>
        </Row>
      }

      {!isBetweenStates() && <Container>
        <Row className="justify-content-center">
          <Col>
            <Image src={getImagePath(isDalle)} className="img-fluid mx-auto d-block shadow" style={{ height: '18rem', borderRadius: "0.5rem" }} alt="Generated art" />
          </Col>
        </Row>

        <Row className="pt-2 justify-content-center">
          <Col>
            <span className={`${isCorrect ? "text-success fw-bolder fs-3" : "fs-5"}`}>Score: {score}</span>
          </Col>
        </Row>

        <GameActions handleClick={handleClick} isTimerActive={isTimerActive} isCorrect={isCorrect} />
        {isTimerActive && renderPostClick()}
      </Container>
      }

      <Footer />
    </Container>
  );
}

export default App
