module.exports = {
  cssVendor: {
    expand: true,
    src: [
      '<%= componentsPath %>/bootstrap/dist/css/bootstrap.css',
      '<%= componentsPath %>/fontawesome/css/font-awesome.css',
      '<%= componentsPath %>/chSnackbar/dist/snackbar.css'
    ],
    dest: '<%= cssPath %>/vendor/',
    flatten: true,
    filter: 'isFile',
    rename: function(dest, src) {
      console.log(dest, src);
      return dest + src.replace('.css', '.scss');
    }
  },
  images: {
    expand: true,
    src: [
      '<%= imagePath %>/**/*.png',
      '<%= imagePath %>/**/*.jpg',
      '<%= imagePath %>/**/*.ico',
    ],
    dest: '<%= pubImagePath %>/',
    flatten: true,
    filter: 'isFile'
  },
  fonts: {
    expand: true,
    src: [
      '<%= componentsPath %>/fontawesome/fonts/*',
    ],
    dest: '<%= pubFontPath %>/',
    flatten: true,
    filter: 'isFile'
  }
};