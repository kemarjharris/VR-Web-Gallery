const multipleEntry = require('react-app-rewire-multiple-entry')([
  {
    entry: 'src/gallery.js',
    template: 'public/gallery.html',
    outPath: '/gallery'
  }

]);
 
module.exports = {
  webpack: function(config, env) {
    multipleEntry.addMultiEntry(config);
    return config;
  }
};
