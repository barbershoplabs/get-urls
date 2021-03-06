// 'use strict';
const URL = require('url');
const urlRegex = require('url-regex');
const normalizeUrl = require('normalize-url');

function getUrlsFromQueryParams(url) {
	const ret = new Set();

	// TODO: Use `(new URL(url)).searchParams` when targeting Node.js 8
	const qs = URL.parse(url, true).query;

  Object.keys(qs).forEach((key, i) => {
		const value = qs[key];
		if (urlRegex({exact: true}).test(value)) {
			ret.add(value);
		}
	})

	return ret;
}

module.exports = (text, options) => {
	options = options || {};

	const ret = new Set();

	const add = url => {
		ret.add(normalizeUrl(url.trim().replace(/\.+$/, ''), options));
	};

	const urls = text.match(urlRegex()) || [];
  urls.forEach(function (url) {
		add(url);

		if (options.extractFromQueryString) {
			for (const qsUrl of getUrlsFromQueryParams(url)) {
				add(qsUrl);
			}
		}
	})

	return ret;
};
