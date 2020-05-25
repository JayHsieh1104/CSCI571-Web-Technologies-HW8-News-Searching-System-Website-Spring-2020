import React from 'react';
import Card from 'react-bootstrap/Card';
import ShareIcon from './ShareIcon';
import ShareBox from './ShareBox';
import { withRouter } from 'react-router-dom';
import { MdDelete } from "react-icons/md";
import { toast } from 'react-toastify';
import Col from 'react-bootstrap/Col'
import './FavoriteCard.css';


class FavoriteCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalShow: false
    };
    this.showModal = this.showModal.bind(this);
    this.unShowModal = this.unShowModal.bind(this);
    this.removeArticle = this.removeArticle.bind(this);
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

  removeArticle(e) {
    e.stopPropagation();
    toast("Removing " + this.props.article.title,{
      className: 'toast-style'
    });
    let storage = window.localStorage;
    let getFavoritesData = storage.getItem("favorites");
    let getFavoritesArray = JSON.parse(getFavoritesData);
    // remove the current article
    for(let i = 0; i < getFavoritesArray.length; i++) {
      if(getFavoritesArray[i].title === this.props.article.title) {
        getFavoritesArray.splice(i, 1);
        break;
      }
    }
    // store the new favoritesArray to the local storage
    let tempJSON = JSON.stringify(getFavoritesArray);
    storage.setItem("favorites", tempJSON);
    // re-read and re-render favorites page
    this.props.reReadFavoriteData();
  }

  redirectToArticle(newsId) {
    if(!this.state.modalShow) {
      const { history } = this.props;
      let url = 'article?id=' + newsId;
      if(history) history.push(url);
    }
  }

  render() {
    let sectionStyle = 'defaultSectionStyle';
    if(this.props.article.section === 'world') {
      sectionStyle = 'world'
    }
    else if(this.props.article.section === 'politics') {
      sectionStyle = 'politics'
    }
    else if(this.props.article.section === 'business') {
      sectionStyle = 'business'
    }
    else if(this.props.article.section === 'technology') {
      sectionStyle = 'technology'
    }
    else if(this.props.article.section === 'sports' || this.props.article.section === 'sport') {
      sectionStyle = 'sports'
    }

    let charNum = 70;
    let newsTitle = this.props.article.title.substr(0, charNum);
    if(this.props.article.title.length > charNum) {
      newsTitle = newsTitle.substr(0, newsTitle.lastIndexOf(" ")) + '...';
    }

    const sourceName = (this.props.article.isFromGuardian)? 'GUARDIAN' : 'NYTIMES';
    const sourceStyle = (this.props.article.isFromGuardian)? 'Guardian' : 'NYtimes';
 
    return (
      <Col xs={12} lg={3} style={{marginBottom: '1%'}}>
        <Card className='FavoriteCardStyle' onClick={() => this.redirectToArticle(this.props.article.redirectId)}>
          <Card.Body>
              <Card.Text className='FavoriteCardTitleStyle'>{newsTitle}
                <span onClick={this.showModal}> {<ShareIcon />} </span>
                <span onClick={this.removeArticle}> <MdDelete /> </span>
              </Card.Text>
              <Card.Img className='FavoriteCardImgStyle' src={this.props.article.imageUrl} />
              <div>
                <span className='FavoriteCardDatepStyle'>{this.props.article.date}</span>            
                <span className='FavoriteCardSrcStyle' id={sourceStyle}>{sourceName}</span>
                <span className='FavoriteCardSectStyle' id={sectionStyle}>{this.props.article.section}</span>
              </div>
              <ShareBox show={this.state.modalShow} onHide={this.unShowModal} source={sourceName} title={this.props.article.title} url={this.props.article.shareUrl} />
          </Card.Body>
        </Card>
      </Col>
    )
  }
}

export default withRouter(FavoriteCard);