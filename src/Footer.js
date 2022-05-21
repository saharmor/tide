import React from "react";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

const Footer = () => {
    return (
        <Container>
            <Row className="mt-5 justify-content-center text-center">
                <hr className="hr"></hr>
            </Row>
            <Row>
                <span className="small text-secondary">Images generated by <a href="https://openai.com/dall-e-2/?utm_source=thisimagedoesnotexist.com" target="_blank" rel="noopener noreferrer">DALL-E 2</a> and VQGAN generative models</span>
            </Row>
            <Row>
                <span className="small text-secondary">Created by <a href="https://saharmor.me/?utm_source=thisimagedoesnotexist.com" target="_blank" rel="noopener noreferrer">Sahar</a> to increase awareness</span>
            </Row>
        </Container>
    );
}

export default Footer;
