'use strict';

const resources = require('./resources');
var dotenv = require('dotenv').config();

var Alexa = require('alexa-sdk');
var GoogleRoute = require('./googleroute');

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = resources.APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = resources.languageStrings;
    alexa.registerHandlers(newSessionHandlers, routeFoundHandlers, startNotFoundHandlers, endNotFoundHandlers, findRouteHandlers);
    alexa.execute();
};

var states = {
    ROUTEFOUND: '_ROUTEFOUND',
    STARTNOTFOUND: '_STARTNOTFOUND',
    ENDNOTFOUND: '_ENDNOTFOUND',
};

var newSessionHandlers = {
    'LaunchIntent': function () {
        this.attributes['speechOutput'] = this.t("WELCOME_MESSAGE", this.t("SKILL_NAME"));
        this.attributes['repromptSpeech'] = this.t("WELCOME_REPROMPT");
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    },
    'DirectionIntent': function () {

        var self = this; //used in callback functions

        if(typeof this.event.request.intent.slots.StartLoc.value === 'undefined' && typeof resources.DEFAULT_START === 'undefined')
        {
            this.attributes['speechOutput'] = this.t("WRONG_INPUT_START");
            this.attributes['repromptSpeech'] = this.t("HELP_MESSAGE");

            this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech']);
        }

        if(typeof this.event.request.intent.slots.EndLoc.value === 'undefined')
        {
            this.attributes['speechOutput'] = this.t("WRONG_INPUT_END");
            this.attributes['repromptSpeech'] = this.t("HELP_MESSAGE");

            this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech']);
        }

        var route = new GoogleRoute(this.event.request.intent.slots.StartLoc.value, this.event.request.intent.slots.EndLoc.value, this.event.request.intent.slots.RouteMode.value, this.event.request.locale);

        this.emit('FindDirection', route);

    },
    'AMAZON.HelpIntent': function () {
        this.attributes['speechOutput'] = this.t("HELP_MESSAGE");
        this.attributes['repromptSpeech'] = this.t("HELP_MESSAGE");
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest':function () {
        this.emit(':tell', this.t("STOP_MESSAGE"));
    },
    'Unhandled': function () {
        this.attributes['speechOutput'] = this.t("HELP_MESSAGE");
        this.attributes['repromptSpeech'] = this.t("HELP_MESSAGE");
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    }
};

var routeFoundHandlers = Alexa.CreateStateHandler(states.ROUTEFOUND, {
      'DirectionIntent': function () {
        this.handler.state = '';
        this.emitWithState('DirectionIntent');
      },
      'SwapModeIntent': function () {
          var route = new GoogleRoute(this.attributes['routestart'],this.attributes['routeend'],this.event.request.intent.slots.RouteMode.value, this.event.request.locale)
          this.emit('FindDirection', route);
      },
      'AMAZON.HelpIntent': function () {
          this.attributes['speechOutput'] = this.t("HELP_MESSAGE");
          this.attributes['repromptSpeech'] = this.t("HELP_MESSAGE");
          this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
      },
      'AMAZON.RepeatIntent': function () {
          this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
      },
      'AMAZON.StopIntent': function () {
          this.emit('SessionEndedRequest');
      },
      'AMAZON.CancelIntent': function () {
          this.emit('SessionEndedRequest');
      },
      'SessionEndedRequest':function () {
          this.emit(':tell', this.t("STOP_MESSAGE"));
      },
      'Unhandled': function () {
          this.attributes['speechOutput'] = this.t("HELP_MESSAGE");
          this.attributes['repromptSpeech'] = this.t("HELP_MESSAGE");
          this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
      }
});

var startNotFoundHandlers = Alexa.CreateStateHandler(states.STARTNOTFOUND, {
      'DirectionIntent': function () {
        this.handler.state = '';
        this.emitWithState('DirectionIntent');
      },
      'DefineLocIntent': function () {
          var route = new GoogleRoute(this.event.request.intent.slots.Loc.value, this.attributes['routeend'], this.attributes['routemode'], this.event.request.locale)
          this.emit('FindDirection', route);
      },
      'AMAZON.HelpIntent': function () {
          this.attributes['speechOutput'] = this.t("GEO_NOT_FOUND_START", this.attributes['routestart']);
          this.attributes['repromptSpeech'] = this.t("GEO_NOT_FOUND_START", this.attributes['routestart']);
          this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
      },
      'AMAZON.RepeatIntent': function () {
          this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
      },
      'AMAZON.StopIntent': function () {
          this.emit('SessionEndedRequest');
      },
      'AMAZON.CancelIntent': function () {
          this.emit('SessionEndedRequest');
      },
      'SessionEndedRequest':function () {
          this.emit(':tell', this.t("STOP_MESSAGE"));
      },
      'Unhandled': function () {
          this.attributes['speechOutput'] = this.t("HELP_MESSAGE");
          this.attributes['repromptSpeech'] = this.t("HELP_MESSAGE");
          this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
      }
});

