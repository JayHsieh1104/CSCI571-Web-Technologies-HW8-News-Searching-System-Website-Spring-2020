import React from 'react';
import SearchResultCard from './SearchResultCard';
import Spinner from './Spinner';
import Row from 'react-bootstrap/Row'

class SearchResultPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _error: null,
      _articles: null,
      _isMounted: false
    };
  }

  fetchNewsData(isFromGuardian, keyword) {
    if(isFromGuardian) {
      fetch("https://jayhsieh-csci571-hw8-backend.azurewebsites.net/api/guaridan/search/" + keyword)
      .then(res => res.json())
      .then(
        (jsonObj) => {
          this._isMounted && this.setState({
            _articles: jsonObj.response.results,
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
      fetch("https://jayhsieh-csci571-hw8-backend.azurewebsites.net/api/nytimes/search/" + keyword)
      .then(res => res.json())
      .then(
        (jsonObj) => {
          this._isMounted && this.setState({
            _articles: jsonObj.response.docs,
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
    const keyword = (searchParams.get('q')).replace(new RegExp('/', 'g'), '_');
    this._isMounted = true;
    this._isMounted && this.fetchNewsData(this.props.isFromGuardian, keyword);
    this.props.UnshowSwitch();
    this.props.TurnOffBookMarkIcon();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
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
    else if (this.state._articles === null) {
      return <div style={SpinnerStyle}><Spinner />Loading</div>;
    } 
    else {
      if(this.props.isFromGuardian) {
        return (
          <div >
            <h3>Results</h3>
            <Row xs={1} lg={4} className='SearchResult'>
              {this.state._articles.map(_article => (<SearchResultCard key={_article.id} src = {'guardian'} article = {_article}/>))}
            </Row>
          </div>
        );
      }
      else {
        return (
          <div >
            <h3>Results</h3>
            <Row xs={1} lg={4} className='SearchResult'>
              {this.state._articles.map(_article => (<SearchResultCard key={_article._id} src = {'nytimes'} article = {_article}/>))}
            </Row>
          </div>
        );
      }
    }
  }
}

export default SearchResultPage;