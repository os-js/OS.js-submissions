const IFrameApplication = OSjs.require('helpers/iframe-application');

class ApplicationMap extends IFrameApplication {
  constructor(args, metadata) {
    super('ApplicationMap', args, metadata, {
      src: 'data/index.html',
      focus: function(frame, win) {
        win.postMessage('resume', window.location.href);
      },
      blur: function(frame, win) {
        win.postMessage('pause', window.location.href);
      },
      title: metadata.name,
      icon: metadata.icon,
      width: 640,
      height: 400,
      allow_resize: true,
      allow_restore: true,
      allow_maximize: true
    });
  }
}

OSjs.Applications.ApplicationMap = ApplicationMap;
