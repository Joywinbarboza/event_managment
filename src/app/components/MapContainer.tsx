// import { useState } from 'react';
// import { LoadScript, GoogleMap, Autocomplete } from '@react-google-maps/api';

// const LocationAutocomplete = ({ onPlaceSelect }) => {
//   const [autocomplete, setAutocomplete] = useState(null);

//   const onLoad = (autocomplete) => {
//     setAutocomplete(autocomplete);
//   };

//   const onPlaceChanged = () => {
//     if (autocomplete !== null) {
//       const place = autocomplete.getPlace();
//       onPlaceSelect({
//         latitude: place.geometry.location.lat(),
//         longitude: place.geometry.location.lng(),
//       });
//     } else {
//       console.log('Autocomplete is not loaded yet!');
//     }
//   };

//   return (
//     <LoadScript
//       googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY"
//       libraries={['places']}
//     >
//       <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
//         <input
//           type="text"
//           placeholder="Enter a location"
//           style={{
//             boxSizing: `border-box`,
//             border: `1px solid transparent`,
//             width: `100%`, // Adjust width as needed
//             height: `32px`,
//             padding: `0 12px`,
//             borderRadius: `3px`,
//             boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
//             fontSize: `14px`,
//             outline: `none`,
//             textOverflow: `ellipses`,
//           }}
//         />
//       </Autocomplete>
//     </LoadScript>
//   );
// };

// export default LocationAutocomplete;
