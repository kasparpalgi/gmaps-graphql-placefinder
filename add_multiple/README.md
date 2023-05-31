Fetch and Insert Google Maps Places to Hasura GraphQL API
=========================================================

This script fetches details about places from Google Maps using either the place ID or the name of the place and inserts those details into a Hasura GraphQL API. It processes an array of place names or IDs.

**NOTE:** Please replace the placeholders for the Google Maps API key and Hasura admin secret with your actual credentials.

Requirements
------------

*   Node.js and npm installed.
*   The following Node.js packages installed:
    *   `prompt-sync`
    *   `@googlemaps/google-maps-services-js`
    *   `graphql-request`

Installation
------------

1.  Install the required packages via npm:

bash

```bash
npm install prompt-sync @googlemaps/google-maps-services-js graphql-request
```

Usage
-----

1.  Run the script:

bash

```bash
node script.js
```

2.  The script fetches details about each place listed in the `places` array.

Overview of Functions
---------------------

### `fetchAndInsertPlaces(placeIdsOrNames)`

This function processes an array of place names or IDs. It fetches details about each place from Google Maps and calls the `checkAndInsertPlace(result)` function for each place.

### `checkAndInsertPlace(place)`

This function checks if the place already exists in the Hasura database. If the place doesn't exist, it calls the `insertPlaceWithReviewsAndPhotos(place)` function to insert the place into the database.

### `insertPlaceWithReviewsAndPhotos(place)`

This function prepares the data for the Hasura mutation query to insert a place and its details into the database. It constructs the mutation query, prepares the variables object and sends the GraphQL request to the Hasura API.

Data
----

The script processes an array of place names or IDs, named `places`. This array contains strings where each string is either a place ID or a place name.

Environment Variables
---------------------

This script requires the following environment variables:

*   `GOOGLE_MAPS_API_KEY`: The API key for Google Maps. This is used to fetch the place details.
*   `HASURA_GRAPHQL_ENDPOINT`: The endpoint URL for your Hasura GraphQL API. This is used to insert the place details.
*   `HASURA_ADMIN_SECRET`: The admin secret for your Hasura GraphQL API. This is used to authenticate the GraphQL requests.

**Please remember to keep your API keys and admin secrets secure. Do not expose them publicly or commit them to version control.**