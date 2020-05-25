import React from 'react';
import FavoriteCard from './FavoriteCard';
import Row from 'react-bootstrap/Row'

class FavoritesPage extends React.Component {
  constructor(props) {
    super(props);
    let storage = window.localStorage;
    let getFavoritesData = storage.getItem("favorites");
    let getFavoritesArray = JSON.parse(getFavoritesData);
    this.state = {
      _error: null,
      _articles: getFavoritesArray,
    };
    this.reReadFavoriteData = this.reReadFavoriteData.bind(this);
  }

  reReadFavoriteData() {
    let storage = window.localStorage;
    let getFavoritesData = storage.getItem("favorites");
    let getFavoritesArray = JSON.parse(getFavoritesData);
    this.setState({ _articles: getFavoritesArray })
  }

  componentDidMount() {
    this.props.UnshowSwitch();
    this.props.TurnOnBookMarkIcon();
  }

  render() {

    if (this.state._error) {
      return <div>_error: {this.state._error.message}</div>;
    } 
    else if (this.state._articles == null || this.state._articles.length === 0) {
      return <p style={{textAlign: "center", fontWeight: "bold"}}>There are no saved articles</p>
    } 
    else {
      return (
        <div>
          <h3>Favorites</h3>
          <Row xs={1} lg={4} className='FavoritesStyle'>
            {this.state._articles.map(_article => (<FavoriteCard key={_article.title} article = {_article} reReadFavoriteData={this.reReadFavoriteData}/>))}
          </Row>
        </div>
      );
    }
  }
}

export default FavoritesPage;