const prod = process.env.NODE_ENV === "production";
let fs = require("fs");
const Image = require("@11ty/eleventy-img");
let Postcss = require("postcss");
const metagen = require("eleventy-plugin-metagen");

let postcssPlugins = [
  require("postcss-import")(),
  require("postcss-normalize")({
    forceImport: "normalize.css",
  }),
  require("postcss-nested"),
  require("postcss-preset-env")(),
];

if (prod) {
  postcssPlugins.push(
    require("cssnano")({
      preset: "default",
    })
  );
}

async function imageShortcode(src, alt, sizes, classes) {
  let metadata = await Image(src, {
    widths: prod ? [200, 400, 600, 800, 1000, 1400, 1600] : [1600],
    formats: prod ? ["webp", "jpeg"] : ["webp"],
    outputDir: "./_site/img",
  });

  let imageAttributes = {
    class: classes,
    alt,
    sizes,
  };

  return Image.generateHTML(metadata, imageAttributes);
}

function afterBuild() {
  require("esbuild").buildSync({
    entryPoints: ["./src/scripts/index.js"],
    bundle: true,
    minify: prod,
    outfile: "_site/index.js",
  });

  fs.readFile("./src/styles/main.css", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      return;
    } else {
      Postcss(postcssPlugins)
        .process(data, {
          from: `src/styles/main.css`,
          to: `_site/styles.css`,
        })
        .then((result) => {
          fs.writeFile(`./_site/styles.css`, result.css, (err) => {
            if (err) {
              console.log(err);
              return;
            }
          });
        });
    }
  });
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    "src/public": "/",
  });

  eleventyConfig.addWatchTarget("./src");
  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
  eleventyConfig.addPlugin(metagen);
  eleventyConfig.on("afterBuild", afterBuild);

  return {
    dir: {
      input: "src/pages",
      includes: "../components",
      data: "../data"
    },
  };
};
