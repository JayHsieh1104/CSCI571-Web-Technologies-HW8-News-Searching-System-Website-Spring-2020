import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import {EmailShareButton, FacebookShareButton, TwitterShareButton, 
        EmailIcon, FacebookIcon, TwitterIcon} 
from "react-share";


function ShareBox(props) {
  if(props.source == null) {
    return (
      <Modal {...props}>
        <Modal.Header closeButton>
          <Modal.Title style={{fontSize: 'medium'}}>
            {props.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{fontSize: 'medium'}}>
          <Container>
            <Row style={{justifyContent: "center"}}>
              Share via
            </Row>
            <Row style={{justifyContent: "space-around"}}>
                <FacebookShareButton url={props.url} hashtag={'#CSCI_571_NewsApp'}>
                  <FacebookIcon size={48} round={true} />
                </FacebookShareButton>
                <TwitterShareButton url={props.url} hashtags={['CSCI_571_NewsApp']}>
                  <TwitterIcon size={48} round={true} />
                </TwitterShareButton>
                <EmailShareButton url={props.url} subject={'CSCI_571_NewsApp'}>
                  <EmailIcon size={48} round={true} />
                </EmailShareButton>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
    );
  }
  else {
    return (
      <Modal {...props}>
        <Modal.Header closeButton>
          <Modal.Title style={{fontSize: 'medium'}}>
            <span style={{fontWeight: "bold"}}>{props.source}</span>
            <br/>
            {props.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{fontSize: 'medium'}}>
          <Container>
            <Row style={{justifyContent: "center"}}>
              Share via
            </Row>
            <Row style={{justifyContent: "space-around"}}>
                <FacebookShareButton url={props.url} hashtag={'#CSCI_571_NewsApp'}>
                  <FacebookIcon size={48} round={true} />
                </FacebookShareButton>
                <TwitterShareButton url={props.url} hashtags={['CSCI_571_NewsApp']}>
                  <TwitterIcon size={48} round={true} />
                </TwitterShareButton>
                <EmailShareButton url={props.url} subject={'CSCI_571_NewsApp'}>
                  <EmailIcon size={48} round={true} />
                </EmailShareButton>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
    );
  }
}

export default ShareBox;