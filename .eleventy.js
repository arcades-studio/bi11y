const prod = process.env.NODE_ENV === "production";
const Image = require("@11ty/eleventy-img");
let Postcss = require('postcss')
let postcssPlugins = [
  require('postcss-preset-env')(),
  require('cssnano')({
      preset: 'default',
  }),
]

async function imageShortcode(src, alt, sizes, classes) {
  let metadata = await Image(src, {
    widths : prod ? [200, 400, 600, 800, 1000, 1400, 1600] : [1000, 1400, 1600],
    formats: prod ? ["webp", "jpeg"] : ["webp"],
    outputDir: './_site/img',
  });

  let imageAttributes = {
    class: classes,
    alt,
    sizes,
  };

  return Image.generateHTML(metadata, imageAttributes);
}

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    "src/public": "/"
  });
  
  eleventyConfig.addWatchTarget("./src");
  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);

  eleventyConfig.addNunjucksAsyncFilter("postcss", async function (
    css,
    callback
  ) {
    
    try {
      const processedCss = await Postcss(postcssPlugins).process(css, { from: undefined });
      callback(null, processedCss);
    } catch (err) {
      console.error("Postcss error: ", err);
      callback(null, css);
    }
  });


  eleventyConfig.on('afterBuild', () => {
    require('esbuild').buildSync({
      entryPoints: ['./src/scripts/index.js'],
      bundle: true,
      minify: prod,
      outfile: '_site/index.js',
    })
  });

  return {
    dir: {
      input: "src/pages",
      includes: "../components",
    }
  }
};