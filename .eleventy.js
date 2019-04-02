module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('static/css');
  eleventyConfig.addPassthroughCopy('static/img');
  eleventyConfig.addPassthroughCopy('static/js');
};