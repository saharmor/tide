import React, { useState } from "react"
import "./App.css"
import imagesJson from "./images.json"
import Footer from "./Footer"
import GameActions from "./GameActions"

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'

import { v4 as uuidv4 } from 'uuid'
import { getLoca, trackEvent } from "./utils"
import ReactGA from 'react-ga4'
import DoneScreen from "./DoneScreen"

const Constants = {
  imageSwitchDurationHumanSec: 2,
  imageSwitchDurationAISec: 2,
  imagesPerBatch: 30,
  remoteLmbda: 'https://7tknlfte8j.execute-api.us-west-1.amazonaws.com',
  remoteLmbdaEm: 'https://7tknlfte8j.execute-api.us-west-1.amazonaws.com/capture-email',
}
const humanImages = imagesJson.filter((item) => item.is_human).sort(() => Math.random() - 0.5)
const machineImages = imagesJson.filter((item) => !item.is_human).sort(() => Math.random() - 0.5)
const totalImgCount = humanImages.length + machineImages.length

const sessionId = uuidv4()
var loca = getLoca().then(val => {
  loca = val
})

ReactGA.initialize('G-38F95VBLHV', {
  titleCase: false,
  gaOptions: {
    userId: sessionId
  }
});
ReactGA.send("pageview");

const App = () => {
  const [score, setScore] = useState(0);
  const [doneImgsCount, setDoneImgsCount] = useState(0);
  const [currHumanIdx, setCurrHumanIdx] = useState(0);
  const [currMachineIdx, setCurrMachineIdx] = useState(1);

  const [currImg, setCurrImg] = useState(machineImages[0]);
  const [isDalleOrImagen, setIsDalleOrImagen] = useState(false);

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

  function changeImage(isAnswerCorrect) {
    setIsTimerActive(true)
    setIsBatchFinished(false)

    return new Promise(() => setTimeout(function () {
      setIsDalleOrImagen(false)
      setDoneImgsCount(previousValue => ++previousValue)
      if (!isBatchOver()) {
        moveNextImage()
      } else {
        if (isAnswerCorrect) {
          trackEvent('gameplay', 'finished_batch', sessionId, score + 1)
        }
        trackEvent('gameplay', 'finished_batch', sessionId, score)
        setIsBatchFinished(true)
      }
      setIsCorrect(false)
      setIsTimerActive(false)
    }, getImageSwitchDuration() * 1000)
    );
  }

  async function saveDB(paramsString) {
    await fetch(Constants.remoteLmbda, { // TODO handle errors
      method: 'POST',
      body: paramsString,
    })
  }

  function getSaveParams() {
    const params = {
      "imageId": currImg["id"],
      "runningNum": currImg["running_num"],
      "url": currImg["url"],
      "isHuman": currImg["is_human"],
      "isCorrect": isCorrect,
      "sessionId": sessionId,
      "locaCount": loca[0],
      "locaCit": loca[1],
    }

    return JSON.stringify(params)
  }

  async function handleClick(btnName) {
    if (isTimerActive) {
      return
    }

    const isAnswerCorrect = (currImg["is_human"] && btnName === "human") || (!currImg["is_human"] && btnName === "robot")
    if (isAnswerCorrect) {
      // correct
      setScore(previousValue => ++previousValue)
      setIsCorrect(true)
      trackEvent('gameplay', 'choice_correct', currImg["id"])
    } else {
      setIsCorrect(false)
      trackEvent('gameplay', 'choice_wrong', currImg["id"])
    }

    if (currImg["on"] === "DALL-E 2" || currImg["on"] === "Imagen") {
      setIsDalleOrImagen(true)
    }

    saveDB(getSaveParams())
    await changeImage(isAnswerCorrect)
  }

  function getImageByText() {
    if (currImg["is_human"]) {
      return currImg["by"] + " on " + currImg["on"]
    }
    return currImg["by"] + " with " + currImg["on"]
  }

  function getImagePath() {
    if (!isDalleOrImagen) {
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
    trackEvent('gameplay', 'play_again', sessionId)
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
        <Col lg={5} md={6} sm={6} xs={10}><span className="fs-6 text-secondary">Can you tell if an image was generated by a human or a machine? The average score is 18</span></Col>
      </Row>

      {isBetweenStates() && <DoneScreen isFinishedAll={isFinishedAll()} score={score} playAgain={playAgain}
        emailUrl={Constants.remoteLmbdaEm} sessionId={sessionId} />}

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
            <Image src={getImagePath(isDalleOrImagen)} className="img-fluid mx-auto d-block shadow" style={{ height: '18rem', borderRadius: "0.5rem" }} alt="Generated art" />
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
