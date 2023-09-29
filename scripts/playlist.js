import { initializeApp } from "../node_modules/firebase/app";

const config = {
  databaseURL: "radiorethinkprod-default-rtdb.firebaseio.com"
}

initializeApp(config);

const playlistRef = firebase.database().ref('playlistData/wfmu');


/**  
 * Below is copied from WFMU's web player. For reference.
 *
playlistRef.on("value", function(snapshot) {
  var changedPost = snapshot.val();
  
  document.getElementById("on-now-block").innerHTML = changedPost.onNowMarkup;
  document.getElementById("on-next-block").innerHTML = changedPost.onNextMarkup;
  if(changedPost.isLiveDJ != "0" && changedPost.isLiveDJ != ""){
      document.getElementById("liveDJ_header").innerHTML = changedPost.liveDJMarkup;
      $('#liveDJ_header').attr('style','background-color: #362525; margin: 0 0 0 0; padding-bottom: 0em; padding-top: .5em;');
  }
  else {
      document.getElementById("liveDJ_header").innerHTML = "";
      $('#liveDJ_header').attr('style','');
  }
  
  // current track
  if(changedPost.currentShowType.toUpperCase() == "MUSIC") {
    // check to see if the placeholder is available
    if (document.getElementById("current-track-block").innerHTML == "" || document.getElementById("current-track-none")) {
        document.getElementById("current-track-block").innerHTML = '<h6 class="currentTrack"><strong>Current Track:  </strong></h6><div class="large-2 medium-2 small-4 columns" style="padding-left: 0em;"><a href="" target="_self" id="currentTrackLookupBuyLink"><img alt="" class="thumbnail" src="https://dqa4a6x5zonsi.cloudfront.net/img/Album-Cover-Place-Holder-Hollow-Gold.png" id="currentTracklookupImage" style="padding-left: .2em;" /></a></div><div class="large-10 medium-10 small-8 columns"><h5 class="currentTrack">Artist: <medium></span><span id="currentTrackArtist"><i class="fa fa-cog fa-spin" style="color: #f1e194!important"></i></span></medium></h5><h5 class="currentTrack">Track: <medium><span id="currentTrackTrack"><i class="fa fa-cog fa-spin" style="color: #f1e194!important"></i></span></medium></h5><h5 class="currentTrack">Album: <medium><span id="currentTrackAlbum"><i class="fa fa-cog fa-spin" style="color: #f1e194!important"></i></span></medium></h5><h6 class="smallHeader"><em>played at : <span id="currentTrackTimePlayed"><i class="fa fa-cog fa-spin" style="color: #f1e194!important"></i></span></em></h6></div>';
     }
    
      // check to see if the placeholder is available
      if (document.getElementById("playlist-button-block").innerHTML == "") {
         document.getElementById("playlist-button-block").innerHTML = '<div class="row" style="margin-left: 1em; margin-right: 1em;"><button class="hollow button round playlist small" name="play" value="Search" id="showPlaylist">PLAYLIST</button><button class="hollow button round playlist small" name="externalPlaylist" value="externalPlaylist" id="externalPlaylist" style="display: inline"><i class="fa fa-comments"></i><span style="padding-left: .3em;"> COMMENTS</span></button></div><div class="row" style="margin-left: .1em; margin-right: .1em; margin-top: .1em;"><div id="playlist" style="display: none;" class="large-12 columns"><div class="playlist callout"><div id="playlist-block"></div></div></div></div></div><hr />';
       }
       // if station has buy link
        
          // load place holder for artist button button if empty
           if (document.getElementById("artistInfo-button-block").innerHTML == "") {
              document.getElementById("artistInfo-button-block").innerHTML = '<div class="row" style="margin-left: 1em; margin-right: 1em;"><button class="hollow button round playlist small" name="play" value="Search" id="showArtistInfo" style="margin-left: 0em;"><i class="fa fa-info-circle" aria-hidden="true"></i> ARTIST</button><div id="grabTrackContainer" style="display: inline;"></div><button class="hollow button round playlist small" id="shareTrackButton"><i class="fa fa-arrow-up" aria-hidden="true"></i>&nbsp;SHARE</button><div class="row" style="margin-left: 0.1em; margin-right: 0.1em; margin-top: 0.3em;"><div id="grabTrack" style="display: none;"><div class="playlist callout" style="background-color: #000;"><div id="grabTrack-block"><div class="row"><div class="small-12 columns"><h5 style="padding-left: 0.5em; color: #f1e194;"><i class="fa fa-share" aria-hidden="true"></i>&nbsp;Get current track</h5></div></div><div id="grabTrackMarkup"></div><div><h6 id="songlinkAttribution" style="margin-left: 1em; margin-right: .1em; margin-top: .3em; font-size: .7em;" class="smallHeader"><em>powered by:<a href="https://odesli.co" target="_blank">Songlink</a></span></div></div></div><div class="row"><br /></div></div></div><div class="row" style="margin-left: 0.1em; margin-right: 0.1em; margin-top: 0.3em;"><div id="shareTrack" style="display: none;"><div class="playlist callout" style="background-color: #000;"><div id="shareTrack-block"><div class="row"><div class="small-12 columns"><h5 style="padding-left: 0.5em; color: #f1e194;"><i class="fa fa-arrow-up" aria-hidden="true"></i>&nbsp;Share current track</h5></div></div><div class="row"><div class="small-12 columns"><button class="hollow button round playlist small" style="border: 1px solid #fff !important; font-size: 0.8em;"><a href="" id="shareTrackNameLink" target="_blank" style="color: #fff;"><span id="shareTrackArtist" style="font-weight: bold;"></span>- <span id="shareTrackTrack" style="font-weight: bold;"></span></a></button></div></div><div class="row"><div class="small-12 columns"><button class="hollow button round playlist small" style="margin-left: 0em; font-size: 0.8em; border: 1px solid #fff !important; color: #fff !important;"><a href="" id="shareTrack-sms" target="_blank" style="color: #fff !important;"><i class="fa fa-comment" aria-hidden="true"></i>&nbsp;Text</a></button><button class="hollow button round playlist small" style="margin-left: 0em; font-size: 0.8em; border: 1px solid #fff !important; color: #fff !important;"><a href="" id="shareTrack-email" target="_blank" style="color: #fff !important;"><i class="fa fa-envelope" aria-hidden="true"></i>&nbsp;Email</a></button><button class="hollow button round playlist small" style="margin-left: 0em; font-size: 0.8em; border: 1px solid #fff !important; color: #fff !important;"><a href="" id="shareTrack-link" target="_blank" style="color: #fff !important;"><i class="fa fa-link" aria-hidden="true"></i>&nbsp;Link</a></button></div></div></div></div><div class="row"><br /></div></div></div><div class="row" style=""><div id="artistInfo" style="display: none;" class="large-12 columns"><div class="playlist callout"><div id="artistInfo-block"><div class="row"><div class="small-12 columns"><img align="left" id="artistImage" class="small-12 medium-6 large-6 feature-image" style="Margin:0px 20px 8px 0px; border-radius: 20px;"><h3><span id="artistName" style="font-weight: bold"></span></h3><p style="font-size: .75em;"><span id="artistBlurb" style="white-space: pre-wrap;"></span></p> <p style="font-size: .75em;"><a id="artistURL" href="https://www.last.fm/" target="_blank">Read more on LastFM</a> | User-contributed text is available under the Creative Commons By-SA License; additional terms may apply. </p><p style="font-size: .75em;"><i class="fa fa-graduation-cap" aria-hidden="true"></i> Help our web app get smarter. Report incorrect artist information with just one click below.</p><p id="artistCorrectionThankYou" style="display: none;"><span id="artistCorrectionThankYouMessage"></span></p><p><button class="hollow button round playlist small" name="play" value="Search" id="reportIncorrectArtistInfo" data-target="http://www.radiorethink.com" style="margin-top: .5em; margin-left: 0em; color: #000 !important; border: 1px solid #000 !important;"><i class="fa fa-exclamation-circle" aria-hidden="true"></i> Incorrect Artist Info</button></p></div></div></div></div></div></div></div><hr />';
            }
        
       // show the artist button with or without buy button
       if (changedPost.artistBlurb) {
          // if all the elements were wiped out by a non buy / non artist info block
          // if station has buy link
          
              // if all the elements were wiped out by a non artist info block
              if (document.getElementById("artistImage") == null) {
                  document.getElementById("artistInfo-button-block").innerHTML = '<div class="row" style="margin-left: 1em; margin-right: 1em;"><button class="hollow button round playlist small" name="play" value="Search" id="showArtistInfo" style="margin-left: 0em;"><i class="fa fa-info-circle" aria-hidden="true"></i> ARTIST</button><div id="grabTrackContainer" style="display: inline;"></div><button class="hollow button round playlist small" id="shareTrackButton"><i class="fa fa-arrow-up" aria-hidden="true"></i>&nbsp;SHARE</button><div class="row" style="margin-left: 0.1em; margin-right: 0.1em; margin-top: 0.3em;"><div id="grabTrack" style="display: none;"><div class="playlist callout" style="background-color: #000;"><div id="grabTrack-block"><div class="row"><div class="small-12 columns"><h5 style="padding-left: 0.5em; color: #f1e194;"><i class="fa fa-share" aria-hidden="true"></i>&nbsp;Get current track</h5></div></div><div id="grabTrackMarkup"></div><div><h6 id="songlinkAttribution" style="margin-left: 1em; margin-right: .1em; margin-top: .3em; font-size: .7em;" class="smallHeader"><em>powered by:<a href="https://odesli.co" target="_blank">Songlink</a></span></div></div></div><div class="row"><br /></div></div></div><div class="row" style="margin-left: 0.1em; margin-right: 0.1em; margin-top: 0.3em;"><div id="shareTrack" style="display: none;"><div class="playlist callout" style="background-color: #000;"><div id="shareTrack-block"><div class="row"><div class="small-12 columns"><h5 style="padding-left: 0.5em; color: #f1e194;"><i class="fa fa-arrow-up" aria-hidden="true"></i>&nbsp;Share current track</h5></div></div><div class="row"><div class="small-12 columns"><button class="hollow button round playlist small" style="border: 1px solid #fff !important; font-size: 0.8em;"><a href="" id="shareTrackNameLink" target="_blank" style="color: #fff;"><span id="shareTrackArtist" style="font-weight: bold;"></span>- <span id="shareTrackTrack" style="font-weight: bold;"></span></a></button></div></div><div class="row"><div class="small-12 columns"><button class="hollow button round playlist small" style="margin-left: 0em; font-size: 0.8em; border: 1px solid #fff !important; color: #fff !important;"><a href="" id="shareTrack-sms" target="_blank" style="color: #fff !important;"><i class="fa fa-comment" aria-hidden="true"></i>&nbsp;Text</a></button><button class="hollow button round playlist small" style="margin-left: 0em; font-size: 0.8em; border: 1px solid #fff !important; color: #fff !important;"><a href="" id="shareTrack-email" target="_blank" style="color: #fff !important;"><i class="fa fa-envelope" aria-hidden="true"></i>&nbsp;Email</a></button><button class="hollow button round playlist small" style="margin-left: 0em; font-size: 0.8em; border: 1px solid #fff !important; color: #fff !important;"><a href="" id="shareTrack-link" target="_blank" style="color: #fff !important;"><i class="fa fa-link" aria-hidden="true"></i>&nbsp;Link</a></button></div></div></div></div><div class="row"><br /></div></div></div><div class="row" style=""><div id="artistInfo" style="display: none;" class="large-12 columns"><div class="playlist callout"><div id="artistInfo-block"><div class="row"><div class="small-12 columns"><img align="left" id="artistImage" class="small-12 medium-6 large-6 feature-image" style="Margin:0px 20px 8px 0px; border-radius: 20px;"><h3><span id="artistName" style="font-weight: bold"></span></h3><p style="font-size: .75em;"><span id="artistBlurb" style="white-space: pre-wrap;"></span></p> <p style="font-size: .75em;"><a id="artistURL" href="https://www.last.fm/" target="_blank">Read more on LastFM</a> | User-contributed text is available under the Creative Commons By-SA License; additional terms may apply. </p><p style="font-size: .75em;"><i class="fa fa-graduation-cap" aria-hidden="true"></i> Help our web app get smarter. Report incorrect artist information with just one click below.</p><p id="artistCorrectionThankYou" style="display: none;"><span id="artistCorrectionThankYouMessage"></span></p><p><button class="hollow button round playlist small" name="play" value="Search" id="reportIncorrectArtistInfo" data-target="http://www.radiorethink.com" style="margin-top: .5em; margin-left: 0em; color: #000 !important; border: 1px solid #000 !important;"><i class="fa fa-exclamation-circle" aria-hidden="true"></i> Incorrect Artist Info</button></p></div></div></div></div></div></div></div><hr />';
              }
          
          // find the artist blurb report incorrect button
          var link = document.getElementById("reportIncorrectArtistInfo");
          link.setAttribute('data-target', "https://www.radiorethink.com/tuner/queries/reportIncorrectArtistInfo.cfm?id="+changedPost.trackPlaylistID);
        }
       // if the artist info goes blank, kill the button and the artist block
       if (changedPost.artistBlurb == "") {

          // check to see if we can show a buy button without the info block
           if (changedPost.lookupBuyLink) {
               // if station has buy link
               
               // if there is no track
               if (!changedPost.artist && !changedPost.track && !changedPost.album && changedPost.currentShowType.toUpperCase() == "MUSIC") {
                   document.getElementById("artistInfo-button-block").innerHTML = '';
               }
               else {
                   document.getElementById("artistInfo-button-block").innerHTML = '<div class=\"row\" style=\"margin-left: 1em; margin-right: 1em;\"><div id=\"grabTrackContainer\" style=\"display: inline;\"></div><button class=\"hollow button round playlist small\" id=\"shareTrackButton\"><i class=\"fa fa-arrow-up\" aria-hidden=\"true\"></i>&nbsp;SHARE</button><div class=\"row\" style=\"margin-left: 0.1em; margin-right: 0.1em; margin-top: 0.3em;\"><div id=\"grabTrack\" style=\"display: none;\"><div class=\"playlist callout\" style=\"background-color: #000;\"><div id=\"grabTrack-block\"><div class=\"row\"><div class=\"small-12 columns\"><h5 style=\"padding-left: 0.5em; color: #f1e194;\"><i class=\"fa fa-share\" aria-hidden=\"true\"></i>&nbsp;Get current track</h5></div></div><div id=\"grabTrackMarkup\"></div><div><h6 id=\"songlinkAttribution\" style=\"margin-left: 1em; margin-right: .1em; margin-top: .3em; font-size: .7em;\" class=\"smallHeader\"><em>powered by:<a href=\"https://odesli.co\" target=\"_blank\">Songlink</a></span></div></div></div><div class=\"row\"><br /></div></div></div><div class=\"row\" style=\"margin-left: 0.1em; margin-right: 0.1em; margin-top: 0.3em;\"><div id=\"shareTrack\" style=\"display: none;\"><div class=\"playlist callout\" style=\"background-color: #000;\"><div id=\"shareTrack-block\"><div class=\"row\"><div class=\"small-12 columns\"><h5 style=\"padding-left: 0.5em; color: #f1e194;\"><i class=\"fa fa-arrow-up\" aria-hidden=\"true\"></i>&nbsp;Share current track</h5></div></div><div class=\"row\"><div class=\"small-12 columns\"><button class=\"hollow button round playlist small\" style=\"border: 1px solid #fff !important; font-size: 0.8em;\"><a href=\"\" id=\"shareTrackNameLink\" target=\"_blank\" style=\"color: #fff;\"><span id=\"shareTrackArtist\" style=\"font-weight: bold;\"></span>- <span id=\"shareTrackTrack\" style=\"font-weight: bold;\"></span></a></button></div></div><div class=\"row\"><div class=\"small-12 columns\"><button class=\"hollow button round playlist small\" style=\"margin-left: 0em; font-size: 0.8em; border: 1px solid #fff !important; color: #fff !important;\"><a href=\"\" id=\"shareTrack-sms\" target=\"_blank\" style=\"color: #fff !important;\"><i class=\"fa fa-comment\" aria-hidden=\"true\"></i>&nbsp;Text</a></button><button class=\"hollow button round playlist small\" style=\"margin-left: 0em; font-size: 0.8em; border: 1px solid #fff !important; color: #fff !important;\"><a href=\"\" id=\"shareTrack-email\" target=\"_blank\" style=\"color: #fff !important;\"><i class=\"fa fa-envelope\" aria-hidden=\"true\"></i>&nbsp;Email</a></button><button class=\"hollow button round playlist small\" style=\"margin-left: 0em; font-size: 0.8em; border: 1px solid #fff !important; color: #fff !important;\"><a href=\"\" id=\"shareTrack-link\" target=\"_blank\" style=\"color: #fff !important;\"><i class=\"fa fa-link\" aria-hidden=\"true\"></i>&nbsp;Link</a></button></div></div></div></div><div class=\"row\"><br /></div></div></div></div><hr />';
               }
               
           }
           else {
               // if there is no track
              if (!changedPost.artist && !changedPost.track && !changedPost.album && changedPost.currentShowType.toUpperCase() == "MUSIC") {
                  document.getElementById("artistInfo-button-block").innerHTML = '';
              }
              else {
                  document.getElementById("artistInfo-button-block").innerHTML = '<div class=\"row\" style=\"margin-left: 1em; margin-right: 1em;\"><div id=\"grabTrackContainer\" style=\"display: inline;\"></div><button class=\"hollow button round playlist small\" id=\"shareTrackButton\"><i class=\"fa fa-arrow-up\" aria-hidden=\"true\"></i>&nbsp;SHARE</button><div class=\"row\" style=\"margin-left: 0.1em; margin-right: 0.1em; margin-top: 0.3em;\"><div id=\"grabTrack\" style=\"display: none;\"><div class=\"playlist callout\" style=\"background-color: #000;\"><div id=\"grabTrack-block\"><div class=\"row\"><div class=\"small-12 columns\"><h5 style=\"padding-left: 0.5em; color: #f1e194;\"><i class=\"fa fa-share\" aria-hidden=\"true\"></i>&nbsp;Get current track</h5></div></div><div id=\"grabTrackMarkup\"></div><div><h6 id=\"songlinkAttribution\" style=\"margin-left: 1em; margin-right: .1em; margin-top: .3em; font-size: .7em;\" class=\"smallHeader\"><em>powered by:<a href=\"https://odesli.co\" target=\"_blank\">Songlink</a></span></div></div></div><div class=\"row\"><br /></div></div></div><div class=\"row\" style=\"margin-left: 0.1em; margin-right: 0.1em; margin-top: 0.3em;\"><div id=\"shareTrack\" style=\"display: none;\"><div class=\"playlist callout\" style=\"background-color: #000;\"><div id=\"shareTrack-block\"><div class=\"row\"><div class=\"small-12 columns\"><h5 style=\"padding-left: 0.5em; color: #f1e194;\"><i class=\"fa fa-arrow-up\" aria-hidden=\"true\"></i>&nbsp;Share current track</h5></div></div><div class=\"row\"><div class=\"small-12 columns\"><button class=\"hollow button round playlist small\" style=\"border: 1px solid #fff !important; font-size: 0.8em;\"><a href=\"\" id=\"shareTrackNameLink\" target=\"_blank\" style=\"color: #fff;\"><span id=\"shareTrackArtist\" style=\"font-weight: bold;\"></span>- <span id=\"shareTrackTrack\" style=\"font-weight: bold;\"></span></a></button></div></div><div class=\"row\"><div class=\"small-12 columns\"><button class=\"hollow button round playlist small\" style=\"margin-left: 0em; font-size: 0.8em; border: 1px solid #fff !important; color: #fff !important;\"><a href=\"\" id=\"shareTrack-sms\" target=\"_blank\" style=\"color: #fff !important;\"><i class=\"fa fa-comment\" aria-hidden=\"true\"></i>&nbsp;Text</a></button><button class=\"hollow button round playlist small\" style=\"margin-left: 0em; font-size: 0.8em; border: 1px solid #fff !important; color: #fff !important;\"><a href=\"\" id=\"shareTrack-email\" target=\"_blank\" style=\"color: #fff !important;\"><i class=\"fa fa-envelope\" aria-hidden=\"true\"></i>&nbsp;Email</a></button><button class=\"hollow button round playlist small\" style=\"margin-left: 0em; font-size: 0.8em; border: 1px solid #fff !important; color: #fff !important;\"><a href=\"\" id=\"shareTrack-link\" target=\"_blank\" style=\"color: #fff !important;\"><i class=\"fa fa-link\" aria-hidden=\"true\"></i>&nbsp;Link</a></button></div></div></div></div><div class=\"row\"><br /></div></div></div></div><hr />';
              }

           }
       }
       
           var externalPlaylist = document.getElementById("externalPlaylist");
           var externalPlaylistURL = 'http://www.wfmu.org/playlists/shows/[playlistID]';
           if (changedPost.playlistID != "0") {
               externalPlaylistURL = externalPlaylistURL.replace("[playlistID]", changedPost.playlistID);
               externalPlaylist.setAttribute('data-target', externalPlaylistURL);
               externalPlaylist.style.display = 'inline';
            }
            else {
               externalPlaylist.style.display = 'none';
           }
       
    
    document.getElementById("currentTrackArtist").innerHTML = changedPost.artist;
    document.getElementById("currentTrackTrack").innerHTML = changedPost.track;
    document.getElementById("currentTrackAlbum").innerHTML = changedPost.album;
    document.getElementById("currentTrackTimePlayed").innerHTML = moment(changedPost.timeStamp).format("h:mm A") + " ET";
    if (document.getElementById("shareTrackArtist") != null) {
        document.getElementById("shareTrackArtist").innerHTML = changedPost.artist;
        document.getElementById("shareTrackTrack").innerHTML = changedPost.track;
        document.getElementById("shareTrack-sms").href = "sms:&body=https://www.radiorethink.com/tuner/share/?t="+changedPost.trackPlaylistID;
        document.getElementById("shareTrack-link").href = 'https://www.radiorethink.com/tuner/share/?t=' + changedPost.trackPlaylistID;
        document.getElementById("shareTrack-email").href = 'https://www.radiorethink.com/tuner/share/?t=' + changedPost.trackPlaylistID;
        document.getElementById("shareTrackNameLink").href = 'https://www.radiorethink.com/tuner/share/?t=' + changedPost.trackPlaylistID;
    }
    
    // grab track button functionality
    // check to see if the buy button is available
      if (changedPost.externalLinksMarkup) {
          // if the external link markup is not empty
          // find the grabTrackContainer
          if (document.getElementById('grabTrackContainer') !== null){
            document.getElementById("grabTrackContainer").innerHTML = '<button class="hollow button round playlist small" id="grabTrackButton"><i class="fa fa-share" aria-hidden="true"></i> GET</button>';
            document.getElementById("grabTrackMarkup").innerHTML = changedPost.externalLinksMarkup;
          }
      } 
      else {
        document.getElementById("grabTrackContainer").innerHTML = '';
        document.getElementById("grabTrackMarkup").innerHTML = '';
      }
    
    if(changedPost.lookupImage){
     document.getElementById("currentTracklookupImage").src = changedPost.lookupImage;
     }
     else {
     document.getElementById("currentTracklookupImage").src = "https://dqa4a6x5zonsi.cloudfront.net/img/Album-Cover-Place-Holder-Hollow-Gold.png";
     };
     if(changedPost.lookupBuyLink){
     document.getElementById("currentTrackLookupBuyLink").href = changedPost.lookupBuyLink;
     document.getElementById("currentTrackLookupBuyLink").target = "_blank";
     }
     else {
     document.getElementById("currentTrackLookupBuyLink").href = "";
     document.getElementById("currentTrackLookupBuyLink").target = "_self";
     };
     if(changedPost.artistBlurb){
         var image = document.getElementById("artistImage");
         image.setAttribute('data-src', changedPost.artistImage);
         showArtistImage()
         document.getElementById("artistName").innerHTML = changedPost.artist;
       
         document.getElementById("artistURL").href = changedPost.artistURL;
     }
    
    }
    else {
      document.getElementById("current-track-block").innerHTML = "";
      document.getElementById("playlist-button-block").innerHTML = "";
    }
    // if there is no track
    if (!changedPost.artist && !changedPost.track && !changedPost.album && changedPost.currentShowType.toUpperCase() == "MUSIC") {
      document.getElementById("current-track-block").innerHTML = '<div id="current-track-none"><h6 class="currentTrack"><strong>Current Track: </strong></h6><h6 class="smallHeader">Sorry... no playlist updates in over 15 minutes, waiting for the DJ to update what they\'ve been playing.</h6> </div>';
    }
    
  }  )
  // only populate playlist if the user requests it
  function popuplatePlaylist(isHidden){
      if(isHidden) {
          var playlistMarkupRef = firebase.database().ref('playlistData/wfmu/playListDataMarkup');

          playlistMarkupRef.on("value", function(snapshot) {
              var changedPlaylistMarkup = snapshot.val();
              document.getElementById("playlist-block").innerHTML = changedPlaylistMarkup;
              showPlaylistImages();
          })
      }
  }
  // only populate playlist if the user requests it
  function populateArtistBlurb(isHidden){
      if(isHidden) {
      var artistBlurbMarkupRef = firebase.database().ref('playlistData/wfmu/artistBlurb');

          artistBlurbMarkupRef.on("value", function(snapshot) {
              var changedArtistBlurbMarkup = snapshot.val();
              document.getElementById("artistBlurb").innerHTML = changedArtistBlurbMarkup;
          })
      }
  }
  // underwriting
  var underwritingRef = firebase.database().ref('underwriting/wfmu');

  underwritingRef.on("value", function(snapshot) {
      var underwritingRef = snapshot.val();
      
      document.getElementById("underwriting_header").innerHTML = underwritingRef.visual.header.visualMarkup;
      if (underwritingRef.visual.header.visualMarkup) {
        $('#underwriting_header').attr('style','background-color: #dcdcdc; margin: 0 0 0 0; padding-bottom: 0em; padding-top: .5em;');
        jQuery.ajax({
            url: 'https://www.radiorethink.com/tuner/queries/setVisualUnderwriting.cfm?stationCode=wfmu&timeZoneOffset=1&position=header' + '&assetID=' + underwritingRef.visual.header.visualAssetID,
         success: function() {
         },
         error: function() {
         }
        });
      }
      else {
        $('#underwriting_header').attr('style','');
      }
      
      
      document.getElementById("underwriting_middle").innerHTML = underwritingRef.visual.middle.visualMarkup;
      if (underwritingRef.visual.middle.visualMarkup) {
          $('#underwriting_middle').attr('style','background-color: #dcdcdc; margin: 0 0 0 0; padding-bottom: 0em; padding-top: .5em; padding-left: 1em; padding-right: 1em;');
          jQuery.ajax({
          url: 'https://www.radiorethink.com/tuner/queries/setVisualUnderwriting.cfm?stationCode=wfmu&timeZoneOffset=1&position=middle' + '&assetID=' + underwritingRef.visual.middle.visualAssetID,
          success: function() {
          },
          error: function() {
          }
        });
      }
      else {
      $('#underwriting_middle').attr('style','');
      }
      
      
      document.getElementById("audioAssetUrl").value = underwritingRef.audio.audioAssetUrl;
      document.getElementById("audioAssetID").value = underwritingRef.audio.audioAssetID;
      
      
    })

    var messages = firebase.database().ref('messages/wfmu');

    messages.on("value", function(snapshot) {
    var changed_messages = snapshot.val();
    if (changed_messages) {
        document.getElementById("fundraiserBlock").innerHTML = changed_messages.fundraiser.fundraiserMarkup;
        document.getElementById("alertBlock").innerHTML = changed_messages.alert.alertMarkup;
    }
    }) 
    */
