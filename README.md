![Gulp](https://avatars0.githubusercontent.com/u/6200624?s=70&v=4)
&nbsp;
&nbsp;
![Pug](https://avatars0.githubusercontent.com/u/9338635?s=70&v=4)
&nbsp;
&nbsp;
![SASS](https://avatars2.githubusercontent.com/u/317889?s=70&v=4)
&nbsp;
&nbsp;
![PostCSS](https://avatars1.githubusercontent.com/u/8296347?s=70&v=4)
&nbsp;
&nbsp;
![Babel](https://avatars0.githubusercontent.com/u/9637642?s=70&v=4)
&nbsp;
&nbsp;
![BroserSync](https://avatars3.githubusercontent.com/u/10654171?s=70&v=4)

# html-template
Multipage web app template with Gulp 4, Pug, SASS, PostCSS, Autoprefixer, Babel, BrowserSync and etc.

*Based on [Web app generator](https://github.com/yeoman/generator-webapp/)*

## Features
- Streaming build system [Gulp 4](https://gulpjs.com/)
- HTML template engine [Pug](https://pugjs.org/)
- CSS language extension [SASS](https://sass-lang.com/)
- Styles transformer [PostCSS](https://postcss.org/)
- Browsers vendors prefixer [Autoprefixer](https://github.com/postcss/autoprefixer/)
- JavaScript compiler [Babel](https://babeljs.io/)
- Styles, Scripts and Images minifiers ([CSSNano](https://cssnano.co/), [Uglify](http://lisperator.net/uglifyjs/), [Imagemin](https://github.com/imagemin/imagemin/))
- Local server with live reload and testing [BrowserSync](https://www.browsersync.io/)

## Getting start
1. Install [Node.js](https://nodejs.org/) (LTS version is recommended for most users)
2. Install Gulp-cli `npm install --global gulp-cli` ("npm" should have been installed with Node.js)
3. Run `npm start` ... develop!

## Project overview
- `package.json` - dependencies for development and production (libraries), configs and start scripts
- `gulpfile.js` - gulp's tasks
- `src/` - project's sources (development)
- `dist/` - project's built distribute (production)

## Intalling libraries
By default template have only 1 library for production [Normalize.css](http://necolas.github.io/normalize.css/) (styles normalizer), to add libraries use:  
- `npm install --save *library-name*` for production
- `npm install --save-dev *library-name*` for development

Then write root path to libraries files in src/templates/layout.pug between comments "build". For example:

Styles in the head:
```pug
// build:css styles/libraries.min.css
link(rel='stylesheet', href='/node_modules/normalize.css/normalize.css')
link(rel='stylesheet', href='/node_modules/slick-carousel/slick/slick.css')
// endbuild
```

Scripts in the end of body:
```pug
// build:js scripts/libraries.min.js
script(src='/node_modules/jquery/dist/jquery.js')
script(src='/node_modules/slick-carousel/slick/slick.js')
// endbuild
```

## To Do
- [x] Write README
- [ ] Clean some trash
- [ ] Move tasks scripts from package.json and leave only gulpfile tasks
- [ ] Add autowiring depencies task
- [ ] ...
- [ ] Profit!
