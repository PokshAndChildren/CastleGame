// @ts-nocheck
export class AutoPause {
  mediaElements : HTMLMediaElement[] = [];
  playing: boolean;

  constructor() {
    this.playing = false;

    // Set the name of the hidden property and the change event for visibility
    var hidden: string | undefined, visibilityChange; 
    if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support 
      hidden = "hidden";
      visibilityChange = "visibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
      hidden = "msHidden";
      visibilityChange = "msvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
      hidden = "webkitHidden";
      visibilityChange = "webkitvisibilitychange";
    }
    
    var self = this;

    // If the page is hidden, pause the video;
    // if the page is shown, play the video
    function handleVisibilityChange() {
      if (document[hidden]) {
        for (const media of 
          self.mediaElements) {
          media.pause();
        }
      } else {
        if (self.playing){
          for (const media of self.mediaElements) {
            media.play();
          }
        }
      }
    }

    // Warn if the browser doesn't support addEventListener or the Page Visibility API
    if (typeof document.addEventListener === "undefined" || hidden === undefined) {
      console.log("This demo requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.");
    } else {
      // Handle page visibility change   
      document.addEventListener(visibilityChange, handleVisibilityChange, false);
    }
  }

  add(media: HTMLMediaElement){
    this.mediaElements.push(media);
    if (this.playing)
      media.play();
    else
      media.pause();
  }

  play(){
    this.playing = true;
    for (const media of this.mediaElements) {
      media.play();
    }
  }

  pause(){
    this.playing = false;
    for (const media of this.mediaElements) {
      media.pause();
    }
  }
}