import React from 'react';
import {EmailShareButton, FacebookShareButton, TwitterShareButton, 
        EmailIcon, FacebookIcon, TwitterIcon} 
from "react-share";


function ArticleShareBox(props) {
  const iconSize = 20;

  return (
    <div style={{float: 'right', marginRight: '5%'}} >
      <FacebookShareButton data-tip="Facebook" url={props.articleUrl} hashtag={'CSCI_571_NewsApp'}>
        <FacebookIcon size={iconSize} round={true} />
      </FacebookShareButton>
      <TwitterShareButton data-tip="Twitter" url={props.articleUrl} hashtags={['CSCI_571_NewsApp']}>
        <TwitterIcon size={iconSize} round={true} />
      </TwitterShareButton>
      <EmailShareButton data-tip="Email" url={props.articleUrl} subject={'CSCI_571_NewsApp'}>
        <EmailIcon size={iconSize} round={true} />
      </EmailShareButton>
    </div>
  );
}

export default ArticleShareBox;