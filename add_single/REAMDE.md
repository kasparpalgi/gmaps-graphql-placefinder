Documentation
=============

This script provides an interface for fetching place details from Google Maps API, and subsequently inserting those details into a Hasura GraphQL server. The script prompts the user to input a Google Maps Place ID or place name, fetches data from the Google Maps API, and inserts the data into the Hasura GraphQL server if the place data does not already exist in the server.

Prerequisites
-------------

*   Node.js
*   NPM

### Dependencies

*   prompt-sync: A library for synchronous prompt in Node.js.
*   @googlemaps/google-maps-services-js: A Node.js client for Google Maps Services.
*   graphql-request: A simple and flexible GraphQL client for Node.js.

Installation
------------

To install the dependencies, run:

bash

```bash
npm install prompt-sync @googlemaps/google-maps-services-js graphql-request
```

Usage
-----

Run the script using Node.js:

`node script.js`

### Functions

#### fetchAndInsertPlace()

This function gets user input for a place ID or place name, fetches the data from Google Maps API using either place details or text search request. The result is then logged to the console and sent to `checkAndInsertPlace()` function to verify if the place already exists in the database. If there are any errors during fetching, the errors are logged to the console.

#### checkAndInsertPlace(place)

This function checks whether the place already exists in the Hasura GraphQL server. If the place does not exist, it sends the place data to the `insertPlaceWithReviewsAndPhotos(place)` function.

#### insertPlaceWithReviewsAndPhotos(place)

This function sends a mutation request to the Hasura GraphQL server to insert a new place. The place details include:

*   name
*   google\_place\_id
*   geolocation
*   nearby
*   google\_rating
*   ratings\_amount
*   opening\_hours
*   url
*   type
*   phone\_number
*   address
*   photos

Security
--------

Sensitive data, such as the Google Maps API key and the Hasura admin secret key, are exposed in the code. For better security, these keys should be stored in a .env file or environment variables, and the values should be fetched from the process.env object.

Note
----

Ensure the Hasura GraphQL server accepts the requests from the system running this script by configuring CORS (Cross-Origin Resource Sharing) appropriately.