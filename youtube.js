/*
 * Simple wrapper for YT <iframe> embedded API
 * Iframe API shows an HTML5 player for mobile devices
 * that do not support Flash
 */
(function(window, undefined) {
    //TODO: Replace 'myAppVar' with your app namespace
    var myAppVar = window.myAppVar || {};
    
    // Store reference to instances of videos
    myAppVar.videos = {};

    myAppVar.Video = function(opts, onPlayerReady, onPlayerStateChange) {
      this.element = opts.element; 
      this.height = opts.height;
      this.width = opts.width;
      this.videoId = opts.videoId || '';

      // Pass in meaningful callbacks as static instance methods, 
      // otherwise falls to noop func
      
      if (onPlayerReady) {
        this.onPlayerReady = onPlayerReady;
      }
      
      if (onPlayerStateChange) {
        this.onPlayerStateChange = onPlayerStateChange;
      }

      // Player variable values and demo here:
      // https://developers.google.com/youtube/youtube_player_demo
      this.playerVars = {
        autohide: 0
      , autoplay: 0
      , controls: 0
      , enablejsapi: 1
      , iv_load_policy: 3 // video annotations 1 default, 2 on, 3 off
      , loop: 0
      , modestbranding: 1
      , origin: 'http://localhost:8080/'
      , rel: 0
      , showinfo: 0
      , start: opts.start || 0
      , wmode: 'transparent'
      , html5: 1
      };

      // Kick it off!
      this.init();
    };

    myAppVar.Video.prototype.constructor = window.myAppVar.Video;

    myAppVar.Video.prototype = {
      init: function() {
        this.setUpPlayer();
        this.createGlobalFunctions();
      }
    , setUpPlayer: function() {
        var script
          , firstScriptTag;

        script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';

        firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(script, firstScriptTag);
      }
    , createGlobalFunctions: function() {
        var that = this;
        // We have to create a function in the global namespace
        // for the embedded player evoke. Using an alias, we can
        // keep our player methods encapsulated in the clss
        window.onYouTubeIframeAPIReady = function() {
          return that.createPlayerInstance.call(that);
        };
      }
    , createPlayerInstance: function() {
        var that = this;
        this.player = new window.YT.Player(this.element, {
            height: this.height
          , width: this.width
          , videoId: this.videoId
          , playerVars: this.playerVars
          , events: {
              'onReady': function() {
                that.onPlayerReady();
              }
            , 'onStateChange': function() {
                that.onPlayerStateChange();
              }
            }
        });
      }
    , onPlayerReady: function(evt) { /* noop */ }
    , onPlayerStateChange: function(evt) { /* noop */ }
    };

}(window, undefined));
