/**
 * Created by chris_000 on 11/10/13.
 */
define(['jquery', 'underscore', 'text!app/templates/regionsRow.ejs'], function ($, _, tt) {
    "use strict";
    var app = {},
        data = {
            regions: []
        };

    app.postJson = function (url, data, options) {
        var stuff = $.extend({}, {
            contentType: 'application/json',
            dataType: 'json',
            type: 'POST',
            url: url,
            data: JSON.stringify(data || {})
        }, options);
        return $.ajax(stuff);
    };

    function renderRegions() {
        var template = tt,
            compiled = _.template(template),
            tbody = $('#regionsTable').find('tbody');
        tbody.empty();
        $.each(data.regions, function(index, region) {
            tbody.append(compiled(region));
        });
    }


    function refreshRegions() {
        $.getJSON('/regions')
            .done(function(regions) {
                data.regions = regions;
                renderRegions();
            })
            .fail(function (x) {
                alert('failed to get regions ' + x.statusText);
            });
    }


    function initializeUi() {
        console.log('ui initialized');

        refreshRegions();
    }

    $(initializeUi());
    return app;
});