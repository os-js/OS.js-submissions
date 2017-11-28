const IFrameApplication = OSjs.require('helpers/iframe-application');

class ApplicationCalendar extends IFrameApplication {
  constructor(args, metadata) {
    super('ApplicationCalendar', args, metadata, {
      src: 'data/index.html',
      focus: function(frame, win) {
        win.postMessage('resume', window.location.href);
      },
      blur: function(frame, win) {
        win.postMessage('pause', window.location.href);
      },
      title: metadata.name,
      icon: metadata.icon,
      width: 230,
      height: 236,
      allow_resize: false,
      allow_restore: false,
      allow_maximize: false
    });
  }
}

OSjs.Applications.ApplicationCalendar = ApplicationCalendar;
