/*!
 * ===========================================
 * General Conversion Tracking v1.0
 * Copyright 2017 resmio GmbH (Philipp Sahner)
 * ===========================================
 */
+function ($) {
  /*
   * +++++++++++++++++++++++++++++++++++++++++++++++++++++
   * Check the url for parameters when document has loaded
   * and handle it accordingly
   * +++++++++++++++++++++++++++++++++++++++++++++++++++++
   */
  $(document).ready(function(){
    // get the url, check it for parameters and update the links
 	  var url = window.location.href,
        obj = getAllUrlParams(url);
        isGclid = false;
        isObj = false;
    if (!($.isEmptyObject(obj))) {
      isObj = true;
      // create the cookies for the parameters
      $.each( obj, function( key, value ) {
        var current_value = readCookie(key),
            value = value.toString().toLowerCase();
        if (value != current_value) {
          createCookie(key, value, 90);
        }
        if (key == 'gclid') {
          isGclid = true;
        }
      });
    }
    // no gclid parameter but gclid cookie
    // than add it to the parameters/links
    if (isGclid == false) {
      // check cookies for gclid and add it to object if it is there
      var gclidValue = readCookie('gclid');
      if (gclidValue != '') {
        // obj['gclid'].push(gclidValue);
        obj['gclid'] = gclidValue;
      }
    }
    updateLinks(url, obj);
  });

  /*
   * +++++++++++++++++
   * General functions
   * +++++++++++++++++
   */

  /*
   * Get all the parameters of an URL as object (array)
   * --------------------------------------------------
   */
  function getAllUrlParams(url) {
    // get query string from url (optional) or window
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
    // variable (object) which stores the parameters
    var obj = {};
    // if query string exists
    if (queryString) {
      // stuff after # is not part of query string, so get rid of it
      queryString = queryString.split('#')[0];
      // split our query string into its component parts
      var arr = queryString.split('&');
      for (var i=0; i<arr.length; i++) {
        // separate the keys and the values
        var a = arr[i].split('=');
        // in case params look like: list[]=thing1&list[]=thing2
        var paramNum = undefined;
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
    // check if cookie already exists -> disabled
    /*if (document.cookie.indexOf(name < 0) {*/
      if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
      }
      else {
        var expires = "";
      }
      document.cookie = name+"="+value+expires+"; path=/";
    /*}*/
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
    createCookie(name,"",-1);
  }

  /*
   * Updates all the links of a website
   * ----------------------------------
   */
  function updateLinks(url, obj) {
    var pathArray = url.split( '/'),
        // pathArray = window.location.href.split( '/'),
        protocol = pathArray[0],
        host = pathArray[2],
        baseUrl = protocol + '//' + host,
        theUrl = url.split('?')[0],
        params = '',
        counter = 0,
        // url = window.location.href.split('?')[0],
        // params = obj,
        // params = window.location.href.split('?')[1],
        noParams = true,
        links = $("a[href^='"+baseUrl+"'], a[href^='/'], a[href^='./'], a[href^='../'], a[href^='#']");
    $.each( obj, function( key, value ) {
      if (counter == 0) {
        params = '?' + key + '=' + value;
        counter = counter + 1;
      }
      else {
        params = params + '&' + key + '=' + value;
        counter = counter + 1;
      }
    });
    // if (url != params) {
    if (theUrl != params) {
      noParams = false;
      links.each(function(){
        console.log('updating the links:');
        var hrefTemp = $(this).attr("href");
        hrefTemp = hrefTemp.split('?')[0];
        console.log(hrefTemp);
        console.log(params);
        $(this).attr("href", hrefTemp + params);
      });
    }
  }

/* =========================
 * !!! End Own functions !!!
 * ========================= */
}(jQuery);
