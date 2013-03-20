// client.js
//
// Overall client code

/*global require: true */
require(['jquery', 'appnet', 'js/Stream', 'bootstrap'],
function ($, appnet, Stream) {
  'use strict';

  var unified;

  function initialize()
  {
    appnet.init('weftToken', 'weftPrevUrl');
    if (! appnet.isLogged())
    {
      appnet.authorize();
    }
    unified = new Stream('unified', $('#main-content'));
    $('#logout-button').click(clickLogout);
  }

  function clickLogout(event)
  {
    event.preventDefault();
    appnet.logout();
    return false;
  }

  $(document).ready(initialize);
});
