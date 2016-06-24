(function(Application, GUI, Dialogs, Utils, API, VFS) {

  var ApplicationZMT = function(args, metadata) {
    Application.apply(this, ['ApplicationZMT', args, metadata, {
      src: 'data/index.html',
      title: metadata.name,
      icon: metadata.icon,
      width: 320,
      height: 480,
      allow_resize: true,
      allow_restore: true,
      allow_maximize: true
    }]);
  };

  ApplicationZMT.prototype = Object.create(Application.prototype);

  OSjs.Applications = OSjs.Applications || {};
  OSjs.Applications.ApplicationZMT = OSjs.Applications.ApplicationZMT || {};
  OSjs.Applications.ApplicationZMT.Class = ApplicationZMT;

})(OSjs.Helpers.IFrameApplication, OSjs.GUI, OSjs.Dialogs, OSjs.Utils, OSjs.API, OSjs.VFS);
