const prod = process.env.NODE_ENV === "production";
let fs = require("fs");
let path = require("path");
let postcssConfig = require("./postcss.config");
let Postcss = require("postcss");
let EsBuild = require("esbuild");

const Image = require("@11ty/eleventy-img");
const metagen = require("eleventy-plugin-metagen");
const typesetPlugin = require("eleventy-plugin-typeset");

async function imageShortcode(src, alt, sizes, classes) {
  let metadata = await Image(src, {
    widths: [200, 400, 600, 800, 1000, 1400, 1600],
    formats: ["webp", "jpeg"],
    outputDir: "./_site/img",
  });

  let imageAttributes = {
    class: classes,
    alt,
    sizes,
  };

  return Image.generateHTML(metadata, imageAttributes);
}

function processCssFile(file) {
  const basename = path.basename(file);

  fs.readFile(`./${path.normalize(file)}`, "utf8", (err, data) => {
    if (err) {
      console.log(err);
      return;
    } else {
      Postcss(postcssConfig.plugins)
        .process(data, {
          from: file,
          to: `_site/${basename}`,
        })
        .then((result) => {
          fs.writeFile(`./_site/${basename}`, result.css, (err) => {
            if (err) {
              console.log(err);
              return;
            }
          });
        });
    }
  });
}

function afterBuild() {
  EsBuild.buildSync({
    entryPoints: ["./src/scripts/index.js"],
    bundle: true,
    minify: prod,
    outfile: "_site/index.js",
  });
  

  postcssConfig.entryPoints.forEach((entryPoint) => {
    processCssFile(entryPoint)});
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    "src/public": "/",
  });

  eleventyConfig.addWatchTarget("./src");
  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
  eleventyConfig.addPlugin(metagen);
  eleventyConfig.addPlugin(typesetPlugin());
  eleventyConfig.on("afterBuild", afterBuild);

  return {
    dir: {
      input: "src/pages",
      includes: "../components",
      data: "../data",
    },
  };
};
