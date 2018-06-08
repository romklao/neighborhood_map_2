import React, { Component } from 'react';
import axios from 'axios';
import MapContainer from './Components/MapContainer';
import SidebarContainer from './Components/SidebarContainer';
import {theme, theme2, theme3} from './Theme';
import config from './Config';
import './App.css';

class App extends Component {
  state = {
    markers: [],
    locations: require('./Components/locations.json'),
    styles: theme
  }

  map = null;
  markers = [];

  componentDidMount() {
      console.log('theme',this.state.styles)

    window.initMap = this.initMap;
    createScriptTagGoogleMapApi(`https://maps.googleapis.com/maps/api/js?libraries=places,
      geometry,drawing&key=AIzaSyA4FUFm6FyFiWEWu_em6VATxxHfEs2lUts&v=3&callback=initMap`);
  }

  initMap = () => {
    let self = this;
    const mapView = document.getElementById('map-container');

    self.map = new window.google.maps.Map(mapView, {
      center: {lat:37.4192183, lng: -122.181167},
      zoom: 10,
      styles: self.state.styles,
      mapTypeControl: false
    });

    self.createMarkers();
  }

  createMarkers = () => {
    let self = this;

    for (let location of this.state.locations) {
      let position = location.location;
      let latitude = location.location.lat;
      let longitude = location.location.lng;
      let title = location.title;

      let marker = new window.google.maps.Marker({
        position: position,
        latitude: latitude,
        longitude: longitude,
        title: title,
        animation: window.google.maps.Animation.DROP,
        map: self.map,
        id: null
      });

      let placesService = new window.google.maps.places.PlacesService(self.map);
      let placeInfoWindow = new window.google.maps.InfoWindow();
      let bounds;

      marker.addListener('click', function() {
        bounds = self.map.getBounds();

        placesService.textSearch({
          query: marker.title,
          bounds: bounds
        }, (data, status) => {
          if (data[0]) {
            let markerId = data[0].place_id;
            marker.id = markerId;
          }
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            self.generateInfoWindow(marker, placeInfoWindow)
          }
        });
      });

      self.markers.push(marker);
      self.setState({markers: self.markers});

    }
  }

  generateInfoWindow = (marker, infowindow) => {
    let self = this;

    if (infowindow.marker !== marker) {
      infowindow.setContent('');
      infowindow.marker = marker;
    }

    let streetViewService = new window.google.maps.StreetViewService();
    let radius = 100;

    let getStreetView = (data, status, ) => {
      if (status === window.google.maps.StreetViewStatus.OK) {

        let nearStreetViewLocation = data.location.latLng;
        let heading = window.google.maps.geometry.spherical.computeHeading(
          nearStreetViewLocation, marker.position);

        self.getYelpReviews(marker, 'rating-streetview');
        self.getPlacesDetails(marker, 'info-streetview');

        infowindow.setContent(
          `<div id="info-wrap-streetview">
            <div id="pano"></div>
            <div id="info-streetview"></div>
           </div>
           <div id="rating-streetview"></div>`
        );

        let panoramaOptions = {
          position: nearStreetViewLocation,
          pov: {
            heading: heading,
            pitch: 5,
          }
        };

        let panoContainer = window.document.getElementById('pano');
        new window.google.maps.StreetViewPanorama(panoContainer, panoramaOptions);

      } else {

        self.getYelpReviews(marker, 'rating-no-streetview');
        self.getPlacesDetails(marker, 'info-no-streetview');

        infowindow.setContent(
          `<div id="info-wrap-no-streetview">
            <div id="no-image">No street view found!</div>
            <div id='info-no-streetview'></div>
           </div>
           <div id="rating-no-streetview"></div>`
        );
      }
    }

    streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
    infowindow.open(self.map, marker);
    infowindow.addListener('closeclick', () => {
      infowindow = null;
    });
  }

  getPlacesDetails = (marker, elementId) => {
    let self = this;
    let service = new window.google.maps.places.PlacesService(self.map);

    service.getDetails({placeId: marker.id}, function(place, status) {

      if (status === window.google.maps.places.PlacesServiceStatus.OK) {

        let info = '<div id="info-wrap">';

        if (place.name) {
          info += `<h4>${place.name}</h4>`;
        }
        if (place.formatted_address) {
          info += `<p>${place.formatted_address}</p>`;
        }
        if (place.formatted_phone_number) {
          info += `<p>${place.formatted_phone_number}</p>`;
        }
        if (place.opening_hours) {
          info += `<h4>Hours:</h4>
                   <p>${place.opening_hours.weekday_text[0]}</p>
                   <p>${place.opening_hours.weekday_text[1]}</p>
                   <p>${place.opening_hours.weekday_text[2]}</p>
                   <p>${place.opening_hours.weekday_text[3]}</p>
                   <p>${place.opening_hours.weekday_text[4]}</p>
                   <p>${place.opening_hours.weekday_text[5]}</p>
                   <p>${place.opening_hours.weekday_text[6]}</p>`;
        }

        info += '<div>';
        document.getElementById(elementId).innerHTML = info;

      }
    });
  }

  getYelpReviews = (marker, elementId) => {
    let yelpApiUrl = {
      headers: {'Authorization': config.headers.Authorization},
      params: {
        latitude: marker.latitude,
        longitude: marker.longitude,
        term: marker.title,
        limit: 1
      }
    }
    axios.get('https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search', yelpApiUrl)
    .then(response => {
      let ratingReview = '<p>';

      if (response.data.businesses[0].rating) {
        ratingReview += `<span id="rating">Rating: </span>
                         <span id="num-rating">${response.data.businesses[0].rating} out of 5</span>`
      }
      if (response.data.businesses[0].url) {
        ratingReview += `<a href="${response.data.businesses[0].url}">Review</a>`
      }
      ratingReview += '</p>'
      document.getElementById(elementId).innerHTML = ratingReview;
    })
    .catch(err => `<p>${err}</p>`);
  }

  render() {
    return (
      <div className="app">
        <SidebarContainer
          markers={ this.state.markers }
          map={ this.map }
          generateMarkers={ this.createMarkers }
        />
        <MapContainer />
      </div>
    );
  }
}

function createScriptTagGoogleMapApi(url) {
  let tag = window.document.getElementsByTagName('script')[0];
  let scriptTag = window.document.createElement('script');

  scriptTag.async = true;
  scriptTag.defer = true;
  scriptTag.src = url;
  scriptTag.onerror = function () {
      document.write("Google Maps can't be loaded");
  };
  tag.parentNode.insertBefore(scriptTag, tag);
}

export default App;
