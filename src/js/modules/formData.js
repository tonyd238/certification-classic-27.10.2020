import $ from 'js#/lib/jquery';
import * as goods from 'js#/data/goods.json';

export const form = () => {
	$('.form__control').on('change', function () {
		formData();
	});
};

function formData() {
	const filterData = new FormData(document.getElementById('filter'));
	const data = {
		params: {
			brand: filterData.getAll('brand').length
				? filterData.getAll('brand')
				: null,
			manufacturer: filterData.get('marka'),
			model: filterData.get('filter-model'),
			year: parseInt(filterData.get('year')),
			price: [
				parseInt(filterData.get('price-from')),
				parseInt(filterData.get('price-to'))
			]
		},
		pagination: {
			sort: filterData.get('sort'),
			perPage: parseInt(filterData.get('per_page')),
			page: parseInt(filterData.get('page'))
		}
	};
	const sortedData = {
		page: data.pagination.page ? data.pagination.page : null,
		year: data.params.year ? data.params.year : null,
		price: data.params.price ? data.params.price : null,
		model: data.params.model ? data.params.model : null,
		manufacturer: data.params.manufacturer ? data.params.manufacturer : null,
		brand: data.params.brand ? data.params.brand : null,
		sort: data.pagination.sort ? data.pagination.sort : null,
		'per-page': data.pagination.perPage ? data.pagination.perPage : null
	};
	let url = document.location.origin + document.location.pathname + '?';
	for (const [key, value] of Object.entries(removeEmpty(sortedData))) {
		url += key + '=' + value + '&';
	}
	url = url.slice(0, -1);
	window.history.pushState('', document.title, url);
	console.log(removeEmpty(data));

	let cardData = [];
	let perPage = [6, 12, 24, 60];
	Object.entries(goods).forEach(([key, val]) => {
		cardData.push(val);
	});

	cardData.pop();

	cardData = [];
	Object.entries(goods).forEach(([key, val]) => {
		cardData.push(val);
	});
	cardData.pop();
	let searchParams = '';
	searchParams = window.location.search;
	searchParams = searchParams.slice(1).split('&');
	const params = [];
	searchParams.forEach(function (key, value) {
		key = key.split('=');
		value = key[1];
		key.pop();
		key = key.join('');
		params.push({key, value});
	});
	for (const [i, el] of Object.entries(params)) {
		switch (el.key) {
			case 'year':
				cardData = cardData.filter((element) => {
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
					cardData = cardData.filter((element) => {
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
				cardData = cardData.filter((element) => {
					if (parseInt(element.manufacturer.id) === parseInt(el.value)) {
						return element;
					}
				});
				break;
			case 'brand':
				const brands = el.value.split(',');
				cardData = cardData.filter((element) => {
					if (brands.includes(element.brand.id.toString())) {
						return element;
					}
				});
				break;
			case 'model':
				cardData = cardData.filter((element) => {
					if (parseInt(element.model.id) === parseInt(el.value)) {
						return element;
					}
				});
		}
	}

	$('#products-container').empty();
	const pages = cardData.length / perPage[parseInt($('#per_page').find('option:selected').val()) - 1] > Math.round(cardData.length / perPage[parseInt($('#per_page').find('option:selected').val()) - 1]) ? Math.round(cardData.length / perPage[parseInt($('#per_page').find('option:selected').val()) - 1] + 1) : Math.round(cardData.length / perPage[parseInt($('#per_page').find('option:selected').val()) - 1]);
	const currentPage = sortedData.page ? sortedData.page : 1;
	if (cardData.length) {
		pagination();
	} else {
		$('#products-container').text('По вашему запросу ничего не найдено');
	}
	$('#sort').on('change', function () {
		cardData = sort(cardData);
	});
	function pagination() {
		cardData = sort(cardData);
		for (let i = ((currentPage - 1) * perPage[parseInt($('#per_page').find('option:selected').val()) - 1]); i <= (perPage[parseInt($('#per_page').find('option:selected').val()) - 1] * currentPage) -1 ; i++) {
			const el = cardData[i];
			if (cardData.includes(cardData[i])) {
				let template = itemCard.content.cloneNode(true);
				$(template).find('.card__image').attr({
					alt: el.image.alt,
					src: el.image.sizes['card-preview']
				});
				$(template).find('.card__brand').text(el.brand.name);
				$(template).find('.card__manufacturer').text(el.manufacturer.name);
				$(template).find('.card__year').text(el.year + ' год');
				$(template).find('.card__model').text(el.model.name);
				$(template).find('.card__price').text(() => {
					return `${el.price.currency.symbol}${(+el.price.value).toLocaleString()}`;
				});
				$('#products-container').append(template);
			}
		}
		$('.pagination').empty();
		$('.pagination').append('<a href="#" class="pagination__item"><label class="pagination__arrow--first"><input form="filter" class="form__control" name="page" type="radio" value="1">first</label></a>');
		for (let i = 1; i <= pages; i++) {
			$('.pagination').append('<a href="#" class="pagination__item"><label><input form="filter" class="form__control" name="page" type="radio" value="' + i + '">' + i + '</label></a>');
		}
		$('.pagination').append('<a href="#" class="pagination__item"><label class="pagination__arrow--last"><input form="filter" class="form__control" name="page" type="radio" value="' + pages + '">last</label></a>');
		$('.form__control').off('change').on('change', function () {
			formData();
		});
	}
}

const removeEmpty = (obj) => {
	Object.keys(obj).forEach(
		(k) =>
			(obj[k] && typeof obj[k] === 'object' && removeEmpty(obj[k])) ||
			(!obj[k] && obj[k] !== undefined && delete obj[k])
	);
	return obj;
};

function sort(cardData) {
	const val = parseInt($('#sort').find('option:selected').val());
	switch (val) {
		case 1:
			cardData.sort((a, b) => {
				return a.price.value - b.price.value;
			});
			break;
		case 2:
			cardData.sort((a, b) => {
				return b.price.value - a.price.value;
			});
			break;
		case 3:
			cardData.sort((a, b) => {
				return a.year - b.year;
			});
			break;
		case 4:
			cardData.sort((a, b) => {
				return b.year - a.year;
			});
			break;
	}
	return cardData;
}
