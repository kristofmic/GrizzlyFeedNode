module.exports = {
  index: {             // Link to minified js/css in index html.
    src: 'views/layouts/_footer.ejs',
    options: {
      hash: /(\.[a-f0-9]{8})/,
      patterns: {
        'jsMain': /main.min.[a-z0-9.]*\js/,
        'jsComponents': /components.min.[a-z0-9.]*\js/
      },
    },
  },
};