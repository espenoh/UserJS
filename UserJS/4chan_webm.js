// ==UserScript==
// @name 4chan WebM expander
// @version 1.1
// @author espenoh (espen@zawiarr.com)
// @include http://*.4chan.org/*
// @include https://*.4chan.org/*
// @ujs:published 2014-04-07 18:12
// @ujs:modified  2014-04-07 19:04
// ==/UserScript==

(function () {
  var timerRunning = false; //True when a new check has been scheduled
  var autoUpdating = false; //True if the 4chan ThreadUpdater extension is running
  var lastUpdated = 0;      //Timestamp of the last update if above flag true.
  
  if (location.hostname.indexOf('4chan.org') != -1) {
    window.addEventListener('DOMContentLoaded', init, false);
  }
  
  
  function init(){
    if ("enabled" in ThreadUpdater) { //We check the 4chan API if the page is autoupdating
      autoUpdating = true;
      lastUpdated = ThreadUpdater.lastUpdated;
    }
    
    make_webm();
    window.addEventListener ('DOMNodeInserted', schedule_check, false);
  }

  //Crawl the DOM and add [Expand WebM] links to new posts in the thread.
  function make_webm() {
    posts = document.getElementsByClassName('postContainer');
    
    for (i in posts) {
      if (!isNaN(i) && posts[i] && !("WebmExp" in posts[i]) ) {
        filetext = posts[i].getElementsByClassName('fileText')[0];
        if (!filetext) continue;
        filename = filetext.getElementsByTagName('span')[0];
        
        if (filename && filename.innerText.indexOf(".webm") != -1) {
          url = filetext.getElementsByTagName('a')[0].href;
          idname = "webm_cont_" + i; 
          
          vf1 = document.createElement('div');
          etext = document.createElement('a');
          etext.innerText = "[ Expand WebM ]";
          etext.setAttribute('href',"javascript:void(0)");
          etext.setAttribute('onclick', "javascript: webm_showhide('"+ idname +"', '"+ url +"');" );
          vf1.appendChild(etext);
          
          vf2 = document.createElement('div');
          vf2.id = idname;
          vf2.style = "display: none;";
          vid = document.createElement('video');
          vid.controls = true;
          vid.loop = true;
          vid.preload = "auto";
          vid.setAttribute('onclick', "javascript: this.paused?this.play():this.pause();");
          
          vf2.appendChild(vid);
          vf1.appendChild(vf2);
          
          p = posts[i].getElementsByClassName('post')[0];
          pmsg = p.getElementsByClassName('postMessage')[0];
          p.insertBefore(vf1, pmsg);
          
          posts[i].WebmExp = true; //We mark the node as updated.
        }
      }
    }
    
    timerRunning = false; //Reset timer
  }
  
  
  //DOM update fires for every single node modified, so we discard all the extra events by delaying the update.
  function schedule_check(){
    if (timerRunning == false) {
      if (autoUpdating){
        if (lastUpdated == ThreadUpdater.lastUpdated) return; // We don't schedule if no new entries are added.
        lastUpdated = ThreadUpdater.lastUpdated;
      }
      
      timerRunning = true;
      setTimeout(make_webm, 500); //High value here is a safeguard for BIG threads (could prob. be smaller).
    }
  }

})();


//Code for the [Expand WebM] link.
function webm_showhide(idname, url){
  e = document.getElementById(idname);
  if (e) {
    vid = e.getElementsByTagName('video')[0];  
    if (e.style.length != 0) {
      if (vid && vid.src.length == 0) vid.src = url;
      e.style = "";
    } else {
      if (vid) vid.src = "";
      e.style = "display: none;"; 
    }
  }
}