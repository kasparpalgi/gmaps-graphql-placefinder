// Import required libraries
const prompt = require("prompt-sync")();
const { Client } = require("@googlemaps/google-maps-services-js");
const { GraphQLClient, gql } = require("graphql-request");

// Create an instance of Google Maps client
const googleMapsClient = new Client({});

// Create an instance of GraphQL client
const graphqlClient = new GraphQLClient("YOUR_GRAPHQL_ENDPOINT_URL", {
  headers: {
    "x-hasura-admin-secret": "YOUR_HASURA_ADMIN_SECRET",
  },
});

async function fetchAndInsertPlace() {
  const placeIdOrName = prompt("Please enter the place ID or name: ");

  const response = await googleMapsClient
    .placeDetails({
      params: {
        place_id: placeIdOrName,
        key: "YOUR_GOOGLE_MAPS_API_KEY", // CHANGE THIS
      },
    })
    .catch(async () => {
      const searchResponse = await googleMapsClient.textSearch({
        params: {
          query: placeIdOrName,
          key: "YOUR_GOOGLE_MAPS_API_KEY", // CHANGE THIS
        },
      });
      if (
        searchResponse.data.results &&
        searchResponse.data.results.length > 0
      ) {
        return searchResponse;
      } else {
        throw new Error("Place not found");
      }
    });

  const result = response.data.result || response.data.results[0];
  console.log("Place data: ", result);
  if (result.reviews) {
    for (const review of result.reviews) {
      console.log("Review: ", review);
    }
  }
  await checkAndInsertPlace(result);
}

async function checkAndInsertPlace(place) {
  const query = gql`
    query GetPlace($google_place_id: String!) {
      places(where: { google_place_id: { _eq: $google_place_id } }) {
        id
      }
    }
  `;

  const variables = { google_place_id: place.place_id };
  const response = await graphqlClient.request(query, variables);

  if (response.places.length === 0) {
    await insertPlaceWithReviewsAndPhotos(place);
  }
}

async function insertPlaceWithReviewsAndPhotos(place) {
  const mutation = gql`
    mutation AddPlaceReviewPhoto(
      $name: String
      $google_place_id: String
      $geolocation: String
      $nearby: String
      $google_rating: Float
      $ratings_amount: Int
      $opening_hours: String
      $url: String
      $type: String
      $phone_number: String
      $address: String
      $google_reference: String
      $url1: String
      $height: Int
      $width: Int
    ) {
      insert_places_one(
        object: {
          name: $name
          user_id: 9
          google_place_id: $google_place_id
          geolocation: $geolocation
          nearby: $nearby
          google_rating: $google_rating
          ratings_amount: $ratings_amount
          opening_hours: $opening_hours
          url: $url
          type: $type
          phone_number: $phone_number
          address: $address
          photos: {
            data: {
              google_reference: $google_reference
              url: $url1
              height: $height
              width: $width
            }
          }
        }
      ) {
        id
      }
    }
  `;

  const variables = {
    name: place.name.substring(0, 79),
    google_place_id: place.place_id,
    geolocation: `POINT (${place.geometry.location.lng} ${place.geometry.location.lat})`,
    nearby: place.vicinity,
    google_rating: place.rating,
    ratings_amount: place.user_ratings_total,
    opening_hours: JSON.stringify(place.opening_hours),
    url: place.url,
    type: place.types[0],
    phone_number: place.international_phone_number,
    address: place.formatted_address,
    google_reference:
      place.photos && place.photos.length > 0
        ? place.photos[0].photo_reference
        : null,
    url1:
      place.photos && place.photos.length > 0
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=YOUR_GOOGLE_MAPS_API_KEY` // CHANGE THIS
        : null,
    height:
      place.photos && place.photos.length > 0 ? place.photos[0].height : null,
    width:
      place.photos && place.photos.length > 0 ? place.photos[0].width : null,
  };

  await graphqlClient.request(mutation, variables);
}

fetchAndInsertPlace().catch(console.error);
