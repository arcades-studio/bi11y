# bi11y
An 11ty starter for people who like this exact 11ty starter.

There are many, _many_ 11ty starters. A lot of them are great! Some of them aren't. Good or bad, they tend to be feature heavy. Bi11y's goal is simple be a clean, reusable 11ty starter that implements PostCSS and a modern bundling solution (esbuild) the _11ty way_. And that's it...

![Ikea Billy Bookshelf](https://www.ikea.com/us/en/images/products/billy-bookcase-birch-veneer__0644259_pe702538_s5.jpg?f=xl)

# Setup
Download, `npm i` and you're good to go.

# Commands 
```
npm run dev
```
Launch dev server, watch for changes.

```
npm run build
```
Build for production.

# Structure
```
...
package.json
.eleventy.js [11ty config]
postcss.config.js [postcss config]
└ 📁 src
  └ 📁 components [includes]
  └ 📁 data [global data]
  └ 📁 pages [page templates]
  └ 📁 public [assets, copied to root]
  └ 📁 scripts [js]
  └ 📁 styles [css, set entrypoint(s) in postcss.config.js]
```  

## To do
[ ] Fetch example in data file\
[ ] Lazyloading option for image shortcode\
[x] Support multiple CSS in/out files\
[x] Typeset plugin\
[x] Data folder config
