(function(Application, GUI, Dialogs, Utils, API, VFS) {

  var ApplicationCS = function(args, metadata) {
    Application.apply(this, ['ApplicationCS', args, metadata, {
      src: 'data/index.html',
      title: metadata.name,
      icon: metadata.icon,
      width: 280,
      height: 270,
      allow_resize: false,
      allow_restore: false,
      allow_maximize: false
    }]);
  };

  ApplicationCS.prototype = Object.create(Application.prototype);

  OSjs.Applications = OSjs.Applications || {};
  OSjs.Applications.ApplicationCS = OSjs.Applications.ApplicationCS || {};
  OSjs.Applications.ApplicationCS.Class = ApplicationCS;

})(OSjs.Helpers.IFrameApplication, OSjs.GUI, OSjs.Dialogs, OSjs.Utils, OSjs.API, OSjs.VFS);
