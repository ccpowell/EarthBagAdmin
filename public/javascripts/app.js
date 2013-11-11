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
            var template = regionsRow,
                compiled = _.template(template),
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
                template = areaRow,
                compiled = _.template(template);
            tbody.empty();
            $.each(region.areas, function (index, area) {
                $(compiled(area)).appendTo(tbody).data('index', index);
            });
            dlg.find('#regionName').val(region.version);
            dlg.find('#regionMinSize').val(region.min_size);
            dlg.find('#regionMaxTerrain').val(region.max_terrain);
            dlg.find('#regionMaxDifficulty').val(region.max_difficulty);
        }

        function getDialogRegion() {
            var dlg = $('#regionDialog'),
                region = data.currentRegion;
            region.version = dlg.find('#regionName').val().trim();
            region.max_difficulty = parseInt(dlg.find('#regionMaxDifficulty').val());
            region.max_terrain = parseInt(dlg.find('#regionMaxTerrain').val());
            region.min_size = parseInt(dlg.find('#regionMinSize').val());
            return region;
        }

        commands.regions.editRegion = function (id) {
            data.currentRegion = _.clone(_.find(data.regions, function (item) {
                return item._id === id;
            }));
            dialogs.regionDialog.dialog('open');
            setDialogRegion();
        }

        commands.areas.editArea = function (index) {
            data.currentArea = _.clone(data.currentRegion[index]);
            dialogs.areaDialog.dialog('open');
            setDialogArea();
        }

        commands.areas.deleteArea = function (index) {
            data.currentRegion.areas.splice(index, 1);
            setDialogRegion();
        }

        commands.areas.addArea = function (index) {
            data.currentRegion.areas.push({
                min_latitude: 0,
                max_latitude: 0,
                min_longitude: 0,
                max_longitude: 0
            });
            setDialogRegion();
        }

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
                    "Save": function () {
                        $(this).dialog('close');
                    },
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
            initializeDialogs();

            console.log('ui initialized');

            refreshRegions();
        }

        $(initializeUi());
        return app;
    });