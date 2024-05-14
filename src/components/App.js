import React from 'react';
import { connect } from 'react-redux';
import Navbar from './Navbar';
import MovieCard from './MovieCard';
import { addMovies, setShowFavourites } from '../actions';
import { data as moviesList } from '../data';
//import {StoreContext} from '../index';

class App extends React.Component {
  componentDidMount() {
    this.props.dispatch(addMovies(moviesList));
  }

  isMovieInFavourites = (movie) => {
    const { movies } = this.props;

    const index = movies.favourites.indexOf(movie);
    if (index !== -1) {
      return true;
    }

    return false;
  };

  changeTab = (val) => {
    this.props.dispatch(setShowFavourites(val));
  };
  render() {
    const { movies, search } = this.props; // will return { movies: {}, search: []}
    console.log('movies', movies);
    const { list, showFavourites = [], favourites = [] } = movies;
    const displayMovies = showFavourites ? favourites : list;

    return (
      <div className="App">
        <Navbar search={search} />  {/** Removed dispatch props from here as we are using context and got dispatch from there */}
        <div className="main">
          <div className="tabs">
            <div
              className={`tab ${showFavourites ? '' : 'active-tabs'}`}
              onClick={() => this.changeTab(false)}
            >
              Movies
            </div>
            <div
              className={`tab ${showFavourites ? 'active-tabs' : ''}`}
              onClick={() => this.changeTab(true)}
            >
              Favourites
            </div>
          </div>

          <div id="list">
            {displayMovies.map((movie) => (
              <MovieCard
                movie={movie}
                key={movie.imdbID}
                dispatch={this.props.dispatch}  // If we will connect function with MovieCard also, we don't have to pass this dispatch
                isFavourite={this.isMovieInFavourites(movie)}
              />
            ))}
            {displayMovies.length === 0 ? (
              <div className="no-movies">No movies to display! </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

// We are using wrapper and not directly putting the consumer inside the render function of App because componentDidMount also needs this store
// We can use storecontext provider and consumer inside render() method only

// class AppWrapper extends React.Component { // Whenever store value changes, whatever component which is consuming it gets re-rendered
//   render() {
//     return (
//       <StoreContext.Consumer>
//         {(store) => <App store={store} />} // The callback function inside jsx gets store (could be any name) as argument when react calls it. Whatever we are passing inside provider will be accepted here as parameter
//       </StoreContext.Consumer>
//     );
//   }
// }
//export default AppWrapper;

// We don't have to change import App as whatever we export as default can be imported with any name, so we keep App itself and not AppWrapper


// But this context is not good as we have to write wrapper for every component like Navbar MovieCard, etc. To get rid of this, we can use connect.
// - So what we want is if somehow we can tell Redux that hey I want this component to be connected to store and I want this data from the store 
//   in my component. And we want to do all of that without wrapping our component and without us as consumers touching Context. That means I want 
//   to somehow connect to the redux store without doing all this heavy lifting myself right.

// - So to achieve this, what we can do is we will create a function connect() and we will tell connect what data we want and which component we want 
//   it in. And this connect function will return us a new component which behaves just like the Wrapper component but without actually doing the heavy 
//   lifting with Context and wrapping.

// - so lets see how this will work, so would want to call our `connect()` like this, so we need to tell connect 2 things
//     - what data we want from store
//     - and the component we want it in

// function callback(store) { // This store denotes whatever we have stored in redux store
//   return {
//     movies: store.movies,
//     search: store.search,
//   };
// }

function callback({movies, search}) {
  return {
    movies,
    search
  };
}

const connectedComponent = connect(callback)(App); //connect function will call the callback function with state(redux store) passed in arguments
export default connectedComponent; // so movies and search from the store will be passed as props to App component

// In this App component, the dispatch method will be passed as props by default. This is the behavior of connect method. That's why, we are
// mentioning the data we stored in store in the callback function and not dispatch method. Also here, only App will be re-rendered if there 
// is any change in movies or search as only App is connected via connect method
