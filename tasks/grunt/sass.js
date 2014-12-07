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
      '<%= pubCssPath %>/vendor.css': '<%= cssPath %>/vendor.scss'
    }
  },
  main_dist: {
    options: {
      style: 'compressed',
      sourcemap: 'none'
    },
    files: {
      '<%= pubCssPath %>/main.min.css': '<%= pubCssPath %>/main.css'
    }
  },
  vendor_dist: {
    options: {
      style: 'compressed',
      sourcemap: 'none'
    },
    files: {
      '<%= pubCssPath %>/vendor.min.css': '<%= pubCssPath %>/vendor.css'
    }
  }
};