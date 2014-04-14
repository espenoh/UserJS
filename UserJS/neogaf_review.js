// ==UserScript==
// @name NeoGAF Review
// @version 1.1
// @author espenoh (espen@zawiarr.com)
// @include http://neogaf.com/*
// @include http://www.neogaf.com/*
// @ujs:published 2010-10-23 00:25
// @ujs:modified  2010-10-30 15:24
// ==/UserScript==

//Used to prefix all entries in the local storage
var STORAGE_PREFIX = "GR_";

if (localStorage) { //Script requires localStorage to work
  window.addEventListener('DOMContentLoaded', GAFParser, false );
}


function GAFParser(){
  if (location.hostname.indexOf('neogaf.com') != -1)
  {
    //If we reach this we're in a thread:
    if (location.href.match(/\/forum\/showthread.php/))
    {
      var n_count = {}; //Nick counter
      var nicks = document.getElementsByClassName("bigusername");
      
      for (i in nicks)
      {
        if (nicks[i].innerText != undefined) {
          var nick = nicks[i].innerText;
          
          //We increment n_count[nick] with 1 for each post by the same user.
          //The count is used to id multiple t_box elements for the same user.
          n_count[nick] = (n_count[nick] != undefined)? n_count[nick] + 1: 0;
          
          //Main text box (added under user's avatar)
          var tbox = document.createElement('textarea');
          tbox.setAttribute("id", "tbox_" + nick + "_" + n_count[nick]);
          tbox.setAttribute("rows", "3");
          tbox.setAttribute("cols", "16");
          tbox.setAttribute("style", "border: 1px solid grey;" + 
            "margin-top: 6px; padding: 1px; background:transparent;");
          tbox.innerText = getUserInfo(nick);
          
          nicks[i].parentNode.parentNode.appendChild(tbox);
          
          //Save button (added to user's "userbar")
          var userbar = nicks[i].parentNode.parentNode.
                            getElementsByClassName("smallfont")[2];
          
          var link = document.createElement('a');
          link.setAttribute("href", 
            'javascript: setUserInfo("' +nick+ '",' +n_count[nick]+ ');');
          link.innerText = "Save";
          
          userbar.appendChild(document.createTextNode("| "));
          userbar.appendChild(link);
        }
      }
    }
  }
}


function getUserInfo(nick){
  var msg = localStorage.getItem(STORAGE_PREFIX + nick);
  return (msg != null)? msg : "";
}


function setUserInfo(nick, id){
  var tbox = document.getElementById("tbox_" + nick + "_" + id);
  
  if (tbox.innerText == "") {
    localStorage.removeItem(STORAGE_PREFIX + nick);
  } else {
    localStorage.setItem(STORAGE_PREFIX + nick, tbox.innerText);
  }
}