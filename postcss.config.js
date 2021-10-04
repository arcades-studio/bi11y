const prod = process.env.NODE_ENV === "production";

let plugins = [
  require("postcss-import")(),
  require("postcss-nested")(),
  require("postcss-preset-env")(),
];

if (prod) {
  plugins.push(
    require("cssnano")({
      preset: "default",
    })
  );
}

module.exports = {
  entryPoints: [
    'src/styles/main.css',
    'src/styles/other.css'
  ],
  plugins
}