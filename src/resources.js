var resources = {};

resources.APP_ID = undefined; // TODO replace with your app ID (OPTIONAL).

resources.GOOGLE_MAPS_API_KEY = "xyz"; // TODO replace with your API KEY ID (MANDATORY).
resources.DEFAULT_START = 'Rathausmarkt 1, 20095 Hamburg'; // TODO used in requests without start. As this will always stay a custom skill, no need to handle this with user inputs and DynamoDB for now. Maybe later..
resources.DEFAULT_MODE = 'driving'; //alt: walking, bicycling, transit
resources.CLOSE_SESSION = false; //enable with [true], if you want to close session after route has been found. Otherwise it stays open to switch travel mode or ask for other routes

resources.languageStrings = {
    "de-DE": {
        "translation": {
            //output texts
            "SKILL_NAME": "Google Routen-Informationen",
            "WELCOME_MESSAGE": "Willkommen zu %s. Von wo nach wo möchtest Du?",
            "WELCOME_REPROMPT": "Wenn du wissen möchtest, was du sagen kannst, sag einfach „Hilf mir“.",
            "DISPLAY_CARD_TITLE": "%s: Von %s nach %s (%s)",
            "HELP_MESSAGE": "Du kannst beispielsweise Fragen stellen wie. „Wie komme ich von Hamburg nach Berlin“. Straßen oder Interessante Orte verstehe ich ebenfalls. Optional kannst Du ein Verkehrsmittel angeben ... Wie kann ich dir helfen?",
            "STOP_MESSAGE": "Auf Wiedersehen!",
            "WRONG_INPUT_START": "Tut mir leid, ich konnte den Startpunkt nicht verstehen. Bitte wiederhole Deine Anfrage. ",
            "WRONG_INPUT_END": "Tut mir leid, ich konnte das Routenziel nicht verstehen. Bitte wiederhole Deine Anfrage. ",
            "GEO_NOT_FOUND_HOME": "Tut mir leid, die hinterlegte Startadresse.. %s ..konnte nicht ermittelt werden. Bitte konfiguriere den Skill erneut.",
            "GEO_NOT_FOUND_START": "Tut mir leid, der genannte Startpunkt.. %s ..konnte nicht ermittelt werden. Wo möchtest Du starten? ",
            "GEO_NOT_FOUND_END": "Tut mir leid, das genannte Routenziel.. %s ..konnte nicht ermittelt werden. Wo möchtest Du hin?. ",
            "DIRECTION_NOT_FOUND_MESSAGE": "Tut mir leid, es konnte keine Route von %s nach %s gefunden werden. ",
            "DIRECTION_TEXT": "Die Entfernung von %s nach %s beträgt %s %s. Für die Strecke benötigst Du %s.",
            "REQUEST_REPROMPT": "Womit kann ich dir sonst helfen?",
            //route modes output
            "driving": "mit dem Auto",
            "walking": "zu Fuß",
            "bicycling": "mit dem Fahrrad",
            "transit": "mit den öffentlichen Verkehrsmitteln",
            //route modes check input strings to identify mode
            "contains_driving": ["auto"],
            "contains_walking": ["fuß"],
            "contains_bicycling": ["rad"],
            "contains_transit": ["bus", "bahn", "öffentlich"],
            //some replacements and strings for distance results needed for speech output
            "dist_repl":[[","," Komma "],["km","Kilometer"]], //arrays with [search,replace]
            "deci_only_unit": "Meter", //speech output unit if base unit is below 1
            //simple words
            "and": "und",
            //localized route params
            "units": "metric" //distance unit for routes; alt: imperial
        }
    }
};

module.exports = resources;
