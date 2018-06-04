import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state = {
    locations: [
      {title: 'Intel Museum', location: {lat: 37.387878, lng: -121.963544}},
      {title: 'Santa Clara Railroad Depot and Tower', location: {lat: 37.353056, lng: -121.936389}},
      {title: 'Palo Alto Baylands Nature Preserve', location: {lat: 37.459608, lng:  -122.106412}},
      {title: 'Buck’s of Woodside', location: {lat: 37.429667, lng: -122.255111}},
      {title: 'Apple’s Company Store and Headquarters', location: {lat: 37.33182, lng: -122.03118}},
      {title: 'Ardenwood Historic Farm', location: {lat: 37.558056, lng: -122.049444}},
      {title: 'NASA Ames Research Center', location: {lat: 37.415229, lng: -122.06265 }},
      {title: 'Castle Rock State Park', location: {lat: 37.2306, lng: -122.09568}},
      {title: 'Filoli Center', location: {lat: 37.4704, lng: -122.310703}},
      {title: 'The Last Spike', location: {lat: 50.975278, lng: -118.723611}},
      {title: 'Mt. Umunhum', location: {lat: 37.160502, lng: -121.898567}},
      {title: 'The Winchester Mystery House', location: {lat: 37.318361, lng: -121.950761}},
      {title: 'Peralta Adobe', location: {lat: 37.336403, lng: -121.894753}},
      {title: 'Kelley Park', location: {lat: 37.323889, lng: -121.861944}},
      {title: 'Stanford Memorial Church', location: {lat: 37.4268, lng: -122.1705}},
      {title: 'San Jose Municipal Rose Garden', location: {lat: 37.33176, lng: -121.92859}},
      {title: 'The Tech Museum of Innovation', location: {lat: 37.331437, lng: -121.890728}},
      {title: 'San Mateo County History Museum', location: {lat: 37.486882, lng: -122.229688}},
      {title: 'IBM’s New Almaden Research Lab', location: {lat: 37.211, lng: -121.805}},
      {title: 'New Almaden Quicksilver Mine Museum', location: {lat: 37.18, lng: -121.835556}}
    ]
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
