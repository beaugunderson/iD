# See the README for installation instructions.

all: \
	$(BUILDJS_TARGETS) \
	dist/iD.css \
	dist/iD.js \
	dist/iD.min.js \
	dist/img/iD-sprite.svg \
	dist/img/maki-sprite.svg \
	js/lib/id/ui_tested_preset_fields.js


MAKI_SOURCES = node_modules/maki/src/*.svg

$(MAKI_SOURCES): node_modules/.install

dist/img/maki-sprite.svg: $(MAKI_SOURCES) Makefile
	node_modules/.bin/svg-sprite --symbol --symbol-dest . --symbol-sprite $@ $(MAKI_SOURCES)

data/feature-icons.json: $(MAKI_SOURCES)
	cp -f node_modules/maki/www/maki-sprite.json $@

dist/img/iD-sprite.svg: svg/iD-sprite.src.svg svg/iD-sprite.json
	node svg/spriteify.js --svg svg/iD-sprite.src.svg --json svg/iD-sprite.json > $@

BUILDJS_TARGETS = \
	data/presets/categories.json \
	data/presets/fields.json \
	data/presets/presets.json \
	data/presets.yaml \
	data/taginfo.json \
	data/data.js \
	dist/locales/en.js \
	dist/presets.js \
	dist/imagery.js

BUILDJS_SOURCES = \
	$(filter-out $(BUILDJS_TARGETS), $(shell find data -type f -name '*.json')) \
	data/feature-icons.json \
	data/core.yaml

$(BUILDJS_TARGETS): $(BUILDJS_SOURCES) build.js
	node build.js


MODULE_TARGETS = \
	js/lib/id/actions.js \
	js/lib/id/ui.js

js/lib/id/actions.js: modules/
	node_modules/.bin/rollup -f umd -n iD.actions modules/actions/index.js --no-strict > $@

js/lib/id/ui.js: modules/ui/*
	node_modules/.bin/rollup -f umd -n iD.ui modules/ui/index.js --no-strict > $@

js/lib/id/ui_tested_preset_fields.js: modules/ui/preset/*
	node_modules/.bin/rollup -f umd -n iD.ui.preset modules/ui/preset/index.js --no-strict > $@

dist/iD.js: \
	js/lib/bootstrap-tooltip.js \
	js/lib/d3.v3.js \
	js/lib/d3.combobox.js \
	js/lib/d3.geo.tile.js \
	js/lib/d3.jsonp.js \
	js/lib/d3.keybinding.js \
	js/lib/d3.one.js \
	js/lib/d3.dimensions.js \
	js/lib/d3.trigger.js \
	js/lib/d3.curtain.js \
	js/lib/d3.value.js \
	js/lib/diff3.js \
	js/lib/jxon.js \
	js/lib/lodash.js \
	js/lib/osmauth.js \
	js/lib/rbush.js \
	js/lib/sexagesimal.js \
	js/lib/togeojson.js \
	js/lib/marked.js \
	js/id/start.js \
	js/id/id.js \
	js/id/ui.js \
	$(MODULE_TARGETS) \
	js/id/services.js \
	js/id/services/mapillary.js \
	js/id/services/nominatim.js \
	js/id/services/taginfo.js \
	js/id/services/wikidata.js \
	js/id/services/wikipedia.js \
	js/id/util.js \
	js/id/util/session_mutex.js \
	js/id/util/suggest_names.js \
	js/id/geo.js \
	js/id/geo/extent.js \
	js/id/geo/intersection.js \
	js/id/geo/multipolygon.js \
	js/id/geo/raw_mercator.js \
	js/id/behavior.js \
	js/id/behavior/add_way.js \
	js/id/behavior/breathe.js \
	js/id/behavior/copy.js \
	js/id/behavior/drag.js \
	js/id/behavior/draw.js \
	js/id/behavior/draw_way.js \
	js/id/behavior/edit.js \
	js/id/behavior/hash.js \
	js/id/behavior/hover.js \
	js/id/behavior/lasso.js \
	js/id/behavior/paste.js \
	js/id/behavior/select.js \
	js/id/behavior/tail.js \
	js/id/modes.js \
	js/id/modes/add_area.js \
	js/id/modes/add_line.js \
	js/id/modes/add_point.js \
	js/id/modes/browse.js \
	js/id/modes/drag_node.js \
	js/id/modes/draw_area.js \
	js/id/modes/draw_line.js \
	js/id/modes/move.js \
	js/id/modes/rotate_way.js \
	js/id/modes/save.js \
	js/id/modes/select.js \
	js/id/operations.js \
	js/id/operations/circularize.js \
	js/id/operations/continue.js \
	js/id/operations/delete.js \
	js/id/operations/disconnect.js \
	js/id/operations/merge.js \
	js/id/operations/move.js \
	js/id/operations/orthogonalize.js \
	js/id/operations/reverse.js \
	js/id/operations/rotate.js \
	js/id/operations/split.js \
	js/id/operations/straighten.js \
	js/id/core/connection.js \
	js/id/core/difference.js \
	js/id/core/entity.js \
	js/id/core/graph.js \
	js/id/core/history.js \
	js/id/core/node.js \
	js/id/core/relation.js \
	js/id/core/tags.js \
	js/id/core/tree.js \
	js/id/core/way.js \
	js/id/renderer/background.js \
	js/id/renderer/background_source.js \
	js/id/renderer/features.js \
	js/id/renderer/map.js \
	js/id/renderer/tile_layer.js \
	js/id/svg.js \
	js/id/svg/areas.js \
	js/id/svg/debug.js \
	js/id/svg/defs.js \
	js/id/svg/gpx.js \
	js/id/svg/icon.js \
	js/id/svg/labels.js \
	js/id/svg/layers.js \
	js/id/svg/lines.js \
	js/id/svg/mapillary_images.js \
	js/id/svg/mapillary_signs.js \
	js/id/svg/midpoints.js \
	js/id/svg/osm.js \
	js/id/svg/points.js \
	js/id/svg/tag_classes.js \
	js/id/svg/turns.js \
	js/id/svg/vertices.js \
	js/id/presets.js \
	js/id/presets/category.js \
	js/id/presets/collection.js \
	js/id/presets/field.js \
	js/id/presets/preset.js \
	js/id/validations.js \
	js/id/validations/deprecated_tag.js \
	js/id/validations/many_deletions.js \
	js/id/validations/missing_tag.js \
	js/id/validations/tag_suggests_area.js \
	js/id/end.js \
	js/lib/locale.js \
	data/introGraph.js

.INTERMEDIATE dist/iD.js: data/data.js

dist/iD.js: node_modules/.install Makefile
	@rm -f $@
	cat $(filter %.js,$^) > $@

dist/iD.min.js: dist/iD.js Makefile
	@rm -f $@
	node_modules/.bin/uglifyjs $< -c -m -o $@

dist/iD.css: css/*.css
	cat css/reset.css css/map.css css/app.css > $@

node_modules/.install: package.json
	npm install
	touch node_modules/.install

translations:
	node data/update_locales

imagery:
	npm install editor-layer-index@git://github.com/osmlab/editor-layer-index.git#gh-pages
	node data/update_imagery

suggestions:
	npm install name-suggestion-index@git://github.com/osmlab/name-suggestion-index.git
	cp node_modules/name-suggestion-index/name-suggestions.json data/name-suggestions.json

wikipedias:
	npm install wmf-sitematrix@git://github.com/osmlab/wmf-sitematrix.git
	cp node_modules/wmf-sitematrix/wikipedia.min.json data/wikipedia.json

D3_FILES = \
	node_modules/d3/src/start.js \
	node_modules/d3/src/arrays/index.js \
	node_modules/d3/src/behavior/behavior.js \
	node_modules/d3/src/behavior/zoom.js \
	node_modules/d3/src/core/index.js \
	node_modules/d3/src/event/index.js \
	node_modules/d3/src/geo/length.js \
	node_modules/d3/src/geo/mercator.js \
	node_modules/d3/src/geo/path.js \
	node_modules/d3/src/geo/stream.js \
	node_modules/d3/src/geom/polygon.js \
	node_modules/d3/src/geom/hull.js \
	node_modules/d3/src/selection/index.js \
	node_modules/d3/src/transition/index.js \
	node_modules/d3/src/xhr/index.js \
	node_modules/d3/src/end.js

d3:
	node_modules/.bin/smash $(D3_FILES) > js/lib/d3.v3.js
	@echo 'd3 rebuilt. Please reapply 7e2485d, 4da529f, 223974d and 71a3d3e'

lodash:
	node_modules/.bin/lodash --development --output js/lib/lodash.js include="includes,toPairs,assign,bind,chunk,clone,compact,debounce,difference,each,every,extend,filter,find,first,forEach,forOwn,groupBy,indexOf,intersection,isEmpty,isEqual,isFunction,keys,last,map,omit,reject,some,throttle,union,uniq,values,without,flatten,value,chain,cloneDeep,merge,pick,reduce" exports="global,node"

clean:
	rm -f $(BUILDJS_TARGETS) $(MODULE_TARGETS) data/feature-icons.json dist/iD*.js dist/iD.css dist/img/*.svg
