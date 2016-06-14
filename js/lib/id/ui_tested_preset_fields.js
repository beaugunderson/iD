(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.iD = global.iD || {}, global.iD.ui = global.iD.ui || {}, global.iD.ui.preset = global.iD.ui.preset || {})));
}(this, function (exports) { 'use strict';

    function access(field) {
        var dispatch = d3.dispatch('change'),
            items;

        function access(selection) {
            var wrap = selection.selectAll('.preset-input-wrap')
                .data([0]);

            wrap.enter().append('div')
                .attr('class', 'cf preset-input-wrap')
                .append('ul');

            items = wrap.select('ul').selectAll('li')
                .data(field.keys);

            // Enter

            var enter = items.enter().append('li')
                .attr('class', function(d) { return 'cf preset-access-' + d; });

            enter.append('span')
                .attr('class', 'col6 label preset-label-access')
                .attr('for', function(d) { return 'preset-input-access-' + d; })
                .text(function(d) { return field.t('types.' + d); });

            enter.append('div')
                .attr('class', 'col6 preset-input-access-wrap')
                .append('input')
                .attr('type', 'text')
                .attr('class', 'preset-input-access')
                .attr('id', function(d) { return 'preset-input-access-' + d; })
                .each(function(d) {
                    d3.select(this)
                        .call(d3.combobox()
                            .data(access.options(d)));
                });

            // Update

            wrap.selectAll('.preset-input-access')
                .on('change', change)
                .on('blur', change);
        }

        function change(d) {
            var tag = {};
            tag[d] = d3.select(this).value() || undefined;
            dispatch.change(tag);
        }

        access.options = function(type) {
            var options = ['no', 'permissive', 'private', 'destination'];

            if (type !== 'access') {
                options.unshift('yes');
                options.push('designated');

                if (type === 'bicycle') {
                    options.push('dismount');
                }
            }

            return options.map(function(option) {
                return {
                    title: field.t('options.' + option + '.description'),
                    value: option
                };
            });
        };

        var placeholders = {
            footway: {
                foot: 'designated',
                motor_vehicle: 'no'
            },
            steps: {
                foot: 'yes',
                motor_vehicle: 'no',
                bicycle: 'no',
                horse: 'no'
            },
            pedestrian: {
                foot: 'yes',
                motor_vehicle: 'no'
            },
            cycleway: {
                motor_vehicle: 'no',
                bicycle: 'designated'
            },
            bridleway: {
                motor_vehicle: 'no',
                horse: 'designated'
            },
            path: {
                foot: 'yes',
                motor_vehicle: 'no',
                bicycle: 'yes',
                horse: 'yes'
            },
            motorway: {
                foot: 'no',
                motor_vehicle: 'yes',
                bicycle: 'no',
                horse: 'no'
            },
            trunk: {
                motor_vehicle: 'yes'
            },
            primary: {
                foot: 'yes',
                motor_vehicle: 'yes',
                bicycle: 'yes',
                horse: 'yes'
            },
            secondary: {
                foot: 'yes',
                motor_vehicle: 'yes',
                bicycle: 'yes',
                horse: 'yes'
            },
            tertiary: {
                foot: 'yes',
                motor_vehicle: 'yes',
                bicycle: 'yes',
                horse: 'yes'
            },
            residential: {
                foot: 'yes',
                motor_vehicle: 'yes',
                bicycle: 'yes',
                horse: 'yes'
            },
            unclassified: {
                foot: 'yes',
                motor_vehicle: 'yes',
                bicycle: 'yes',
                horse: 'yes'
            },
            service: {
                foot: 'yes',
                motor_vehicle: 'yes',
                bicycle: 'yes',
                horse: 'yes'
            },
            motorway_link: {
                foot: 'no',
                motor_vehicle: 'yes',
                bicycle: 'no',
                horse: 'no'
            },
            trunk_link: {
                motor_vehicle: 'yes'
            },
            primary_link: {
                foot: 'yes',
                motor_vehicle: 'yes',
                bicycle: 'yes',
                horse: 'yes'
            },
            secondary_link: {
                foot: 'yes',
                motor_vehicle: 'yes',
                bicycle: 'yes',
                horse: 'yes'
            },
            tertiary_link: {
                foot: 'yes',
                motor_vehicle: 'yes',
                bicycle: 'yes',
                horse: 'yes'
            }
        };

        access.tags = function(tags) {
            items.selectAll('.preset-input-access')
                .value(function(d) { return tags[d] || ''; })
                .attr('placeholder', function() {
                    return tags.access ? tags.access : field.placeholder();
                });

            // items.selectAll('#preset-input-access-access')
            //     .attr('placeholder', 'yes');

            _.forEach(placeholders[tags.highway], function(v, k) {
                items.selectAll('#preset-input-access-' + k)
                    .attr('placeholder', function() { return (tags.access || v); });
            });
        };

        access.focus = function() {
            items.selectAll('.preset-input-access')
                .node().focus();
        };

        return d3.rebind(access, dispatch, 'on');
    }

    function localized(field, context) {
        var dispatch = d3.dispatch('change', 'input'),
            wikipedia = iD.services.wikipedia(),
            input, localizedInputs, wikiTitles,
            entity;

        function localized(selection) {
            input = selection.selectAll('.localized-main')
                .data([0]);

            input.enter().append('input')
                .attr('type', 'text')
                .attr('id', 'preset-input-' + field.id)
                .attr('class', 'localized-main')
                .attr('placeholder', field.placeholder());

            if (field.id === 'name') {
                var preset = context.presets().match(entity, context.graph());
                input.call(d3.combobox().fetcher(
                    iD.util.SuggestNames(preset, iD.data.suggestions)
                ));
            }

            input
                .on('input', change(true))
                .on('blur', change())
                .on('change', change());

            var translateButton = selection.selectAll('.localized-add')
                .data([0]);

            translateButton.enter()
                .append('button')
                .attr('class', 'button-input-action localized-add minor')
                .attr('tabindex', -1)
                .call(iD.svg.Icon('#icon-plus'))
                .call(bootstrap.tooltip()
                    .title(t('translate.translate'))
                    .placement('left'));

            translateButton
                .on('click', addNew);

            localizedInputs = selection.selectAll('.localized-wrap')
                .data([0]);

            localizedInputs.enter().append('div')
                .attr('class', 'localized-wrap');
        }

        function addNew() {
            d3.event.preventDefault();
            var data = localizedInputs.selectAll('div.entry').data();
            var defaultLang = iD.detect().locale.toLowerCase().split('-')[0];
            var langExists = _.find(data, function(datum) { return datum.lang === defaultLang;});
            var isLangEn = defaultLang.indexOf('en') > -1;
            if (isLangEn || langExists) {
              defaultLang = '';
            }
            data.push({ lang: defaultLang, value: '' });
            localizedInputs.call(render, data);
        }

        function change(onInput) {
            return function() {
                var t = {};
                t[field.key] = d3.select(this).value() || undefined;
                dispatch.change(t, onInput);
            };
        }

        function key(lang) { return field.key + ':' + lang; }

        function changeLang(d) {
            var lang = d3.select(this).value(),
                t = {},
                language = _.find(iD.data.wikipedia, function(d) {
                    return d[0].toLowerCase() === lang.toLowerCase() ||
                        d[1].toLowerCase() === lang.toLowerCase();
                });

            if (language) lang = language[2];

            if (d.lang && d.lang !== lang) {
                t[key(d.lang)] = undefined;
            }

            var value = d3.select(this.parentNode)
                .selectAll('.localized-value')
                .value();

            if (lang && value) {
                t[key(lang)] = value;
            } else if (lang && wikiTitles && wikiTitles[d.lang]) {
                t[key(lang)] = wikiTitles[d.lang];
            }

            d.lang = lang;
            dispatch.change(t);
        }

        function changeValue(d) {
            if (!d.lang) return;
            var t = {};
            t[key(d.lang)] = d3.select(this).value() || undefined;
            dispatch.change(t);
        }

        function fetcher(value, cb) {
            var v = value.toLowerCase();

            cb(iD.data.wikipedia.filter(function(d) {
                return d[0].toLowerCase().indexOf(v) >= 0 ||
                d[1].toLowerCase().indexOf(v) >= 0 ||
                d[2].toLowerCase().indexOf(v) >= 0;
            }).map(function(d) {
                return { value: d[1] };
            }));
        }

        function render(selection, data) {
            var wraps = selection.selectAll('div.entry').
                data(data, function(d) { return d.lang; });

            var innerWrap = wraps.enter()
                .insert('div', ':first-child');

            innerWrap.attr('class', 'entry')
                .each(function() {
                    var wrap = d3.select(this);
                    var langcombo = d3.combobox().fetcher(fetcher).minItems(0);

                    var label = wrap.append('label')
                        .attr('class','form-label')
                        .text(t('translate.localized_translation_label'))
                        .attr('for','localized-lang');

                    label.append('button')
                        .attr('class', 'minor remove')
                        .on('click', function(d){
                            d3.event.preventDefault();
                            var t = {};
                            t[key(d.lang)] = undefined;
                            dispatch.change(t);
                            d3.select(this.parentNode.parentNode)
                                .style('top','0')
                                .style('max-height','240px')
                                .transition()
                                .style('opacity', '0')
                                .style('max-height','0px')
                                .remove();
                        })
                        .call(iD.svg.Icon('#operation-delete'));

                    wrap.append('input')
                        .attr('class', 'localized-lang')
                        .attr('type', 'text')
                        .attr('placeholder',t('translate.localized_translation_language'))
                        .on('blur', changeLang)
                        .on('change', changeLang)
                        .call(langcombo);

                    wrap.append('input')
                        .on('blur', changeValue)
                        .on('change', changeValue)
                        .attr('type', 'text')
                        .attr('placeholder', t('translate.localized_translation_name'))
                        .attr('class', 'localized-value');
                });

            innerWrap
                .style('margin-top', '0px')
                .style('max-height', '0px')
                .style('opacity', '0')
                .transition()
                .duration(200)
                .style('margin-top', '10px')
                .style('max-height', '240px')
                .style('opacity', '1')
                .each('end', function() {
                    d3.select(this)
                        .style('max-height', '')
                        .style('overflow', 'visible');
                });

            wraps.exit()
                .transition()
                .duration(200)
                .style('max-height','0px')
                .style('opacity', '0')
                .style('top','-10px')
                .remove();

            var entry = selection.selectAll('.entry');

            entry.select('.localized-lang')
                .value(function(d) {
                    var lang = _.find(iD.data.wikipedia, function(lang) { return lang[2] === d.lang; });
                    return lang ? lang[1] : d.lang;
                });

            entry.select('.localized-value')
                .value(function(d) { return d.value; });
        }

        localized.tags = function(tags) {
            // Fetch translations from wikipedia
            if (tags.wikipedia && !wikiTitles) {
                wikiTitles = {};
                var wm = tags.wikipedia.match(/([^:]+):(.+)/);
                if (wm && wm[0] && wm[1]) {
                    wikipedia.translations(wm[1], wm[2], function(d) {
                        wikiTitles = d;
                    });
                }
            }

            input.value(tags[field.key] || '');

            var postfixed = [], k, m;
            for (k in tags) {
                m = k.match(/^(.*):([a-zA-Z_-]+)$/);
                if (m && m[1] === field.key && m[2]) {
                    postfixed.push({ lang: m[2], value: tags[k] });
                }
            }

            localizedInputs.call(render, postfixed.reverse());
        };

        localized.focus = function() {
            input.node().focus();
        };

        localized.entity = function(_) {
            if (!arguments.length) return entity;
            entity = _;
            return localized;
        };

        return d3.rebind(localized, dispatch, 'on');
    }

    function wikipedia(field, context) {
        var dispatch = d3.dispatch('change'),
            wikipedia = iD.services.wikipedia(),
            wikidata = iD.services.wikidata(),
            link, entity, lang, title;

        function wiki(selection) {
            var langcombo = d3.combobox()
                .fetcher(function(value, cb) {
                    var v = value.toLowerCase();

                    cb(iD.data.wikipedia.filter(function(d) {
                        return d[0].toLowerCase().indexOf(v) >= 0 ||
                            d[1].toLowerCase().indexOf(v) >= 0 ||
                            d[2].toLowerCase().indexOf(v) >= 0;
                    }).map(function(d) {
                        return { value: d[1] };
                    }));
                });

            var titlecombo = d3.combobox()
                .fetcher(function(value, cb) {

                    if (!value) value = context.entity(entity.id).tags.name || '';
                    var searchfn = value.length > 7 ? wikipedia.search : wikipedia.suggestions;

                    searchfn(language()[2], value, function(query, data) {
                        cb(data.map(function(d) {
                            return { value: d };
                        }));
                    });
                });

            lang = selection.selectAll('input.wiki-lang')
                .data([0]);

            lang.enter().append('input')
                .attr('type', 'text')
                .attr('class', 'wiki-lang')
                .attr('placeholder', t('translate.localized_translation_language'))
                .value('English');

            lang
                .call(langcombo)
                .on('blur', changeLang)
                .on('change', changeLang);

            title = selection.selectAll('input.wiki-title')
                .data([0]);

            title.enter().append('input')
                .attr('type', 'text')
                .attr('class', 'wiki-title')
                .attr('id', 'preset-input-' + field.id);

            title
                .call(titlecombo)
                .on('blur', blur)
                .on('change', change);

            link = selection.selectAll('a.wiki-link')
                .data([0]);

            link.enter().append('a')
                .attr('class', 'wiki-link button-input-action minor')
                .attr('tabindex', -1)
                .attr('target', '_blank')
                .call(iD.svg.Icon('#icon-out-link', 'inline'));
        }

        function language() {
            var value = lang.value().toLowerCase();
            var locale = iD.detect().locale.toLowerCase();
            var localeLanguage;
            return _.find(iD.data.wikipedia, function(d) {
                if (d[2] === locale) localeLanguage = d;
                return d[0].toLowerCase() === value ||
                    d[1].toLowerCase() === value ||
                    d[2] === value;
            }) || localeLanguage || ['English', 'English', 'en'];
        }

        function changeLang() {
            lang.value(language()[1]);
            change(true);
        }

        function blur() {
            change(true);
        }

        function change(skipWikidata) {
            var value = title.value(),
                m = value.match(/https?:\/\/([-a-z]+)\.wikipedia\.org\/(?:wiki|\1-[-a-z]+)\/([^#]+)(?:#(.+))?/),
                l = m && _.find(iD.data.wikipedia, function(d) { return m[1] === d[2]; }),
                anchor,
                syncTags = {};

            if (l) {
                // Normalize title http://www.mediawiki.org/wiki/API:Query#Title_normalization
                value = decodeURIComponent(m[2]).replace(/_/g, ' ');
                if (m[3]) {
                    try {
                        // Best-effort `anchordecode:` implementation
                        anchor = decodeURIComponent(m[3].replace(/\.([0-9A-F]{2})/g, '%$1'));
                    } catch (e) {
                        anchor = decodeURIComponent(m[3]);
                    }
                    value += '#' + anchor.replace(/_/g, ' ');
                }
                value = value.slice(0, 1).toUpperCase() + value.slice(1);
                lang.value(l[1]);
                title.value(value);
            }

            syncTags.wikipedia = value ? language()[2] + ':' + value : undefined;
            if (!skipWikidata) {
                syncTags.wikidata = undefined;
            }

            dispatch.change(syncTags);


            if (skipWikidata || !value || !language()[2]) return;

            // attempt asynchronous update of wikidata tag..
            var initEntityId = entity.id,
                initWikipedia = context.entity(initEntityId).tags.wikipedia;

            wikidata.itemsByTitle(language()[2], value, function (title, data) {
                // 1. most recent change was a tag change
                var annotation = t('operations.change_tags.annotation'),
                    currAnnotation = context.history().undoAnnotation();
                if (currAnnotation !== annotation) return;

                // 2. same entity exists and still selected
                var selectedIds = context.selectedIDs(),
                    currEntityId = selectedIds.length > 0 && selectedIds[0];
                if (currEntityId !== initEntityId) return;

                // 3. wikipedia value has not changed
                var currTags = _.clone(context.entity(currEntityId).tags),
                    qids = data && Object.keys(data);
                if (initWikipedia !== currTags.wikipedia) return;

                // ok to coalesce the update of wikidata tag into the previous tag change
                currTags.wikidata = qids && _.find(qids, function (id) {
                    return id.match(/^Q\d+$/);
                });

                context.overwrite(iD.actions.ChangeTags(currEntityId, currTags), annotation);
                dispatch.change(currTags);
            });
        }

        wiki.tags = function(tags) {
            var value = tags[field.key] || '',
                m = value.match(/([^:]+):([^#]+)(?:#(.+))?/),
                l = m && _.find(iD.data.wikipedia, function(d) { return m[1] === d[2]; }),
                anchor = m && m[3];

            // value in correct format
            if (l) {
                lang.value(l[1]);
                title.value(m[2] + (anchor ? ('#' + anchor) : ''));
                if (anchor) {
                    try {
                        // Best-effort `anchorencode:` implementation
                        anchor = encodeURIComponent(anchor.replace(/ /g, '_')).replace(/%/g, '.');
                    } catch (e) {
                        anchor = anchor.replace(/ /g, '_');
                    }
                }
                link.attr('href', 'https://' + m[1] + '.wikipedia.org/wiki/' +
                    m[2].replace(/ /g, '_') + (anchor ? ('#' + anchor) : ''));

            // unrecognized value format
            } else {
                title.value(value);
                if (value && value !== '') {
                    lang.value('');
                }
                link.attr('href', 'https://en.wikipedia.org/wiki/Special:Search?search=' + value);
            }
        };

        wiki.entity = function(_) {
            if (!arguments.length) return entity;
            entity = _;
            return wiki;
        };

        wiki.focus = function() {
            title.node().focus();
        };

        return d3.rebind(wiki, dispatch, 'on');
    }

    exports.access = access;
    exports.localized = localized;
    exports.wikipedia = wikipedia;

    Object.defineProperty(exports, '__esModule', { value: true });

}));