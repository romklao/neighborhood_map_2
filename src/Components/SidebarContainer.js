import React, { Component } from 'react';
import PropTypes from 'prop-types';

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

  onOpenMarker = (e) => {
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

    return (
      <div>
        <p>Attractions in Silicon Valley</p>
          <input
            id="search-input"
            type="search"
            list="places"
            placeholder="Place Name"
            onChange={this.onOpenMarker}
          />
          <datalist id="places">
            {markers.map((marker, index) => (
              <option
                className="place-option"
                value={ marker.title }
                key={ index }
              />
            ))}
          </datalist>
          <input
            type="submit"
            value="Filter"
            onClick={this.filterLocations}
          />
      </div>
    );
  }
}

export default SidebarContainer;