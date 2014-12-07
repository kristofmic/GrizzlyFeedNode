module.exports = {
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