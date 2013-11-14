/**
 * Created by chris_000 on 11/10/13.
 */
define(['jquery', 'underscore', 'jquery-ui',
    'text!app/templates/regionsRow.ejs',
    'text!app/templates/areaRow.ejs'],
    function ($, _, ui, regionsRow, areaRow) {
        "use strict";
        var app = {},
            data = {
                regions: [],
                currentRegion: null,
                currentArea: null
            },
            commands = {
                regions: {},
                areas: {}
            },
            dialogs = {
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
            var compiled = _.template(regionsRow),
                tbody = $('#regionsTable').find('tbody');
            tbody.empty();
            $.each(data.regions, function (index, region) {
                tbody.append(compiled(region));
            });
        }

        function refreshRegions() {
            $.getJSON('/regions')
                .done(function (regions) {
                    data.regions = regions;
                    renderRegions();
                })
                .fail(function (x) {
                    alert('failed to get regions ' + x.statusText);
                });
        }

        function setDialogRegion() {
            var dlg = $('#regionDialog'),
                region = data.currentRegion,
                tbody = $('#areasTable').find('tbody'),
                compiled = _.template(areaRow);
            tbody.empty();
            $.each(region.areas, function (index, area) {
                $(compiled(area)).appendTo(tbody).data('index', index);
            });
            dlg.find('#regionName').val(region.version);
            dlg.find('#regionMinSize').val(region.minSize);
            dlg.find('#regionMaxTerrain').val(region.maxTerrain);
            dlg.find('#regionMaxDifficulty').val(region.maxDifficulty);
        }

        // areas are already current
        function getDialogRegion() {
            var dlg = $('#regionDialog'),
                region = data.currentRegion;
            region.version = dlg.find('#regionName').val().trim();
            region.maxDifficulty = parseInt(dlg.find('#regionMaxDifficulty').val());
            region.maxTerrain = parseInt(dlg.find('#regionMaxTerrain').val());
            region.minSize = parseInt(dlg.find('#regionMinSize').val());
            return region;
        }

        // set commands for callbacks

        commands.regions.deleteRegion = function (id) {
            app.postJson('/regions/' + id, {}, {type: 'DELETE'})
                .done(refreshRegions)
                .fail(function(x) {
                    alert('failed ' + x.statusText);
                });
            return false;
        };

        commands.regions.editRegion = function (id) {
            data.currentRegion = _.clone(_.find(data.regions, function (item) {
                return item._id === id;
            }));
            dialogs.regionDialog.dialog('open');
            setDialogRegion();
            return false;
        };

        commands.regions.updateRegion = function() {
            getDialogRegion();
            app.postJson('/regions/' + data.currentRegion._id, data.currentRegion, {type: 'PUT'})
                .done(function() {
                    dialogs.regionDialog.dialog('close');
                    refreshRegions();
                })
                .fail(function(x) {
                    alert('failed ' + x.statusText);
                });
            return false;
        };

        commands.regions.addRegion = function() {
            var region = {
                baseName: 'new_region',
                version: 'New Region'
            };
            app.postJson('/regions', region)
                .done(function() {
                    refreshRegions();
                })
                .fail(function(x) {
                    alert('failed ' + x.statusText);
                });
            return false;
        };

        commands.areas.editArea = function (index) {
            data.currentArea = _.clone(data.currentRegion[index]);
            dialogs.areaDialog.dialog('open');
            setDialogArea();
            return false;
        };

        commands.areas.deleteArea = function (index) {
            data.currentRegion.areas.splice(index, 1);
            setDialogRegion();
            return false;
        };

        commands.areas.addArea = function (index) {
            data.currentRegion.areas.push({
                minLatitude: 0,
                maxLatitude: 0,
                minLongitude: 0,
                maxLongitude: 0
            });
            setDialogRegion();
            return false;
        };

        function initializeRegionsTable() {
            var tbody = $('#regionsTable').find('tbody');
            tbody.on('click', 'td.command', function (event) {
                var el = $(event.currentTarget),
                    command = el.data('command'),
                    id = el.closest('tr').data('id');
                commands.regions[command](id);
            });
        }

        function initializeAreasTable() {
            var tbody = $('#areasTable').find('tbody');
            tbody.on('click', 'td.command', function (event) {
                var el = $(event.currentTarget),
                    command = el.data('command'),
                    index = el.closest('tr').data('index');
                commands.areas[command](index);
            });
        }

        function initializeDialogs() {
            dialogs.regionDialog = $('#regionDialog').dialog({
                autoOpen: false,
                height: 500,
                width: 600,
                modal: true,
                buttons: {
                    "Save": commands.regions.updateRegion,
                    "Cancel": function () {
                        $(this).dialog('close');
                    }
                }
            });

            dialogs.areaDialog = $('#areaDialog').dialog({
                autoOpen: false,
                height: 300,
                width: 500,
                modal: true,
                buttons: {
                    "Save": function () {
                        $(this).dialog('close');
                    },
                    "Cancel": function () {
                        $(this).dialog('close');
                    }
                }
            });
            initializeAreasTable();
            $('#addAreaButton').button().click(commands.areas.addArea);
        }


        function initializeUi() {
            initializeRegionsTable();
            $('#addRegionButton').button().click(commands.regions.addRegion);

            initializeDialogs();

            console.log('ui initialized');

            refreshRegions();
        }

        $(initializeUi());
        return app;
    });