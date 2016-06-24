(function(Application, GUI, Dialogs, Utils, API, VFS) {

  var ApplicationMR = function(args, metadata) {
    Application.apply(this, ['ApplicationMR', args, metadata, {
      src: 'data/index.html',
      title: metadata.name,
      icon: metadata.icon,
      width: 655,
      height: 550,
      allow_resize: false,
      allow_restore: false,
      allow_maximize: false
    }]);
  };

  ApplicationMR.prototype = Object.create(Application.prototype);

  OSjs.Applications = OSjs.Applications || {};
  OSjs.Applications.ApplicationMR = OSjs.Applications.ApplicationMR || {};
  OSjs.Applications.ApplicationMR.Class = ApplicationMR;

})(OSjs.Helpers.IFrameApplication, OSjs.GUI, OSjs.Dialogs, OSjs.Utils, OSjs.API, OSjs.VFS);
