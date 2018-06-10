import React, { Component } from 'react';
import PropTypes from 'prop-types';
import sortBy from 'sort-by';

class SidebarContainer extends Component {

  static propTypes = {
    markers: PropTypes.array.isRequired
  }
  // Only show the filtered markers on the map acoording to users search
  filterLocations = (e) => {
    e.preventDefault();
    const { markers } = this.props;
    const query = document.getElementById('search-input').value;

    for (let marker of markers) {
      if (marker.title.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
        marker.setVisible(true);
      } else {
        marker.setVisible(false);
      }
    };
  }
  // Open the marker that is clicked from the search list
  openMarker = (e) => {
    e.preventDefault();
    const { markers } = this.props;
    const value = e.target.value;

    for (let marker of markers) {
      if (value === marker.title) {
        window.google.maps.event.trigger(marker, 'click');
        break;
      }
    }
  }
  // Hide or show the search container when the ham icon is clicked
  toggleHidden = () => {
    const sideBar = document.getElementById('search-container');
    const navHam = document.getElementById('nav-ham');

    if (sideBar.style.display === "block") {
      sideBar.style.display = "none";
    } else {
      sideBar.style.display = "block";
    }

    if (navHam.style.left === "16em") {
      navHam.style.left = "0";
    } else {
      navHam.style.left = "16em";
    }
  }

  render() {

    const { markers } = this.props;
    markers.sort(sortBy('title'));

    return (
      <nav className="nav-sidebar-container">
        <header id="nav-ham-wrap">
          <div id="nav-ham">
            <a
              onClick={this.toggleHidden}
              className="ham"
            >
              <i className="fas fa-bars"></i>
            </a>
          </div>
        </header>
        <aside id="search-container">
          <div id="input-box">
            <p className="header">
              Silicon Valley
            </p>
            <form autoComplete="off">
              <input
                id="search-input"
                type="search"
                list="places"
                aria-labelledby="place name"
                placeholder="Place Name"
                onChange={this.openMarker}
              />
              <datalist
                id="places">
                {markers.map((marker, index) => (
                  <option
                    className="place-option"
                    value={ marker.title }
                    key={ index }
                    tabIndex="0"
                  />
                ))}
              </datalist>
              <input
                className="submit"
                aria-labelledby="filter"
                type="submit"
                value="Filter"
                onClick={this.filterLocations}
              />
            </form>
          </div>
        </aside>
      </nav>
    );
  }
}

export default SidebarContainer;