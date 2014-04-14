// ==UserScript==
// @name Twitter icon replacement
// @version 1.0
// @author espenoh (espen@zawiarr.com)
// @include http://twitter.com/*
// @include https://twitter.com/*
// @include http://www.twitter.com/*
// @include https://www.twitter.com/*
// @ujs:published 2012-12-06 22:57
// @ujs:modified  2012-12-06 22:57
// ==/UserScript==

(function () {

  if (location.hostname.indexOf('twitter.com') != -1) {
    window.addEventListener('DOMContentLoaded', twiticon, false );
  }
  
  var org_icon = '';
  var prv_icon = '';
  var cur_icon = '';
  
  function twiticon() {
    $(function() {
      org_icon = $('link[rel$=icon]').attr("href");
      cur_icon = prv_icon = org_icon; // Reset checks 
      setInterval(check, 10000); // 10 seconds
    });
  }
  
  function check() {
    var new_tweets = $(".new-tweets-bar.js-new-tweets-bar");
    if (new_tweets) {
      var count = new_tweets.attr("data-item-count");
      if (count != undefined) {
        // REMEMBER TO CHANGE THE URL TO WHERE YOUR ICON.PHP IS HOSTED!
        cur_icon = "icon.php?nr=" + count; 
        
      } else {
        cur_icon = "icon.php";
        
      }
      
      if (cur_icon != prv_icon) {
        prv_icon = cur_icon;
        set_icon(cur_icon);
      }
      
    }
  }
  
  
  function set_icon(iconurl) {
    $.ajax({
        url: iconurl,
        dataType: "text"
        
      }).done(function( icostr ) {
        $('link[rel$=icon]').replaceWith('');
        $('<link rel="shortcut icon" type="image/x-icon"/>')
          .appendTo('head')
          .attr('href', icostr);
      
    });
  }

})();