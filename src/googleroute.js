
const resources = require('./resources');
var googlemaps = require('@google/maps');

var mapsClient = googlemaps.createClient({
  key: ((typeof process.env.GOOGLE_MAPS_API_KEY !== 'undefined') ? process.env.GOOGLE_MAPS_API_KEY : resources.GOOGLE_MAPS_API_KEY),
  language: 'de'
});

function GoogleRoute(start,end,mode,locale) {
    this.res = resources.languageStrings[locale];
    this.locale = locale;
    this.home = [];
    this.start = [];
    this.end = [];
    this.mode = [];
    this.direction = [];
    this.home["RAW"] = ((typeof process.env.DEFAULT_START !== 'undefined') ? process.env.DEFAULT_START : resources.DEFAULT_START);
    if(typeof start === 'undefined' || start == ""){
      this.start["RAW"] = ((typeof process.env.DEFAULT_START !== 'undefined') ? process.env.DEFAULT_START : resources.DEFAULT_START);
    } else {
      this.start["RAW"] = start;
    }
    this.end["RAW"] = end;
    this.mode["RAW"] = mode;

    console.log("Locale: " + locale);
    console.log("SlotStart: " + start);
    console.log("Start: " + this.start["RAW"]);
    console.log("SlotEnd: " + this.end["RAW"]);
    console.log("SlotMode: " + this.mode["RAW"]);
    this.initMode();
    console.log("ModeValue:" + this.mode["VALUE"]);
    console.log("ModeOutput:" + this.mode["OUTPUT"]);

}

function initRoutepoint (point, place){
  point["LOCATION"] = place.geometry.location;
  point["DETAILS"] = place.formatted_address;
  point["BOUNDS"] = {
    north:place.geometry.viewport.northeast.lat,
    east:place.geometry.viewport.northeast.lng,
    south:place.geometry.viewport.southwest.lat,
    west:place.geometry.viewport.southwest.lng
  };

  var street, nr, poi, address, city;
  for (var i = 0; i < place.address_components.length; i++) {

    if(place.address_components[i].types.indexOf("point_of_interest") >= 0
    || place.address_components[i].types.indexOf("establishment") >= 0)
      poi = place.address_components[i]['long_name'];

    if(place.address_components[i].types.indexOf("route") >= 0)
      street = place.address_components[i]['long_name'];

    if(place.address_components[i].types.indexOf("street_number") >= 0)
      nr = place.address_components[i]['long_name'];

    if(place.address_components[i].types.indexOf("locality") >= 0
    || place.address_components[i].types.indexOf("postal_town") >= 0)
      city = place.address_components[i]['long_name'];

  }
  if(street && nr) address = street + " " + nr;

  point["CITY"] = city;

  if(poi) {
    point["OUTPUT"] = poi;
  }
  else if (address) {
    point["OUTPUT"] = address;
  }
  else if (street) {
    point["OUTPUT"] = street;
  }
  else {
    point["OUTPUT"] = point["RAW"].replace(/(^|\s)[a-z]/g,function(f){return f.toUpperCase();});
  }

  if(point["CITY"] && point["OUTPUT"].toLowerCase().indexOf(point["CITY"].toLowerCase()) < 0){
    point["OUTPUT_SPEECH"] = point["OUTPUT"] + " in " +  point["CITY"];
  }
  else {
    point["OUTPUT_SPEECH"] = point["OUTPUT"];
  }

}

GoogleRoute.prototype.t = function(str)
{
  if(typeof this.res.translation[str] === 'string'){
    var args = [].slice.call(arguments, 1),
          i = 0;
    return this.res.translation[str].replace(/%s/g, function() {
        return args[i++];
    });
  }
  else
    return this.res.translation[str];
}

GoogleRoute.prototype.initMode = function()
{

  if (typeof this.mode["RAW"] === 'undefined' || this.mode["RAW"] == "") {
    this.mode["VALUE"] = resources.DEFAULT_MODE;
    this.mode["OUTPUT"] = this.t(resources.DEFAULT_MODE);
  } else {
    for (var i = 0; i < this.t("contains_driving").length; i++) {
      if(this.mode["RAW"].toLowerCase().indexOf(this.t("contains_driving")[i]) >= 0){
        this.mode["VALUE"] = 'driving';
        this.mode["OUTPUT"] = this.t('driving');
        return true;
      }
    }
    for (var i = 0; i < this.t("contains_walking").length; i++) {
      if(this.mode["RAW"].toLowerCase().indexOf(this.t("contains_walking")[i]) >= 0){
        this.mode["VALUE"] = 'walking';
        this.mode["OUTPUT"] = this.t('walking');
        return true;
      }
    }
    for (var i = 0; i < this.t("contains_bicycling").length; i++) {
      if(this.mode["RAW"].toLowerCase().indexOf(this.t("contains_bicycling")[i]) >= 0){
        this.mode["VALUE"] = 'bicycling';
        this.mode["OUTPUT"] = this.t('bicycling');
        return true;
      }
    }
    for (var i = 0; i < this.t("contains_transit").length; i++) {
      if(this.mode["RAW"].toLowerCase().indexOf(this.t("contains_transit")[i]) >= 0){
        this.mode["VALUE"] = 'transit';
        this.mode["OUTPUT"] = this.t('transit');
        return true;
      }
    }
  }
}

