import React from 'react';
import {Navbar, Nav} from 'react-bootstrap';
import {Switch, Route, Link} from 'react-router-dom';
import HomePage from './Components/HomePage';
import WorldPage from './Components/WorldPage';
import PoliticsPage from './Components/PoliticsPage';
import BusinessPage from './Components/BusinessPage';
import TechnologyPage from './Components/TechnologyPage';
import SportsPage from './Components/SportsPage';
import ArticlePage from './Components/ArticlePage';
import SearchResultPage from './Components/SearchResultPage';
import FavoritesPage from './Components/FavoritesPage';
import NavbarBookMark from './Components/NavbarBookMark';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import AsyncSelect from "react-select/async";
import ReactTooltip from 'react-tooltip'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import 'react-toastify/dist/ReactToastify.css';
import './App.css';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFromGuardian: (localStorage.getItem("isFromGuardian") === 'false')? false : true,
      showSwitch: true,
      inputValue: "Enter keyword ..",
      _isInBookMark: false
    };
    this.handleFavoritesOnClick = this.handleFavoritesOnClick.bind(this);
    this.handleSwitchClick = this.handleSwitchClick.bind(this);
    this.showSwitch = this.showSwitch.bind(this);
    this.UnshowSwitch = this.UnshowSwitch.bind(this);
    this.TurnOnBookMarkIcon = this.TurnOnBookMarkIcon.bind(this);
    this.TurnOffBookMarkIcon = this.TurnOffBookMarkIcon.bind(this);
    this.handleUserTyping = this.handleUserTyping.bind(this);
    this.clearSearchKeyword = this.clearSearchKeyword.bind(this);
    this.getSuggest = this.getSuggest.bind(this);
    this.loadOptions = this.loadOptions.bind(this);
    toast.configure({
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
    });
  }

  handleFavoritesOnClick() {
    const { history } = this.props;
    let url = 'favorites';
    if(history) history.push(url);
  };  

  TurnOnBookMarkIcon() {
    this.setState(state => ({
      _isInBookMark: true
    }));
  }

  TurnOffBookMarkIcon() {
    this.setState(state => ({
      _isInBookMark: false
    }));
  }

  handleSwitchClick() {
    localStorage.setItem("isFromGuardian", !this.state.isFromGuardian);
    this.setState(state => ({
      isFromGuardian: !state.isFromGuardian
    }));
  }

  showSwitch() {
    this.setState(state => ({
      showSwitch: true
    }));
  }

  UnshowSwitch() {
    this.setState(state => ({
      showSwitch: false
    }));
  }

  handleUserTyping = (newValue) => {
    const inputValue = newValue.replace(/\W/g, '');
    this.setState({ inputValue });
  };  

  handleSearchOnClick = (selectOption) => {
    this.setState(state => ({
      inputValue: selectOption.value
    }));
    const { history } = this.props;
    let url = 'search?q=' + selectOption.value;
    if(history) history.push(url);
  };  
  
  clearSearchKeyword () {
    if(this.state.inputValue !== "Enter keyword ..") {
      this.setState(state => ({
        inputValue: "Enter keyword .."
      }));
    }
  }

  getSuggest = async (inputValue) => {
    if(inputValue !== this.state.inputValue) {
      return []
    }
    else {
      try {
        const response = await fetch(
            `https://api.cognitive.microsoft.com/bing/v7.0/suggestions?q=${inputValue}`, {
            headers: {
              "Ocp-Apim-Subscription-Key": "Your Key"
            }
          }
        );
        const data = await response.json();
        const resultsRaw = data.suggestionGroups[0].searchSuggestions;
        const results = resultsRaw.map(result => ({value: result.displayText, label: result.displayText}));
        return results;
      } 
      catch (error) {
        console.error(`Error fetching search ${inputValue}`);
      }
    }
  };

  loadOptions = inputValue =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(this.getSuggest(inputValue));
    }, 1000);
  });

  
  render(props) {
    return (
      <Container fluid='true' className='App'>
          <div className='Navigation'>
            <Navbar collapseOnSelect expand="lg" className='Navbar' variant="dark" >
                <div style={{minWidth: '250px'}}>
                  <AsyncSelect
                    cacheOptions
                    loadOptions={this.loadOptions}
                    defaultOptions
                    onInputChange={this.handleUserTyping}
                    onChange={this.handleSearchOnClick}
                    placeholder={this.state.inputValue}
                    value={null}
                  />
                </div>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav" style={{justifyContent: 'space-between'}}>
                <Nav >
                  <Nav.Link as={Link} to="/">Home</Nav.Link>
                  <Nav.Link as={Link} to="/World">World</Nav.Link>
                  <Nav.Link as={Link} to="/Politics">Politics</Nav.Link>
                  <Nav.Link as={Link} to="/Business">Business</Nav.Link>
                  <Nav.Link as={Link} to="/Technology">Technology</Nav.Link>
                  <Nav.Link as={Link} to="/Sports">Sports</Nav.Link>
                </Nav>
                <Row style={{display: 'flex', flexDirection: 'row'}}>
                  <Col xs={12} lg={1} style={{display: 'grid', alignItems: 'center', cursor: 'pointer'}} >
                    <span data-for='NavBookMark' data-tip="BookMark" onClick={this.handleFavoritesOnClick}>
                      <NavbarBookMark isInBookMark = {this.state._isInBookMark} />
                      <ReactTooltip id='NavBookMark' place="bottom" type="dark" effect="solid"/>
                    </span>
                  </Col>
                  <Col xs={12} lg={10}>
                    <Row className='toggleBlock' style={{justifyContent: 'space-around'}, (this.state.showSwitch)?{display:'flex'}:{display: 'none'}}>
                        <Col xs={12} lg={4}><span className='toggleBtn'>NYTimes</span></Col>
                        <Col xs={12} lg={4}><label className="switch">
                          <input type="checkbox" checked={this.state.isFromGuardian} onChange={this.handleSwitchClick}></input>
                          <span className="slider round"></span>
                        </label></Col>
                        <Col xs={12} lg={4}><span className='toggleBtn'>Guardian</span></Col>
                    </Row>
                  </Col>
                </Row>
              </Navbar.Collapse>
            </Navbar>
          </div>
          <div className='Section'>
            <Switch>
              <Route exact path='/' render={ props => { 
                  return <HomePage isFromGuardian={this.state.isFromGuardian} showSwitch={this.showSwitch} TurnOffBookMarkIcon={this.TurnOffBookMarkIcon} clearSearchKeyword={this.clearSearchKeyword} {...props} />
                  } 
                } />
              <Route path='/World' render={ props => { 
                  return <WorldPage isFromGuardian={this.state.isFromGuardian} showSwitch={this.showSwitch} TurnOffBookMarkIcon={this.TurnOffBookMarkIcon} clearSearchKeyword={this.clearSearchKeyword} {...props} />
                  } 
                } />
              <Route path='/Politics' render={ props => { 
                  return <PoliticsPage isFromGuardian={this.state.isFromGuardian} showSwitch={this.showSwitch} TurnOffBookMarkIcon={this.TurnOffBookMarkIcon} clearSearchKeyword={this.clearSearchKeyword} {...props} />
                  } 
                } />
              <Route path='/Business' render={ props => { 
                  return <BusinessPage isFromGuardian={this.state.isFromGuardian} showSwitch={this.showSwitch} TurnOffBookMarkIcon={this.TurnOffBookMarkIcon} clearSearchKeyword={this.clearSearchKeyword} {...props} />
                  } 
                } />
              <Route path='/Technology' render={ props => { 
                  return <TechnologyPage isFromGuardian={this.state.isFromGuardian} showSwitch={this.showSwitch} TurnOffBookMarkIcon={this.TurnOffBookMarkIcon} clearSearchKeyword={this.clearSearchKeyword} {...props} />
                  } 
                } />
              <Route path='/Sports' render={ props => { 
                  return <SportsPage isFromGuardian={this.state.isFromGuardian} showSwitch={this.showSwitch} TurnOffBookMarkIcon={this.TurnOffBookMarkIcon} clearSearchKeyword={this.clearSearchKeyword} {...props} />
                  } 
                } />
              <Route path='/article' render={ props => { 
                  return <ArticlePage isFromGuardian={this.state.isFromGuardian} UnshowSwitch={this.UnshowSwitch} TurnOffBookMarkIcon={this.TurnOffBookMarkIcon} clearSearchKeyword={this.clearSearchKeyword} {...props} />
                  } 
                } />
              <Route path='/search' render={ props => { 
                  return <SearchResultPage isFromGuardian={this.state.isFromGuardian} UnshowSwitch={this.UnshowSwitch} TurnOffBookMarkIcon={this.TurnOffBookMarkIcon} {...props} />
                  } 
                } />
              <Route path='/favorites' render={ props => { 
                  return <FavoritesPage isFromGuardian={this.state.isFromGuardian} UnshowSwitch={this.UnshowSwitch} TurnOnBookMarkIcon={this.TurnOnBookMarkIcon} {...props} />
                  } 
                } />
              <Route render={function () {
                return <p>Not found</p>
              }} />
            </Switch>
          </div>
      </Container>
    )
  }
}

export default withRouter(App);