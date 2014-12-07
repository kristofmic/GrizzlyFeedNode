module.exports = {
  js: {
    src: 'views/layouts/_footer.ejs',
    options: {
      hash: /(\.[a-f0-9]{8})/,
      patterns: {
        'jsMain': /main.min.[a-z0-9.]*js/,
        'jsComponents': /components.min.[a-z0-9.]*js/
      },
    },
  },
  css: {
    src: ['views/layouts/_header.ejs', '<%= pubCssPath %>/*.min.*.css'],
    options: {
      hash: /(\.[a-f0-9]{8})/,
      patterns: {
        'cssMain': /main.min.[a-z0-9.]*css/,
        'cssVendor': /vendor.min.[a-z0-9.]*css/
      },
    },
  }
};