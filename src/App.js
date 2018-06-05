import React, { Component } from 'react';
import axios from 'axios';
import MapContainer from './Components/MapContainer';
import config from './Config.js';
import './App.css';

class App extends Component {
  state = {
    locations: [
      {
        title: 'Intel Museum',
        location: {
          lat: 37.387878,
          lng: -121.963544
        }
      },
      {
        title: 'South Bay Historical Railroad Society',
        location: {
          lat: 37.353056,
          lng: -121.936389
        }
      },
      {
        title: 'Palo Alto Baylands Nature Preserve',
        location: {
          lat: 37.459608, lng: -122.106412
        }
      },
      {
        title: 'Buck’s of Woodside',
        location: {
          lat: 37.429667, lng: -122.255111
        }
      },
      {
        title: 'Apple Campus',
        location: {
          lat: 37.33182,
          lng: -122.03118
        }
      },
      {
        title: 'Ardenwood Historic Farm',
        location: {
          lat: 37.558056,
          lng: -122.049444
        }
      },
      {
        title: 'Castle Rock State Park',
        location: {
          lat: 37.2306,
          lng: -122.09568
        }
      },
      {
        title: 'Filoli Center',
        location: {
          lat: 37.4704,
          lng: -122.310703
        }
      },
      {
        title: 'The Last Spike',
        location: {
          lat: 50.975278,
          lng: -118.723611
        }
      },
      {
        title: 'Mt. Umunhum',
        location: {
          lat: 37.160502,
          lng: -121.898567
        }
      },
      {
        title: 'The Winchester Mystery House',
        location: {
          lat: 37.318361,
          lng: -121.950761
        }
      },
      {
        title: 'Peralta Adobe',
        location: {
          lat: 37.336403,
          lng: -121.894753
        }
      },
      {
        title: 'Kelley Park',
        location: {
          lat: 37.323889,
          lng: -121.861944
        }
      },
      {
        title: 'Stanford Memorial Church',
        location: {
          lat: 37.4268,
          lng: -122.1705
        }
      },
      {
        title: 'San Jose Municipal Rose Garden',
        location: {
          lat: 37.33176,
          lng: -121.92859
        }
      },
      {
        title: 'The Tech Museum of Innovation',
        location: {
          lat: 37.331437,
          lng: -121.890728
        }
      },
      {
        title: 'San Mateo County History Museum',
        location: {
          lat: 37.486882,
          lng: -122.229688
        }
      },
      {
        title: 'IBM’s New Almaden Research Lab',
        location: {
          lat: 37.211, lng: -121.805
        }
      },
      {
        title: 'New Almaden Quicksilver Mine Museum',
        location: {
          lat: 37.18,
          lng: -121.835556
        }
      }
    ]
  }

  map = null;
  markers = [];

  componentDidMount() {
    this.getYelpReviews();
    window.initMap = this.initMap;
    createScriptTagGoogleMapApi('https://maps.googleapis.com/maps/api/js?libraries=places,geometry,drawing&key=AIzaSyA4FUFm6FyFiWEWu_em6VATxxHfEs2lUts&v=3&callback=initMap');
  }

  initMap = () => {
    let self = this;

    self.map = new window.google.maps.Map(document.getElementById('map-container'), {
      center: {lat:37.3852183, lng: -122.1141298},
      zoom: 10,
      mapTypeControl: false
    });

    this.createMarkers();
    console.log('app.initMap(end)', self.map)
  }

  createMarkers = () => {
    let self = this;

    for (let location of this.state.locations) {
      let position = location.location;
      let title = location.title;

      let marker = new window.google.maps.Marker({
        position: position,
        title: title,
        animation: window.google.maps.Animation.DROP,
        map: self.map,
        id: null
      });

      let placesService = new window.google.maps.places.PlacesService(self.map);
      let placeInfoWindow = new window.google.maps.InfoWindow();

      self.markers.push(marker);

      marker.addListener('click', function() {
        placesService.textSearch({query: marker.title}, (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            self.generateInfoWindow(marker, placeInfoWindow)
          }
          console.log('results', results)
          if (results[0]) {
            let markerId = results[0].place_id;
            marker.id = markerId;
          }
        });
      });
    }
  }

  generateInfoWindow = (marker, infowindow) => {
    let self = this;

    if (infowindow.marker !== marker) {
      infowindow.setContent('');
      infowindow.marker = marker;
      console.log('marker', marker)
    }

    let streetViewService = new window.google.maps.StreetViewService();
    let radius = 100;

    let getStreetView = (data, status) => {
      if (status === window.google.maps.StreetViewStatus.OK) {
        let nearStreetViewLocation = data.location.latLng;
        let heading = window.google.maps.geometry.spherical.computeHeading(
          nearStreetViewLocation, marker.position);

        self.getPlacesDetails(marker, 'info-streetview')

        infowindow.setContent(
          `<div id="info-wrap-streetview">
            <div id="pano"></div>
            <div id='info-streetview'></div>
           </div>`
        );
        let panoramaOptions = {
          position: nearStreetViewLocation,
          pov: {
            heading: heading,
            pitch: 5,
          }
        };
        let panoContainer = window.document.getElementById('pano');
        let panorama = new window.google.maps.StreetViewPanorama(panoContainer, panoramaOptions);
      } else {

        self.getPlacesDetails(marker, 'info-no-streetview')

        infowindow.setContent(
          `<div id="infowrap-no-streetview">
            <div id="no-image">No street view found!</div>
            <div id='info-no-streetview'></div>
          </div>`
        );
      }
    }

    streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
    infowindow.open(self.map, marker);
    infowindow.addListener('closeclick', () => {infowindow = null});
  }

  getPlacesDetails = (marker, elementId) => {
    let self = this;
    let service = new window.google.maps.places.PlacesService(self.map);
    console.log('service', service)

    service.getDetails({placeId: marker.id}, function(place, status) {
      console.log('placeId, status', marker.id, status)
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

  getYelpReviews = (auth) => {
    let apiData = {
      headers: {'Authorization': config.headers.Authorization},
      params: {
        latitude: this.state.locations[14].location.lat,
        longitude: this.state.locations[14].location.lng,
        term: this.state.locations[14].title,
        limit: 1,
      }
    }
    console.log('apiData', apiData)
    axios.get('https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search', apiData)
    .then(response => console.log('response', response))
    .catch(err => console.log('error', err));
  }


  render() {
    return (
      <div className="app">
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
