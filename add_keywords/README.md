Documentation
=============

*** FIND // CHANGE THIS comment parts in the code ***

This Node.js script fetches and inserts Google Places data into a Hasura's GraphQL API. It employs both the Google Maps Places API (through the `@googlemaps/google-maps-services-js` package) and a GraphQL client (`graphql-request` package) to interact with the GraphQL API.

Setup
-----

Before running the script, make sure you have the following npm packages installed:

```bash
npm install @googlemaps/google-maps-services-js graphql-request
```

Script Explanation
------------------

The script consists of three major sections:

1.  **Initialization and Configuration**: This section includes requiring necessary packages, setting up Google Maps and GraphQL clients, and defining a list of keywords.
    
2.  **Main Function (fetchAndInsertPlaces)**: This function iterates through a list of keywords and sends requests to Google Maps Places API to retrieve places that match each keyword. It subsequently processes the response, logs the place data and reviews (if any), and sends the places to be checked and inserted in the database.
    
3.  **Database Interaction Functions (checkAndInsertPlace, insertPlaceWithReviewsAndPhotos)**: These functions interact with the GraphQL database. `checkAndInsertPlace` checks if the place already exists in the database. If it does not, `insertPlaceWithReviewsAndPhotos` inserts the place, including reviews and photos if available, into the database.
    

Variables and Constants
-----------------------

*   `keywords`: This array contains search phrases for finding places related to keywords. The Google Maps Places API will return places that match these phrases.
    
*   `googleMapsClient`: This is a Google Maps Client object, used to make API calls to Google Maps.
    
*   `graphqlClient`: This is a GraphQL Client object, used to make API calls to a GraphQL endpoint.
    

Functions
---------

### fetchAndInsertPlaces()

This is the main function. It cycles through each keyword, sends requests to Google Maps Places API, processes the responses, logs the data, and checks if the place should be inserted in the database.

### checkAndInsertPlace(place)

This function checks if a given place already exists in the database. If it does not exist, it calls `insertPlaceWithReviewsAndPhotos(place)` to insert the place.

*   Input: a `place` object, which represents a place returned by the Google Maps Places API.

### insertPlaceWithReviewsAndPhotos(place)

This function inserts a given place into the database, including reviews and photos if available.

*   Input: a `place` object, which represents a place returned by the Google Maps Places API.

Errors
------

Errors from the `fetchAndInsertPlaces()` function are caught and logged to the console.

API Keys
--------

This script uses a Google Maps API key and a Hasura admin secret key. These keys should be stored securely, not in the source code. In production, consider storing these keys as environment variables or in a secure key management system.

Note
----

The script includes a static user\_id (9) when inserting new places. This might need to be updated based on your application's requirements.