const { Client } = require("@googlemaps/google-maps-services-js");
const { GraphQLClient, gql } = require("graphql-request");

const googleMapsClient = new Client({});
const graphqlClient = new GraphQLClient("<YOUR_GRAPHQL_API_ENDPOINT>", { // CHANGE THIS
  headers: {
    "x-hasura-admin-secret": "<API_KEY>", // CHANGE THIS - well, add to ENV variables, obiously😉
  },
});

const keywords = [
  "keyword1",
  "keyword2",
  "keyword3",
  // etc…
];

async function fetchAndInsertPlaces() {
  for (const keyword of keywords) {
    const response = await googleMapsClient.placesNearby({
      params: {
        key: "<YOUR_GOOGLE_MAPS_API_KEY>", // CHANGE THIS
        location: {
          latitude: "57.779956", // CHANGE THIS
          longitude: "26.0307793",  // CHANGE THIS
        },
        keyword,
        radius: 10000, // // CHANGE THIS (in meters so currently 10km radius)
      },
    });

    for (const result of response.data.results) {
      console.log("Place data: ", result); // Log the entire place object
      if (result.reviews) {
        for (const review of result.reviews) {
          console.log("Review: ", review); // Log each individual review
        }
      }
      await checkAndInsertPlace(result);
    }
  }
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

// CHANGE THIS - either make your database exactly the same or change the values mappings😄
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

  const variables = { // CHANGE THIS - and of course also the GraphQL variables according to your schema 
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
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=<YOUR_API_KEY_HERE>` // CHANGE THIS but of course you should rather download the image not adding to yopur app, for example, images including your API key😄 
        : null,
    height:
      place.photos && place.photos.length > 0 ? place.photos[0].height : null,
    width:
      place.photos && place.photos.length > 0 ? place.photos[0].width : null,
  };

  await graphqlClient.request(mutation, variables);
}

fetchAndInsertPlaces().catch(console.error);
