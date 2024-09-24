import Cookies from 'js-cookie';

export async function csrfFetch(url, options = {}) {
  options.method = options.method || 'GET';
  options.headers = options.headers || {};
  if (options.method.toUpperCase() !== 'GET') {
    options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/json';
    options.headers['XSRF-Token'] = Cookies.get('csrf_token');
  }
  const res = await fetch(url, options);
  if (res.status >= 400) throw res;
  return res;
}

export function restoreCSRF() {
  return csrfFetch('/api/csrf/restore');
}

export async function post(url, reqBody = {}) {
  const adjustedUrl = url.includes('api') ? url : '/api' + url;
  const data = await csrfFetch(adjustedUrl, { method: 'POST', body: JSON.stringify(reqBody) });
  const json = await data.json();
  if (data.ok) {
    return json, data;
  }
  throw json;
}

export async function get(url) {
  const adjustedUrl = url.includes('api') ? url : '/api' + url;
  const data = await csrfFetch(adjustedUrl);
  const json = await data.json();
  if (data.ok) {
    return json, data;
  }
  throw json;
}

export async function put(url, reqBody = {}) {
  const adjustedUrl = url.includes('api') ? url : '/api' + url;
  const data = await csrfFetch(adjustedUrl, { method: 'PUT', body: reqBody });
  const json = await data.json();
  if (data.ok) {
    return json, data;
  }
  throw json;
}

export async function del(url) {
  const adjustedUrl = url.includes('api') ? url : '/api' + url;
  const data = await csrfFetch(adjustedUrl, { method: 'DELETE' });
  const json = await data.json();
  if (data.ok) {
    return json, data;
  }
  throw json;
}
