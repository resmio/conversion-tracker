# conversion-tracker
### GCLID conversion tracking
Updates page internal links according to given URL parameters when visiting the page and 
sets cookies for those parameters accordingly.

## Integration
* just copy this script and include it before the closing ```</body>``` tag on your webpage:
```
 <script>
      (function() {
        // https://github.com/resmio/conversion-tracker
        var script = document.createElement('script');
        script.async = true;
        script.src = 'https://static.resmio.com/static/conversion-tracker/resmio-conversion.js';
        var entry = document.getElementsByTagName('script')[0];
        entry.parentNode.insertBefore(script, entry);
      })();
 </script>
```
