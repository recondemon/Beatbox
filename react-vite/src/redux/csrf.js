export async function post(url, reqBody = {}) {
  const adjustedUrl = url.includes("api") ? url : "/api" + url;
  const formData = new FormData();
  let body = formData;
  const headers = {};
  if (!Object.keys(reqBody).includes("file")) {
    body = JSON.stringify(reqBody);
    headers["Content-Type"] = "application/json";
  } else {
    for (const key of Object.keys(reqBody)) {
      formData.append(key, reqBody[key]);
    }
  }

  const data = await fetch(
    adjustedUrl,
    headers["Content-Type"]
      ? {
          method: "POST",
          body,
          headers,
        }
      : { method: "POST", body }
  );
  const json = await data.json();
  if (data.ok) {
    return json;
  }
  throw json;
}

export async function get(url) {
  const adjustedUrl = url.includes("api") ? url : "/api" + url;
  const data = await fetch(adjustedUrl);
  const json = await data.json();
  if (data.ok) {
    return json;
  }
  throw json;
}

export async function put(url, reqBody = {}) {
  const adjustedUrl = url.includes("api") ? url : "/api" + url;
  const formData = new FormData();
  let body = formData;
  const headers = {};
  if (!Object.keys(reqBody).includes("file")) {
    body = JSON.stringify(reqBody);
    headers["Content-Type"] = "application/json";
  } else {
    for (const key of Object.keys(reqBody)) {
      formData.append(key, reqBody[key]);
    }
  }

  const data = await fetch(
    adjustedUrl,
    headers["Content-Type"]
      ? {
          method: "PUT",
          body,
          headers,
        }
      : { method: "PUT", body }
  );
  const json = await data.json();
  if (data.ok) {
    return json;
  }
  throw json;
}

export async function del(url) {
  const adjustedUrl = url.includes("api") ? url : "/api" + url;
  const data = await fetch(adjustedUrl, { method: "DELETE" });
  const json = await data.json();
  console.log("DELETED DATA: ", json);
  if (data.ok) {
    return json;
  }
  throw json;
}
