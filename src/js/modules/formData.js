import $ from 'js#/lib/jquery';

export const formData = () => {
	$('.form__control').on('change', function () {
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
		let url = document.location.origin + '/?';
		for (const [key, value] of Object.entries(removeEmpty(sortedData))) {
			url += key + '=' + value + '&';
		}
		url = url.slice(0, -1);
		window.history.pushState('', document.title, url);
		$(window).trigger('popstate');
	});
};

const removeEmpty = (obj) => {
	Object.keys(obj).forEach(
		(k) =>
			(obj[k] && typeof obj[k] === 'object' && removeEmpty(obj[k])) ||
			(!obj[k] && obj[k] !== undefined && delete obj[k])
	);
	return obj;
};
