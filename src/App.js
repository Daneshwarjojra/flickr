import React from 'react';
import './App.css';
import InfiniteScroll from 'react-infinite-scroller';
class App extends React.Component {
  constructor(){
    super();
    this.state = {
        pictures: [],
        currentPage: 1,
        textInput: '',
        isOpen: false,
        picPath: ''
    };
  }
  componentDidMount(){
    this.reloadImages();
  }

  handleShowModal = (srcPath) => {
    this.setState(state => ({
      isOpen: !state.isOpen,
      picPath: srcPath
    }));
  }

  reloadImages = () => {
    fetch(`https://www.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=921d41497b47fc324e638fa6bd21683d&tags=${this.state.textInput}&per_page=5&page=${this.state.currentPage}&format=json&nojsoncallback=1`).then(function(response){
      return response.json();
    }).then(function(j){
      let picArray = j.photos.photo.map((pic,i) => {
        let srcPath = 'https://farm'+pic.farm+'.staticflickr.com/'+pic.server+'/'+pic.id+'_'+pic.secret+'.jpg';
        return (
          <div className="imgBoundary pointer" onClick={() => this.handleShowModal({srcPath})} key={pic.id}>
            <img className="imageList" src={srcPath}  alt={pic.id} />
          </div>
        )
      });
      this.setState(prevState => ({
        pictures: [...prevState.pictures, picArray],
        currentPage: prevState.currentPage + 1
      }));
    }.bind(this))
  };

  handleChange = (e) => {
    this.setState({textInput: e.target.value});
    fetch(`https://www.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=921d41497b47fc324e638fa6bd21683d&tags=${this.state.textInput}&per_page=&page=${this.state.currentPage}&format=json&nojsoncallback=1`)
    .then(function(response){
        return response.json();
    })
    .then(function(j){
      let searchArray = j.photos.photo.map((pic,i) => {
        let srcPath = 'https://farm'+pic.farm+'.staticflickr.com/'+pic.server+'/'+pic.id+'_'+pic.secret+'.jpg';
        return (<div className="imgBoundary pointer" onClick={() => this.handleShowModal({srcPath})} key={pic.id}><img className="imageList" src={srcPath} alt={pic.id} /></div>)
      });
      this.setState(prevState => ({
        pictures: searchArray,
        currentPage: prevState.currentPage + 1
      }));
    }.bind(this))
  };

  delay = (function(){
    var timer = 0;
    return function(callBack, ms) {
      clearTimeout(timer);
      timer = setTimeout(callBack, ms);
    }
  })();

  render() {
    return (
      <div className="App">
      {
        this.state.isOpen ? <div className="modalBackDrop" onClick={() => this.handleShowModal()}><div className="modalContent"><img src={this.state.picPath.srcPath} alt={this.state.picPath.srcPath} /></div></div> : null
      }
        <div className="searchWrapper">
          <input
            type="text"
            autoComplete="on"
            placeholder="Search Here..."
            className="search_field"
            onChange={this.handleChange}
            onKeyUp={() => this.delay(function(){
                this.reloadImages();
            }.bind(this),1000)}
          />
        </div>
        <InfiniteScroll
          pageStart={0}
          loadMore={this.reloadImages}
          hasMore={true}
          loader={<h4>Loading...</h4>}
        >
          <div className="pictureWrapper">
            {this.state.pictures}
          </div>

        </InfiniteScroll>
      </div>
    )
  }
}
export default App;