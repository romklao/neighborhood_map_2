import React, { Component } from 'react';
//import PropTypes from 'prop-types';
import escapeRegExp from 'escape-string-regexp';

class SidebarContainer extends Component {

  static propTypes = {
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
    //const { query } = this.state;

    return (
      <div>
        <p>Attractions in Silicon Valley</p>
          <input
            id="search-input"
            type="search"
            list="places"
            placeholder="Place Location"
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
            onClick={this.searchPlaces}
          />
      </div>
    );
  }
}

export default SidebarContainer;