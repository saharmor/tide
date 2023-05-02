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
                <span className="small text-secondary">Created by Sahar Mor to increase awareness of generative AI. Follow <a href="https://aitidbits.substack.com/?utm_source=thisimagedoesnotexist.com" target="_blank" rel="noopener noreferrer">AI Tidbits</a> to stay ahead on AI.</span>
            </Row>
        </Container>
    );
}

export default Footer;
