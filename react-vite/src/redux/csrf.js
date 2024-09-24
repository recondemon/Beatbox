export async function post(url, reqBody = {}) {
  const adjustedUrl = url.includes("api") ? url : "/api" + url;
  const formData = new FormData();
  for (const key in reqBody) {
    formData.append(key, reqBody[key]);
  }
  const data = await fetch(adjustedUrl, {
    method: "POST",
    body: formData,
  });
  const json = await data.json();
  if (data.ok) {
    return json, data;
  }
  throw json;
}

export async function get(url) {
  const adjustedUrl = url.includes("api") ? url : "/api" + url;
  const data = await fetch(adjustedUrl);
  const json = await data.json();
  if (data.ok) {
    return json, data;
  }
  throw json;
}

export async function put(url, reqBody = {}) {
  const adjustedUrl = url.includes("api") ? url : "/api" + url;
  const formData = new FormData();
  for (const key in reqBody) {
    formData.append(key, reqBody[key]);
  }

  const data = await fetch(adjustedUrl, {
    method: "POST",
    body: formData,
  });
  const json = await data.json();
  if (data.ok) {
    return json, data;
  }
  throw json;
}

export async function del(url) {
  const adjustedUrl = url.includes("api") ? url : "/api" + url;
  const data = await fetch(adjustedUrl, { method: "DELETE" });
  const json = await data.json();
  if (data.ok) {
    return json, data;
  }
  throw json;
}
