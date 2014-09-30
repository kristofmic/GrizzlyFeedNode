var
  sanitizer = require('sanitize-html'),
  filters,
  config,
  previousTag;

filters = {
  'a': filterAnchor,
  'img': filterImg
};

config = {
  allowedTags: ['iframe', 'a', 'span', 'b', 'em', 'img', 'p', 'blockquote', 'text', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li'],
  allowedAttributes: {
    'a': ['href', 'target', 'rel'],
    'img': ['alt', 'src', 'height', 'width'],
    'iframe': ['src']
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  transformTags: {
    'h1': 'b',
    'h2': 'b',
    'h3': 'b',
    'h4': 'b',
    'h5': 'b',
    'h6': 'b',
    'img': transformImg,
    'a': transformAnchor
  },
  exclusiveFilter: filter
};

module.exports = {
  sanitizeHtml: sanitizeHtml,
  sanitizeText: sanitizeText
};

function sanitizeText(content) {
  var
    innerText = '';

  sanitizer(content, {
    exclusiveFilter: filterText
  });

  return innerText || content;

  function filterText(frame) {
    innerText += frame.text;
  }
}

function sanitizeHtml(content) {
  previousTag = null;

  return sanitizer(content, config);
}

function filter(frame) {
  var
    result = false;

  if (filters[frame.tag]) {
    result = filters[frame.tag](frame);
  }

  previousTag = frame.tag;

  return result;
}

function filterAnchor(frame) {
  return frame.attribs.rel === 'nofollow' ||
    !frame.text.trim();
}

function filterImg(frame) {
  return frame.attribs.width === '1' ||
    frame.attribs.height === '1' ||
    previousTag === 'a';

}

function transformImg(tag, attrs) {
  var
    src = attrs.src,
    qIndex,
    thumbnailIndex;

  if (src) {
    qIndex = src.indexOf('?');
    if (qIndex >= 0) {
      src = src.slice(0, qIndex);
    }

    thumbnailIndex = src.indexOf('_thumbnail');
    if (thumbnailIndex >= 0) {
      src = src.slice(0, thumbnailIndex) +
        src.slice(thumbnailIndex + '_thumbnail'.length);
    }

    attrs.src = src;
  }

  if (attrs.height > 1) {
    attrs.height = '';
  }
  if (attrs.width > 1) {
    attrs.width = '';
  }

  return {
    tagName: 'img',
    attribs: attrs
  };
}

function transformAnchor(tag, attrs) {
  attrs['target'] = '_blank';

  return {
    tagName: 'a',
    attribs: attrs
  };
}