GoogleRoute.prototype.initHome = function(callback) {
  var self = this;
  var location = {
      address: this.home["RAW"],
      language: this.locale,
      region: this.locale.substring(0,2)
  };
  mapsClient.geocode(location, function(err, response){
    console.log("HOME Result:"+JSON.stringify(response.json.results[0]));
    if(!err && response.json.status == "OK")
      initRoutepoint(self.home, response.json.results[0]);

    callback(err, response);
  });
}

GoogleRoute.prototype.initStart = function(callback) {
  var self = this;
  var location = {
      address: this.start["RAW"],
      language: this.locale,
      region: this.locale.substring(0,2),
      bounds: this.home["BOUNDS"]
  };
  mapsClient.geocode(location, function(err, response){
    console.log("START Result:"+JSON.stringify(response.json.results[0]));
    if(!err && response.json.status == "OK")
      initRoutepoint(self.start, response.json.results[0]);

    callback(err, response);
  });
}

GoogleRoute.prototype.initEnd = function(callback) {
  var self = this;
  var location = {
      address: this.end["RAW"],
      language: this.locale,
      region: this.locale.substring(0,2),
      bounds: this.start["BOUNDS"]
  };
  mapsClient.geocode(location, function(err, response){
    console.log("END Result:"+JSON.stringify(response.json.results[0]));
    if(!err && response.json.status == "OK")
      initRoutepoint(self.end, response.json.results[0]);

    callback(err, response);
  });
}

GoogleRoute.prototype.find = function (callback) {
  var self = this;
  var routedef = {
      origin: this.start["LOCATION"],
      destination: this.end["LOCATION"],
      mode: this.mode["VALUE"],
      units: this.t("units"),
      language: this.locale
  };
  mapsClient.directions(routedef, function(err, response){
    if(!err && response.json.status == "OK")
    {
      console.log("Route:" + JSON.stringify(response.json.routes[0]));
      var distanceTxt;
      if(response.json.routes[0].legs[0].distance.text.indexOf("0,") == 0 || response.json.routes[0].legs[0].distance.text.indexOf("0.") == 0)
        distanceTxt = response.json.routes[0].legs[0].distance.value + " " + self.t("deci_only_unit");
      else
        distanceTxt = response.json.routes[0].legs[0].distance.text;

  	  var durationTxt = response.json.routes[0].legs[0].duration.text;

      var distanceSpeech = distanceTxt;
      var durationSpeech = durationTxt;

      //Some DE-SpeechOutput-Fix only as hours and minutes are female....
      if(durationSpeech.indexOf("1 Minute") == 0)
        durationSpeech = durationSpeech.replace("1 Minute", "eine Minute");
      if(durationSpeech.indexOf("1 Stunde") == 0)
        durationSpeech = durationSpeech.replace("1 Stunde", "eine Stunde");
      if(durationSpeech.indexOf("1 Tag") == 0)
        durationSpeech = durationSpeech.replace("1 Tag", "einen Tag");
      durationSpeech = durationSpeech.replace(", 1 Minute", ", eine Minute");
      durationSpeech = durationSpeech.replace(", 1 Stunde", ", eine Stunde");

      //common replacements
      durationSpeech = durationSpeech.replace(", ", " "+self.t("and")+" ");
      for (var i = 0; i < self.t("dist_repl").length; i++) {
        distanceSpeech = distanceSpeech.replace(self.t("dist_repl")[i][0], self.t("dist_repl")[i][1]);
      }

      self.direction["OUTPUT"] = self.t("DIRECTION_TEXT", self.start["OUTPUT_SPEECH"],
                              self.end["OUTPUT_SPEECH"], self.mode["OUTPUT"], distanceTxt, durationTxt);

      self.direction["SPEECH"] = self.t("DIRECTION_TEXT", self.start["OUTPUT_SPEECH"],
                              self.end["OUTPUT_SPEECH"], self.mode["OUTPUT"], distanceSpeech, durationSpeech);

      console.log("Text: " + durationTxt);
      console.log("Speech: " + durationSpeech);
      console.log("Text: " + distanceTxt);
      console.log("Speech: " + distanceSpeech);
    }
    callback(err, response);
  });
}

GoogleRoute.prototype.getDirection = function (prop) {
  return this.direction[prop];
};

GoogleRoute.prototype.getHome = function (prop) {
  if(typeof this.home[prop] === 'undefined')
    return this.home["RAW"];

  return this.home[prop];
};

GoogleRoute.prototype.getStart = function (prop) {
  if(typeof this.start[prop] === 'undefined')
    return this.start["RAW"];

  return this.start[prop];
};

GoogleRoute.prototype.getEnd = function (prop) {
  if(typeof this.end[prop] === 'undefined')
    return this.end["RAW"];

  return this.end[prop];
};

GoogleRoute.prototype.getMode = function (prop) {
  return this.mode[prop];
};

module.exports = GoogleRoute;
