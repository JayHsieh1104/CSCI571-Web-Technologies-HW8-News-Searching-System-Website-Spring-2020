import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CommentBox from './CommentBox';
import ArticleBookMark from './ArticleBookMark';
import ArticleShareBox from './ArticleShareBox';
import Spinner from './Spinner';
import ReactTooltip from 'react-tooltip';
import { toast } from 'react-toastify';
import { animateScroll as scroll } from 'react-scroll'
import './ArticlePage.css';

class ArticlePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _error: null,
      _article: null,
      _isMounted: false,
      _isExpanded: false,
      _isPushed: false,
      _isFromGuardian: true
    };

    this.handleExpandClick = this.handleExpandClick.bind(this);
    this.handleFavoriteClick = this.handleFavoriteClick.bind(this);
  }

  handleExpandClick() {
    if(this.state._isExpanded) {
      scroll.scrollToTop();
    }
    else {
      scroll.scrollToBottom();
    }
    this.setState({
      _isExpanded: !this.state._isExpanded
    });
  }

  handleFavoriteClick(articleInfo) {
    let storage = window.localStorage;
    if(this.state._isPushed) {
      toast("Removing " + articleInfo.title,{
        className: 'toast-style'
      });
      let getFavoritesData = storage.getItem("favorites");
      if(getFavoritesData != null) {
        let getFavoritesArray = JSON.parse(getFavoritesData);
        for(let i = 0; i < getFavoritesArray.length; i++) {
          if(getFavoritesArray[i].title === articleInfo.title) {
            getFavoritesArray.splice(i, 1);
            break;
          }
        }
        // store the new favoritesArray to the local storage
        let tempJSON = JSON.stringify(getFavoritesArray);
        storage.setItem("favorites", tempJSON);
      }
    }
    else {
      toast("Saving " + articleInfo.title,{
        className: 'toast-style'
      });
      if(storage.getItem("favorites") == null) {
        let tempArray = [articleInfo];
        let tempJSON = JSON.stringify(tempArray);
        storage.setItem("favorites", tempJSON);
      }
      else {
        let getFavoritesData = storage.getItem("favorites");
        let getFavoritesArray = JSON.parse(getFavoritesData);
        getFavoritesArray.push(articleInfo);
        let tempJSON = JSON.stringify(getFavoritesArray);
        storage.setItem("favorites", tempJSON);
      }
    }   
    this.setState({
      _isPushed: !this.state._isPushed
    });
  }

  fetchNewsData(isFromGuardian, articleID) {
    let storage = window.localStorage;
    let getFavoritesData = storage.getItem("favorites");
    let getFavoritesArray = JSON.parse(getFavoritesData);

    if(isFromGuardian) {
      fetch("https://jayhsieh-csci571-hw8-backend.azurewebsites.net/api/guaridan/article/" + articleID)
      .then(res => res.json())
      .then(
        (jsonObj) => {
          try {
            let _articleTitle = jsonObj.response.content.webTitle;
            for(let i = 0; i < getFavoritesArray.length; i++) {
              if(getFavoritesArray[i].title === _articleTitle) {
                this.setState({ _isPushed: true});
                break;
              }
            }
          }
          catch(e){}
          this._isMounted && this.setState({
            _article: jsonObj.response.content
          });
        },
        (_error) => {
          this._isMounted && this.setState({
            _error
          });
        }
      )
    }
    else {
      fetch("https://jayhsieh-csci571-hw8-backend.azurewebsites.net/api/nytimes/article/" + articleID)
      .then(res => res.json())
      .then(
        (jsonObj) => {
          try {
            let _articleTitle = jsonObj.response.docs[0].headline.main;
            for(let i = 0; i < getFavoritesArray.length; i++) {
              if(getFavoritesArray[i].title === _articleTitle) {
                this.setState({ _isPushed: true});
                break;
              }
            }
          }
          catch(e){}
          this._isMounted && this.setState({
            _article: jsonObj.response.docs[0]
          });
        },
        (_error) => {
          this._isMounted && this.setState({
            _error
          });
        }
      )
    }
  }

  componentDidMount() {
    const paramsString = this.props.location.search;
    const searchParams = new URLSearchParams(paramsString);
    const articleID = (searchParams.get('id')).replace(new RegExp('/', 'g'), '_');
    const isFromGuardian = articleID.indexOf('nytimes') >= 0 ? false : true;
    this.setState({_isFromGuardian: isFromGuardian});
    this._isMounted = true;
    this._isMounted && this.fetchNewsData(isFromGuardian, articleID);
    this.props.UnshowSwitch();
    this.props.TurnOffBookMarkIcon();
    this.props.clearSearchKeyword();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  forceUpdateHandler(){
    this.forceUpdate();
  };

  render() {
    const cardStyle = {
      root: {
        width: '100%',
        padding: '1rem',
        boxShadow: '-1px 1px 4px grey',
      },
      subTitle: {
        display: 'block'
      },
      image: {
        width: '100%'
      },
      expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        cursor: 'pointer'
      },
      expandOpen: {
        transform: 'rotate(180deg)',
        marginLeft: 'auto',
        cursor: 'pointer'
      },   
    }

    const SpinnerStyle = {
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      fontWeight: 'bold'
    }

    if (this.state._error) {
      return <div>_error: {this.state._error.message}</div>;
    } 
    else if (this.state._article === null) {
      return <div style={SpinnerStyle}><Spinner />Loading</div>;
    } 
    else {
      const _articleTitle = (this.state._isFromGuardian)? this.state._article.webTitle: this.state._article.headline.main;
      const _articleDate = (this.state._isFromGuardian)? this.state._article.webPublicationDate.substr(0, 10): this.state._article.pub_date.substr(0, 10);
      const _articleDesc = (this.state._isFromGuardian)? this.state._article.blocks.body[0].bodyTextSummary: this.state._article.abstract;
      const _articleSection = (this.state._isFromGuardian)? this.state._article.sectionId: this.state._article.news_desk;
      const _articleUrl = (this.state._isFromGuardian)? this.state._article.webUrl: this.state._article.web_url;

      let _articleImage;
      if(this.state._isFromGuardian) {
        try {
          _articleImage = this.state._article.blocks.main.elements[0].assets[this.state._article.blocks.main.elements[0].assets.length - 1].file;
        }
        catch(e) {
          _articleImage = 'https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png'; // default image source
        }
      }
      else {
        _articleImage = 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg'; // default image source
        try {
          for(let i = 0; i < this.state._article.multimedia.length; i++) {
            if(this.state._article.multimedia[i].width >= 2000) {
              _articleImage = 'https://nyt.com/' + this.state._article.multimedia[i].url;
              break;
            }
          }
        }
        catch(e) {
        }
      }

      let charNum = 780;
      let _untrimedArticleDesc1 = _articleDesc;
      let _trimedArticleDesc1 = _untrimedArticleDesc1.substr(0, charNum);
      let _articleDesc2;
      if(_articleDesc.length > charNum) {
        let splitPoint = _trimedArticleDesc1.lastIndexOf(". ");
        _untrimedArticleDesc1 = _articleDesc.substr(0, splitPoint+1);
        _trimedArticleDesc1 = _untrimedArticleDesc1 + '..';
        _articleDesc2 = _articleDesc.substr(splitPoint+1);
      }

      const articleInfo = {
        title: _articleTitle,
        imageUrl: _articleImage,
        date: _articleDate,
        section: _articleSection,
        shareUrl: _articleUrl,
        isFromGuardian: this.state._isFromGuardian,
        redirectId: (this.state._isFromGuardian)? this.state._article.id : this.state._article.web_url
      };

      return (
        <div>
          <Card style={cardStyle.root}>
            <Typography variant="h4" component="p">
              {_articleTitle}
            </Typography>
            <Typography variant="subtitle1" component={'div'} style={cardStyle.subTitle}>
              {_articleDate}
              <div data-tip="BookMark" onClick={() => this.handleFavoriteClick(articleInfo)} style={{float: 'right'}}>
                <ArticleBookMark isPushed={this.state._isPushed} />
                <ReactTooltip place="top" type="dark" effect="solid"/>
              </div>
              <ArticleShareBox articleUrl={_articleUrl} />
            </Typography>
            <div style={cardStyle.image}>
              <img alt="Failed to load" width='100%' src={_articleImage} />
            </div>
            <Typography variant="body1" component="div">
              <div className={(this.state._isExpanded)?'desc': 'truncatedDesc'}>
                {(this.state._isExpanded)? _untrimedArticleDesc1: _trimedArticleDesc1}
              </div>
            </Typography>
            <Collapse in={this.state._isExpanded} timeout="auto" unmountOnExit>
              <Typography>
                <br />
                {_articleDesc2}
              </Typography>
            </Collapse>
            <CardActions disableSpacing>
              <IconButton
                style={(this.state._isExpanded)? cardStyle.expandOpen: cardStyle.expand}
                onClick={this.handleExpandClick}
              >
                <ExpandMoreIcon/>
              </IconButton>
            </CardActions>
          </Card>
          <CommentBox articleID={_articleUrl} />
        </div>
      );
    }
  }
}

export default ArticlePage;