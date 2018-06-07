import React, { Component } from 'react';
//import PropTypes from 'prop-types';
import escapeRegExp from 'escape-string-regexp';

class SidebarContainer extends Component {

  // static propTypes = {
  // }

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
          />
      </div>
    );
  }
}

export default SidebarContainer;