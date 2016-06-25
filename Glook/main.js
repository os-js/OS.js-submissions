(function(Application, GUI, Dialogs, Utils, API, VFS) {

  var ApplicationGL = function(args, metadata) {
    Application.apply(this, ['ApplicationGL', args, metadata, {
      src: 'data/index.html',
      title: metadata.name,
      icon: metadata.icon,
      width: 640,
      height: 480,
      allow_resize: false,
      allow_restore: false,
      allow_maximize: false
    }]);
  };

  ApplicationGL.prototype = Object.create(Application.prototype);

  OSjs.Applications = OSjs.Applications || {};
  OSjs.Applications.ApplicationGL = OSjs.Applications.ApplicationGL || {};
  OSjs.Applications.ApplicationGL.Class = ApplicationGL;

})(OSjs.Helpers.IFrameApplication, OSjs.GUI, OSjs.Dialogs, OSjs.Utils, OSjs.API, OSjs.VFS);
