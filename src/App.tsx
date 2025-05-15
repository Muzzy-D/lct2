import React, { useState } from 'react';
import { Bus, Calendar, Clock, MapPin, Search } from 'lucide-react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';

// Lewis County coordinates (centralized view)
const center = {
  lat: 46.5538,
  lng: -122.8154
};

const libraries: ("places" | "drawing" | "geometry" | "localContext" | "visualization")[] = ["places"];

function App() {
  const [departureDate, setDepartureDate] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [selectedFrom, setSelectedFrom] = useState<google.maps.LatLngLiteral | null>(null);
  const [selectedTo, setSelectedTo] = useState<google.maps.LatLngLiteral | null>(null);

  const {
    value: fromValue,
    suggestions: { data: fromSuggestions },
    setValue: setFromValue,
    clearSuggestions: clearFromSuggestions
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: 'us' },
      bounds: {
        north: 46.8538,
        south: 46.2538,
        east: -122.5154,
        west: -123.1154,
      }
    },
    debounce: 300
  });

  const {
    value: toValue,
    suggestions: { data: toSuggestions },
    setValue: setToValue,
    clearSuggestions: clearToSuggestions
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: 'us' },
      bounds: {
        north: 46.8538,
        south: 46.2538,
        east: -122.5154,
        west: -123.1154,
      }
    },
    debounce: 300
  });

  const handleFromSelect = async (address: string) => {
    setFromValue(address, false);
    clearFromSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      setSelectedFrom({ lat, lng });
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  const handleToSelect = async (address: string) => {
    setToValue(address, false);
    clearToSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      setSelectedTo({ lat, lng });
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2">
            <Bus className="h-8 w-8" />
            <h1 className="text-2xl font-bold">Lewis County Transit Route Planner</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Plan Your Trip</h2>
            
            {/* Location Inputs */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-4">
                <MapPin className="text-blue-600 h-5 w-5 flex-shrink-0" />
                <div className="flex-1">
                  <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-1">
                    From
                  </label>
                  <input
                    type="text"
                    id="from"
                    value={fromValue}
                    onChange={(e) => setFromValue(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter starting location"
                  />
                  {fromSuggestions.length > 0 && (
                    <ul className="mt-2 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      {fromSuggestions.map((suggestion) => (
                        <li
                          key={suggestion.place_id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleFromSelect(suggestion.description)}
                        >
                          {suggestion.description}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <MapPin className="text-blue-600 h-5 w-5 flex-shrink-0" />
                <div className="flex-1">
                  <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">
                    To
                  </label>
                  <input
                    type="text"
                    id="to"
                    value={toValue}
                    onChange={(e) => setToValue(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter destination"
                  />
                  {toSuggestions.length > 0 && (
                    <ul className="mt-2 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      {toSuggestions.map((suggestion) => (
                        <li
                          key={suggestion.place_id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleToSelect(suggestion.description)}
                        >
                          {suggestion.description}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* Date and Time Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-4">
                <Calendar className="text-blue-600 h-5 w-5 flex-shrink-0" />
                <div className="flex-1">
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Clock className="text-blue-600 h-5 w-5 flex-shrink-0" />
                <div className="flex-1">
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    id="time"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Search Button */}
            <button
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Search className="h-5 w-5" />
              <span>Find Routes</span>
            </button>
          </div>

          {/* Map Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 h-[600px]">
            <LoadScript
              googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
              libraries={libraries}
            >
              <GoogleMap
                mapContainerClassName="w-full h-full rounded-lg"
                center={center}
                zoom={11}
              >
                {selectedFrom && <Marker position={selectedFrom} />}
                {selectedTo && <Marker position={selectedTo} />}
              </GoogleMap>
            </LoadScript>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2025 Lewis County Transit Route Planner. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;