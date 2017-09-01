/*!
 * ===========================================
 * General Conversion Tracking v1.1
 * Copyright 2017 resmio GmbH (Philipp Sahner)
 * ===========================================
 */
/*
 * +++++++++++++++++++++++++++++++++++++++++++++++++++++
 * Check the url for parameters when document has loaded
 * and handle it accordingly
 * +++++++++++++++++++++++++++++++++++++++++++++++++++++
 */
window.onload = function(){
  // get the url, check it for parameters and update the links
	  var url = window.location.href,
      obj = getAllUrlParams(url);
      hasGclidParam = false;
      isObject = Object.keys(obj).length !== 0 && obj.constructor === Object;
  if (isObject) {
    // create the cookies for the parameters
    for (var i = 0, len = Object.keys(obj).length; i < len; i++) {
      var key = Object.keys(obj)[i];
          current_value = readCookie(key),
          value = obj[key].toString().toLowerCase();
      if (value != current_value) {
        createCookie(key, value, 90);
      }
      if (key == 'gclid') {
        hasGclidParam = true;
      }
    }
  }
  // no gclid parameter but gclid cookie
  // than add it to the parameters/links
  if (hasGclidParam == false) {
    // check cookies for gclid and add it to object if it is there
    var gclidValue = readCookie('gclid');
    if (gclidValue != '') {
      obj['gclid'] = gclidValue;
    }
  }
  updateLinks(url, obj);
}

/*
 * +++++++++++++++++
 * General functions
 * +++++++++++++++++
 */

/*
 * Get all the parameters of an URL as object
 * ------------------------------------------
 */
function getAllUrlParams(url) {
  // get query string from url (optional) or window (and only keep the parameter part)
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
  // variable (object) which stores the parameters
  var obj = {};
  // if query string exists
  if (queryString) {
    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0];
    // split our query string into its component parts
    var paramArray = queryString.split('&');
    for (var i=0; i<paramArray.length; i++) {
      // separate the keys and the values
      var a = paramArray[i].split('=');
      // in case params look like: list[]=thing1&list[]=thing2 than we have to get rid of "[]" and a possible index number inside brackets
      var paramNum;
      var paramName = a[0].replace(/\[\d*\]/, function(v) {
        paramNum = v.slice(1,-1);
        return '';
      });
      // set parameter value (use 'true' if empty)
      var paramValue = typeof(a[1])==='undefined' ? true : a[1];
      // (optional) keep case consistent
      paramName = paramName.toString().toLowerCase();
      paramValue = paramValue.toString().toLowerCase();
      // if parameter name already exists
      if (obj[paramName]) {
        // convert value to array (if still string)
        if (typeof obj[paramName] === 'string') {
          obj[paramName] = [obj[paramName]];
        }
        // if no array index number specified...
        if (typeof paramNum === 'undefined') {
          // put the value on the end of the array
          obj[paramName].push(paramValue);
        }
        // if array index number specified...
        else {
          // put the value at that index number
          obj[paramName][paramNum] = paramValue;
        }
      }
      // if param name doesn't exist yet, set it
      else {
        obj[paramName] = paramValue;
      }
    }
  }
  return obj;
}

/*
 * Creates the cookie
 * -------------------
 */
function createCookie(name,value,days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime()+(days*24*60*60*1000));
    var expires = "; expires="+date.toGMTString();
  }
  else {
    var expires = "";
  }
  document.cookie = name+"="+value+expires+"; path=/";
}

/*
 * Reads a specific cookie and returns its value
 * ---------------------------------------------
 */
function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

/*
 * Deletes a specific cookie
 * -------------------------
 */
function eraseCookie(name) {
  document.cookie = name+"=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
}

/*
 * Updates all the links of a website
 * ----------------------------------
 */
function updateLinks(url, obj) {
  var pathArray = url.split( '/'),
      protocol = pathArray[0],
      host = pathArray[2],
      baseUrl = protocol + '//' + host,
      theUrl = url.split('?')[0],
      params = '',
      counter = 0,
      noParams = true,
      pagelinks = document.getElementsByTagName('a');
  for (var i = 0, len = Object.keys(obj).length; i < len; i++) {
    console.log('going through the parameters');
    var key = Object.keys(obj)[i],
        value = obj[key];
    if (counter == 0) {
      params = '?' + key + '=' + value;
      counter = counter + 1;
    }
    else {
      params = params + '&' + key + '=' + value;
      counter = counter + 1;
    }
  }
  if (theUrl != params) {
    noParams = false;
    for (var i = 0, len = pagelinks.length; i < len; i++) {
      var hrefTemp = pagelinks[i].getAttribute('href');
      if (hrefTemp.indexOf(baseUrl) !== -1) {
        hrefTemp = hrefTemp.split('?')[0];
        pagelinks[i].setAttribute('href', hrefTemp + params);
      }
    }
  }
}

/* =========================
 * !!! End Own functions !!!
 * ========================= */
