// exports.trueFalse = (function(condition, ifTrue, ifFalse){
// 	return condition? ifTrue : ifFalse;
// });


//note, sass uses a 1-based index for lists, while js uses a 0-based index for arrays.
//we make the fix here, so the LESS code is more easily comparable to jeet's SASS

exports.get_span = function(_ratio) {
	var ratio = _ratio || 1;
	return ratio * 100;
};
exports.get_column = function(_ratios, _g) {
	var ratios = String(_ratios || 1).split(' ');
	var g = _g || Number('@{jeet-gutter}');
	if (!Boolean('@{jeet-parent-first}')) {
		ratios.reverse();
	}
	var w = 100;
	for(var i in ratios) {
		var ratio = ratios[i];
		g = (g / w) * 100;
		w = (100 * ratio) - g + (ratio * g);
	}
	return [w, g].join(' ');
};
exports.get_layout_direction = function() {
	return (String('@{jeet-layout-direction}') == 'RTL')? 'right' : 'left';
};
exports.opposite_direction = function(direction) {
	var opposite_of = {
		left: 'right',
		right: 'left',
		ltr: 'rtl',
		rtl: 'ltr',
		top: 'bottom',
		bottom: 'top'
	};
	return opposite_of[direction];
};
exports.nth = function(list, index) {
	return String(list).split(' ')[index-1];
};
exports.replace_nth = function(list, index, value) {
	list = String(list).split(' ');
	list[index-1] = value;
	return list.join(' ');
};
exports.shift_left = function(side, ratios, col_or_span) {
	var get_span = function(_ratio) {
		var ratio = _ratio || 1;
		return ratio * 100;
	};
	var get_column = function(_ratios, _g) {
		var ratios = String(_ratios || 1).split(' ');
		var g = _g || Number('@{jeet-gutter}');
		if (!Boolean('@{jeet-parent-first}')) {
			ratios.reverse();
		}
		var w = 100;
		for(var i in ratios) {
			var ratio = ratios[i];
			g = (g / w) * 100;
			w = (100 * ratio) - g + (ratio * g);
		}
		return [w, g].join(' ');
	};
	var nth = function(list, index) {
		return String(list).split(' ')[index-1];
	};
	var replace_nth = function(list, index, value) {
		list = String(list).split(' ');
		list[index-1] = value;
		return list.join(' ');
	};

	var translate = '';
	if (side == 'right') {
		ratios = replace_nth(ratios, 0, nth(ratios, 1) * -1); /*BUG: won't 0 break this?*/
	}
	if (col_or_span == 'column' || col_or_span == 'col' || col_or_span == 'c') {
		var column_widths = get_column(ratios, gutter);
		translate = nth(column_widths, 1) + nth(column_widths, 2);
	} else {
		translate: get_span(ratios);
	}
	return translate + '%';
};
// exports.span_margin_left = function(offset) {
// 	return Math.max(0, offset) * 100;
// }
// exports.span_margin_right = function(offset) {
// 	return Math.abs(offset) * 100;
// }
exports.col_margin = function(variant, offset, column_widths) {
	var get_column = function(_ratios, _g) {
		var ratios = String(_ratios || 1).split(' ');
		var g = _g || Number('@{jeet-gutter}');
		if (!Boolean('@{jeet-parent-first}')) {
			ratios.reverse();
		}
		var w = 100;
		for(var i in ratios) {
			var ratio = ratios[i];
			g = (g / w) * 100;
			w = (100 * ratio) - g + (ratio * g);
		}
		return [w, g].join(' ');
	};
	var nth = function(list, index) {
		return String(list).split(' ')[index-1];
	};

	var margin_l = 0;
	var margin_r = nth(column_widths, 2);
	var margin_last = 0;
	if (offset < 0) {
		offset = -offset;
		offset = nth(get_column(offset, nth(column_widths, 2)), 1);
		margin_last = offset + nth(column_widths, 2) * 2;
		margin_r = margin_last;
	}
	if (offset > 0) {
		offset = nth(get_column(offset, nth(column_widths, 2)), 1);
		margin_l = offset + nth(column_widths, 2);
	}

	return {
		left: margin_l,
		right: margin_r,
		last: margin_last
	}[variant];
};