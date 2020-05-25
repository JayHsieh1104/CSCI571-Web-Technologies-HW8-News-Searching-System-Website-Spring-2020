import React from 'react';
import Card from 'react-bootstrap/Card';
import ShareIcon from './ShareIcon';
import ShareBox from './ShareBox';
import { withRouter } from 'react-router-dom';
import Col from 'react-bootstrap/Col'
import './SearchResultCard.css';


class SearchResultCard extends React.Component {
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
    let newsImg, newsTitle, newsDate, newsSection, shareUrl, redirectId;
    if(this.props.src === 'guardian') {
      try {
        newsImg = this.props.article.blocks.main.elements[0].assets[this.props.article.blocks.main.elements[0].assets.length - 1].file;
      }
      catch(e) {
        newsImg = 'https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png';
      }

      newsTitle = this.props.article.webTitle;
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
            newsImg = 'https://www.nytimes.com/' + this.props.article.multimedia[i].url;
            break;
          }
        }
      }
      catch(e) {
      }

      newsTitle = this.props.article.headline.main;
      newsDate = this.props.article.pub_date.substr(0, 10);
      try {
        newsSection = this.props.article.news_desk;  
      }
      catch(e) {
        newsSection = '';  
      }
      shareUrl = this.props.article.web_url;
      redirectId = this.props.article.web_url;
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

    let charNum = 70;
    if(newsTitle.length > charNum) {
      newsTitle = newsTitle.substr(0, newsTitle.substr(0, charNum).lastIndexOf(" ")) + '...';
    }

    return (
      <Col xs={12} lg={3} style={{marginBottom: '1%'}}>
        <Card className='SearchResultCardStyle' onClick={() => this.redirectToArticle(redirectId)}>
          <Card.Body>
              <Card.Text className='SearchResultCardTitleStyle'>{newsTitle}
              <span onClick={this.showModal}> {<ShareIcon />} </span>
              </Card.Text>
              <Card.Img className='SearchResultCardImgStyle' src={newsImg} />
              <div>
                <span className='SearchResultCardDatepStyle'>{newsDate}</span>
                <span className='SearchResultCardSectStyle' id={sectionStyle}>{newsSection}</span>
              </div>
              <ShareBox show={this.state.modalShow} onHide={this.unShowModal} title={newsTitle} url={shareUrl} />
          </Card.Body>
        </Card>
      </Col>
    )
  }
}

export default withRouter(SearchResultCard);