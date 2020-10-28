import * as goods from 'data/goods.json';
import $ from 'js#/lib/jquery';

export const sorter = () => {
	let data = [];
	Object.entries(goods).forEach(([key, val]) => {
		data.push(val);
	});
	data.pop();
	$(window).on('popstate', function () {
		data = [];
		Object.entries(goods).forEach(([key, val]) => {
			data.push(val);
		});
		data.pop();
		let searchParams = '';
		searchParams = window.location.search;
		searchParams = searchParams.slice(1).split('&');
		const params = [];
		searchParams.forEach(function (key, value) {
			key = key.split('=');
			value = key[1];
			key.pop();
			key = key.join('');
			params.push({ key, value });
		});
		for (const [i, el] of Object.entries(params)) {
			switch (el.key) {
				case 'year':
					data = data.filter((element) => {
						if (parseInt(element.year) === parseInt(el.value)) {
							return element;
						}
					});
					break;
				case 'price':
					if (el.value.includes(',')) {
						const priceArr = el.value.split(',');
						const price = {
							from: parseInt(priceArr[0]),
							to: parseInt(priceArr[1])
						};
						data = data.filter((element) => {
							if (
								element.price.value >= price.from &&
								element.price.value <= price.to
							) {
								return element;
							}
						});
					}
					break;
				case 'manufacturer':
					data = data.filter((element) => {
						if (parseInt(element.manufacturer.id) === parseInt(el.value)) {
							return element;
						}
					});
					break;
				case 'brand':
					const brands = el.value.split(',');
					data = data.filter((element) => {
						if (brands.includes(element.brand.id.toString())) {
							return element;
						}
					});
					break;
				case 'model':
					data = data.filter((element) => {
						if (parseInt(element.model.id) === parseInt(el.value)) {
							return element;
						}
					});
			}
		}
		console.log(data);
		sortResults(data, 'year');
	});
	$('#sort').on('change', function () {
		sort(data);
	});
};
function sort_by_multiple(fields, reverse, primer) {
	function key(x, field) {
		if (Array.isArray(field)) for (var i = 0; i < field.length; i++) x = x[field[i]];
		else x = x[field];
		return primer ? primer(x) : x;
	}

	return function (a, b) {
		for (var cmp = 0, i = 0; i < fields.length && cmp == 0; i++) {
			var A = key(a, fields[i]);
			var B = key(b, fields[i]);
			cmp = (A > B) - (B > A);
		}
		return reverse ? -cmp : cmp;
	};
}
function sort(data) {
	const val = parseInt($('#sort').find('option:selected').val());
	switch (val) {
		case 1:
			data.sort((a, b) => {
				return a.price.value - b.price.value;
			});
			break;
		case 2:
			data.sort((a, b) => {
				return b.price.value - a.price.value;
			});
			break;
		case 3:
			data.sort(sort_by_multiple(['year']));
			break;
		case 4:
			data.sort(sort_by_multiple(['year'], true));
			break;
	}
}
function sortResults(obj, prop, ascending) {
	obj = obj.sort(function (a, b) {
		if (ascending) {
			return a[prop] > b[prop] ? 1 : a[prop] < b[prop] ? -1 : 0;
		} else {
			return b[prop] > a[prop] ? 1 : b[prop] < a[prop] ? -1 : 0;
		}
	});
	return obj;
}
