module.exports = {
  main_dev: {
    options: {
      style: 'expanded'
    },
    files: {
      '<%= pubCssPath %>/main.css': '<%= cssPath %>/main/main.scss'
    }
  },
  vendor_dev: {
    options: {
      style: 'expanded'
    },
    files: {
      '<%= pubCssPath %>/vendor.css': '<%= cssPath %>/vendor/vendor.scss'
    }
  },
  main_dist: {
    options: {
      style: 'compressed'
    },
    files: {
      '<%= pubCssPath %>/main.min.css': '<%= pubCssPath %>/main.css'
    }
  },
  vendor_dist: {
    options: {
      style: 'compressed'
    },
    files: {
      '<%= pubCssPath %>/vendor.min.css': '<%= pubCssPath %>/vendor.css'
    }
  }
};