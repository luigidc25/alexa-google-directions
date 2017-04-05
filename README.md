# Alexa Google Directions (DE only)


#### THIS SKILL IS FOR PERSONAL USE ONLY AND IS NOT ENDORSED BY GOOGLE OR AMAZON - DO NOT SUBMIT THIS TO AMAZON FOR CERTIFICATION AS IT WON'T PASS!
<br/>
This skill provides route information based on Google's Directions API. It supports cities, streets and POIs, as well as all travel modes provided by the API: driving, bicycling, walking and transit.

## Premises
Beside AMAZON Developer and AWS accounts you will need a Google Developer account to get an GOOGLE MAPS API KEY.
Activate the following Maps APIs in your Google Developer Console:

- Directions - https://console.developers.google.com/apis/api/directions-backend.googleapis.com/overview
- Geocoding - https://console.developers.google.com/apis/api/geocoding-backend.googleapis.com/overview

## Quick Setup
<small>(basic knowledge of AWS Lambda and Skill setup needed, see http://alexamods.com/guide-install-ask-google-alexa-skill/ for a guide on how to setup a basic custom skill with AWS)</small>

1. Edit the resources.js to your needs:
 - APP_ID: Your Alexa Skill ID, if you want to restrict the Lambda function to it (optional)
  - GOOGLE_MAPS_API_KEY: Your API key from Google developer console (mandatory)
  - DEFAULT_START: A default start location, if you don't mention a start in speech request (e.g. your home address). It will be used to geolocate the other locations as well, so be sure you insert at least a location near to your place.
  - DEFAULT_MODE: The default travel mode, if you don't mention it during request
  - CLOSE_SESSION: enable, if you want to close session after route has been found. Otherwise it stays open to switch travel mode for same route or ask for other routes
</br></br>
2. Zip the content(!) of the folder 'src' and upload it to your Lambda function.

3. Name your skill and allocate an invocation name - I just use 'maps'. Don't forget to select your language.

4. For Interaction Model tab use the files from folder 'speechAssets':
 - Copy IntenSchema.json into the 'Intent Schema' text-area
 - Add Custom Slot Type 'LOC_STRING' and copy LOC_STRING.txt content into the 'value' text-area
 - Add Custom Slot Type 'ROUTE_MODE' and copy ROUTE_MODE.txt content into the 'value' text-area
 - Copy SampleUtterances.txt into 'Sample Utterances'
</br></br>
5. Wait - as saving will take a while with all of these sample values and utterances.<br/>
If you get a saving error, ensure that there are no tabs or empty lines in your text-areas.

6. Do a test with the Service Simulator. Most common reason for a 'invalid response' message is, that you have zipped the 'src' folder itself and not it's content.

7. Enjoy.



<br/>
If you want to add a translation, all necessary spots can be found in 'speechAssets' folder and ressources.js. Basically, there should be no need to adjust code -  if so, feel free to open an issue.
