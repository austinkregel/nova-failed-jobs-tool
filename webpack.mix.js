let mix = require('laravel-mix')
var tailwindcss = require('tailwindcss');

mix.js('resources/js/tool.js', 'dist/js')
    .sass('resources/sass/tool.scss', 'dist/css')
    .options({
        processCssUrls: false,
        postCss: [ tailwindcss('./tailwind.js') ],
    });
