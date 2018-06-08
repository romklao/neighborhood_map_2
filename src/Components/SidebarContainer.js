import React, { Component } from 'react';
import PropTypes from 'prop-types';
import sortBy from 'sort-by';

class SidebarContainer extends Component {

  static propTypes = {
    markers: PropTypes.array.isRequired
  }

  filterLocations = () => {
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

  openMarker = (e) => {
    const { markers } = this.props;
    const value = e.target.value;

    for (let marker of markers) {
      if (value === marker.title) {
        window.google.maps.event.trigger(marker, 'click');
        break;
      }
    }
  }

  render() {

    const { markers } = this.props;

    markers.sort(sortBy('title'));

    return (
      <nav className="nav-sidebar-container">
        <div className="nav-logo-ham">
          <a id="menu" className="nav-ham"><i className="fas fa-bars"></i></a>
        </div>
        <div className="search-container">
          <p>Silicon Valley</p>
          <div className="input-box">
            <input
              id="search-input"
              type="search"
              list="places"
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
                />
              ))}
            </datalist>
            <input
              className="submit"
              type="submit"
              value="Filter"
              onClick={this.filterLocations}
            />
          </div>
        </div>
      </nav>
    );
  }
}

export default SidebarContainer;