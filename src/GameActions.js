
import React, { useState } from "react";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

const GameActions = ({ handleClick, isCorrect, isTimerActive }) => {
    const [isRobotSelected, setIsRobotSelected] = useState(false);

    function getRobotButton() {
        if (!isTimerActive || !isRobotSelected) {
            return <span role="img" aria-label="robot">🤖</span>
        }
        
        if (isCorrect) {
            return <span role="img" aria-label="correct">✅</span>
        }
        return <span role="img" aria-label="wrong">❌</span>
    }

    function getHumanButton() {
        if (!isTimerActive || isRobotSelected) {
            return <span role="img" aria-label="human">👩‍🎨</span>
        }

        if (isCorrect) {
            return <span role="img" aria-label="correct">✅</span>
        }
        return <span role="img" aria-label="wrong">❌</span>
    }

    function handleClickInternally(btnType) {
        handleClick(btnType)
        setIsRobotSelected(btnType === 'robot')
    }


    return (
        <Row className="justify-content-center">
            <Col lg={2} md={3} xs={4} sm={3}>
                <Button className="btn-xlarge" disabled={isTimerActive} variant="outlined" onClick={() => handleClickInternally('robot')}>
                    {getRobotButton()}
                </Button>
            </Col>
            <Col lg={2} md={3} xs={4} sm={3}>
                <Button className="btn-xlarge" disabled={isTimerActive} variant="outlined" onClick={() => handleClickInternally('human')}>
                    {getHumanButton()}
                </Button>
            </Col>
        </Row>
    );

}

export default GameActions;
