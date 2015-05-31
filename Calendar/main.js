(function(Application, GUI, Dialogs, Utils, API, VFS) {

  var ApplicationCalendar = function(args, metadata) {
    Application.apply(this, ['ApplicationCalendar', args, metadata, {
      src: 'data/index.html',
      title: metadata.name,
      icon: metadata.icon,
      width: 230,
      height: 236,
      allow_resize: false,
      allow_restore: false,
      allow_maximize: false
    }]);
  };

  ApplicationCalendar.prototype = Object.create(Application.prototype);

  OSjs.Applications = OSjs.Applications || {};
  OSjs.Applications.ApplicationCalendar = OSjs.Applications.ApplicationCalendar || {};
  OSjs.Applications.ApplicationCalendar.Class = ApplicationCalendar;

})(OSjs.Helpers.IFrameApplication, OSjs.GUI, OSjs.Dialogs, OSjs.Utils, OSjs.API, OSjs.VFS);
