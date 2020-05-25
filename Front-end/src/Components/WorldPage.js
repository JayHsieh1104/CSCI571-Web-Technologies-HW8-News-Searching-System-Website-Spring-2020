import React from 'react';
import NewsCard from './NewsCard';
import Spinner from './Spinner';

class WorldPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _error: null,
      _articles: null,
      _isMounted: false
    };
  }

  fetchNewsData(isFromGuardian) {
    if(isFromGuardian) {
      fetch("https://jayhsieh-csci571-hw8-backend.azurewebsites.net/api/guaridan/world")
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
      fetch("https://jayhsieh-csci571-hw8-backend.azurewebsites.net/api/nytimes/world")
      .then(res => res.json())
      .then(
        (jsonObj) => {
          this._isMounted && this.setState({
            _articles: jsonObj.results,
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

  static getDerivedStateFromProps(props, state) {
    // Store prevId in state so we can compare when props change.
    // Clear out previously-loaded data (so we don't render stale stuff).
    if (props.isFromGuardian !== state.prevIsFromGuardian) {
      return {
        _articles: null,
        prevIsFromGuardian: props.isFromGuardian,
      };
    }
    // No state update necessary
    return null;
  }

  componentDidMount() {
    this._isMounted = true;
    this._isMounted && this.fetchNewsData(this.props.isFromGuardian);
    this.props.showSwitch();
    this.props.TurnOffBookMarkIcon();
    this.props.clearSearchKeyword();
  }

  componentDidUpdate() {
    if (this.state._articles === null) {
      this._isMounted && this.fetchNewsData(this.props.isFromGuardian);
    }
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
          <div style={{width: '100%', display: 'grid', rowGap: '1rem'}}>
            {this.state._articles.map(_article => (<NewsCard key={_article.id} src = 'guardian' article = {_article}/>))}
          </div>
        );
      }
      else {
        return (
          <div style={{width: '100%', display: 'grid', rowGap: '1rem'}}>
            {this.state._articles.map(_article => (<NewsCard key={_article.url} src = 'nytimes' article = {_article}/>))}
          </div>
        );        
      }
    }
  }
}

export default WorldPage;