/**
 * Created by chris_000 on 11/10/13.
 */
require.config({
    paths: {
        // Almond is used to lighten the output filesize.
        "almond": "bower_components/almond/almond",

        // Opt for Lo-Dash Underscore compatibility build over Underscore.
        "underscore": "bower_components/lodash/dist/lodash.compat",

        // Map remaining vendor dependencies.
        "jquery": "bower_components/jquery/jquery",
        "jquery-ui": "bower_components/jquery-ui/jquery-ui",
        "cookie": "bower_components/jquery.cookie/jquery.cookie",
        "text": "bower_components/text/text"
    },

    shim: {
        "jquery-ui": "jquery",
        "cookie": "jquery"
    }
});
