(function(Application, GUI, Dialogs, Utils, API, VFS) {

  var ApplicationMap = function(args, metadata) {
    Application.apply(this, ['ApplicationMap', args, metadata, {
      src: 'data/index.html',
      title: metadata.name,
      icon: metadata.icon,
      width: 640,
      height: 400,
      allow_resize: true,
      allow_restore: true,
      allow_maximize: true
    }]);
  };

  ApplicationMap.prototype = Object.create(Application.prototype);

  OSjs.Applications = OSjs.Applications || {};
  OSjs.Applications.ApplicationMap = OSjs.Applications.ApplicationMap || {};
  OSjs.Applications.ApplicationMap.Class = ApplicationMap;

})(OSjs.Helpers.IFrameApplication, OSjs.GUI, OSjs.Dialogs, OSjs.Utils, OSjs.API, OSjs.VFS);
