import React from 'react';
import Card from 'react-bootstrap/Card';
import ShareIcon from './ShareIcon';
import ShareBox from './ShareBox';
import { withRouter } from 'react-router-dom';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import './NewsCard.css';


class NewsCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalShow: false
    };
    this.showModal = this.showModal.bind(this);
    this.unShowModal = this.unShowModal.bind(this);
  }

  showModal(e) {
    e.stopPropagation();
    if(this.state.modalShow) {
      return
    }
    else {
      this.setState({
        modalShow: true
      });
    }
  }

  unShowModal() {
    if(!this.state.modalShow) {
      return
    }
    else {
      this.setState({
        modalShow: false
      });
    }
  }

  redirectToArticle(newsId) {
    if(!this.state.modalShow) {
      const { history } = this.props;
      let url = 'article?id=' + newsId;
      if(history) history.push(url);
    }
  }

  render() {
    let newsImg, newsTitle, newsDesc, newsDate, newsSection, shareUrl, redirectId;
    if(this.props.src === 'guardian') {
      try {
        newsImg = this.props.article.blocks.main.elements[0].assets[this.props.article.blocks.main.elements[0].assets.length - 1].file;
      }
      catch(e) {
        newsImg = 'https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png';
      }

      newsTitle = this.props.article.webTitle;
      newsDesc = this.props.article.blocks.body[0].bodyTextSummary;
      newsDate = this.props.article.webPublicationDate.substr(0, 10);
      newsSection = this.props.article.sectionId;
      shareUrl = this.props.article.webUrl;
      redirectId = this.props.article.id;
    }
    else {
      newsImg = 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg'; // default image source
      try {
        for(let i = 0; i < this.props.article.multimedia.length; i++) {
          if(this.props.article.multimedia[i].width >= 2000) {
            newsImg = this.props.article.multimedia[i].url;
            break;
          }
        }
      }
      catch(e) {
      }

      newsTitle = this.props.article.title;
      newsDesc = this.props.article.abstract;
      newsDate = this.props.article.published_date.substr(0, 10);
      newsSection = this.props.article.section;  
      shareUrl = this.props.article.url;
      redirectId = this.props.article.url;
    }

    let sectionStyle = 'defaultSectionStyle';
    if(newsSection === 'world') {
      sectionStyle = 'world'
    }
    else if(newsSection === 'politics') {
      sectionStyle = 'politics'
    }
    else if(newsSection === 'business') {
      sectionStyle = 'business'
    }
    else if(newsSection === 'technology') {
      sectionStyle = 'technology'
    }
    else if(newsSection === 'sports' || newsSection === 'sport') {
      sectionStyle = 'sports'
    }

 
    return (
      <Row as={Card} className='NewsCardStyle' onClick={() => this.redirectToArticle(redirectId)} >
        <Col lg={3} as={Card.Img} className='NewsCardImgStyle' src={newsImg} />
        <Col lg={9} as={Card.Body} style={{padding: '1.5%'}}>
            <Card.Text className='NewsCardTitleStyle'>{newsTitle}
            <span onClick={this.showModal} > {<ShareIcon />} </span>
            </Card.Text>
            <Card.Text className='NewsCardDescrpStyle'>{newsDesc}</Card.Text>
            <div>
              <span className='NewsCardDatepStyle'>{newsDate}</span>
              <span className='NewsCardSectStyle' id={sectionStyle}>{newsSection}</span>
            </div>
            <ShareBox show={this.state.modalShow} onHide={this.unShowModal} source={null} title={newsTitle} url={shareUrl} />
        </Col>
      </Row>
    )
  }
}

export default withRouter(NewsCard);