var endNotFoundHandlers = Alexa.CreateStateHandler(states.ENDNOTFOUND, {
      'DirectionIntent': function () {
        this.handler.state = '';
        this.emitWithState('DirectionIntent');
      },
      'DefineLocIntent': function () {
          var route = new GoogleRoute(this.attributes['routestart'], this.event.request.intent.slots.Loc.value, this.attributes['routemode'], this.event.request.locale)
          this.emit('FindDirection', route);
      },
      'AMAZON.HelpIntent': function () {
          this.attributes['speechOutput'] = this.t("GEO_NOT_FOUND_END", this.attributes['routeend']);
          this.attributes['repromptSpeech'] = this.t("GEO_NOT_FOUND_END", this.attributes['routeend']);
          this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
      },
      'AMAZON.RepeatIntent': function () {
          this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
      },
      'AMAZON.StopIntent': function () {
          this.emit('SessionEndedRequest');
      },
      'AMAZON.CancelIntent': function () {
          this.emit('SessionEndedRequest');
      },
      'SessionEndedRequest':function () {
          this.emit(':tell', this.t("STOP_MESSAGE"));
      },
      'Unhandled': function () {
          this.attributes['speechOutput'] = this.t("HELP_MESSAGE");
          this.attributes['repromptSpeech'] = this.t("HELP_MESSAGE");
          this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
      }
});

var findRouteHandlers = {
  'FindDirection': function (route){

    var self = this; //used for callback functions

    self.attributes['routestart'] = route.getStart("RAW");
    self.attributes['routeend'] = route.getEnd("RAW");
    self.attributes['routemode'] = route.getMode("OUTPUT");

    route.initHome(function(err, response){

      if(err || response.json.status != 'OK')
      {
        self.attributes['speechOutput'] = self.t("GEO_NOT_FOUND_HOME", route.getHome("RAW"));
        self.attributes['repromptSpeech'] = self.t("GEO_NOT_FOUND_HOME", route.getHome("RAW"));

        self.emit(':tell', self.attributes['speechOutput'], self.attributes['repromptSpeech']);
      }
      else
      {

        route.initStart(function(err, response){

          if(err || response.json.status != 'OK')
          {
            self.attributes['speechOutput'] = self.t("GEO_NOT_FOUND_START", route.getStart("RAW"));
            self.attributes['repromptSpeech'] = self.t("GEO_NOT_FOUND_START", route.getStart("RAW"));

            self.handler.state = states.STARTNOTFOUND;

            self.emit(':ask', self.attributes['speechOutput'], self.attributes['repromptSpeech']);
          }
          else
          {
            console.log("Start: "+response.json.results[0].formatted_address);

            route.initEnd(function(err, response){

              if(err || response.json.status != 'OK')
              {
                self.attributes['speechOutput'] = self.t("GEO_NOT_FOUND_END", route.getEnd("RAW"));
                self.attributes['repromptSpeech'] = self.t("GEO_NOT_FOUND_END", route.getEnd("RAW"));

                self.handler.state = states.ENDNOTFOUND;

                self.emit(':ask', self.attributes['speechOutput'], self.attributes['repromptSpeech']);
              }
              else
              {
                console.log("End: "+response.json.results[0].formatted_address);

                route.find(function(err, response){

                  if(err || response.json.status != 'OK')
                  {
                    self.attributes['speechOutput'] = self.t("DIRECTION_NOT_FOUND_MESSAGE", route.getStart("OUTPUT_SPEECH"), route.getEnd("OUTPUT_SPEECH")) + self.t("REQUEST_REPROMPT");
                    self.attributes['repromptSpeech'] = self.t("REQUEST_REPROMPT");

                    self.emit(':ask', self.attributes['speechOutput'], self.attributes['repromptSpeech']);
                  }
                  else
                  {
                    console.log("find: "+response.json.routes[0].legs[0].distance.text);

                    var cardTitle = self.t("DISPLAY_CARD_TITLE", self.t("SKILL_NAME"), route.getStart("OUTPUT") + " (" + route.getStart("DETAILS")+")", route.getEnd("OUTPUT") + " (" + route.getEnd("DETAILS")+")", route.getMode("OUTPUT"));

                    self.handler.state = states.ROUTEFOUND;

                    self.attributes['speechOutput'] = route.getDirection("SPEECH");
                    self.attributes['repromptSpeech'] = self.t("REQUEST_REPROMPT");
                    if(resources.CLOSE_SESSION)
                      self.emit(':tellWithCard', self.attributes['speechOutput'], cardTitle, route.getDirection("OUTPUT"));
                    else
                      self.emit(':askWithCard', self.attributes['speechOutput'], self.attributes['repromptSpeech'], cardTitle, route.getDirection("OUTPUT"));
                  }
                });
              }
            });
          }
        });
      }
    });
  }
};
