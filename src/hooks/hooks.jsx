const useServer = (
  endpoint = "",
  method = "GET",
  state = (res) => {},
  body = null
) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("authorization", localStorage.token);

  const option = {
    method,
    headers: myHeaders,
    body: body ? JSON.stringify(body) : null,
    redirect: "follow",
  };

  fetch(`http://localhost:3000${endpoint}`, option)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (typeof data.message == "string") {
        useAlert(data.message);
      }
      state(data);
    })
    .catch((err) => {
      console.log(err);
      state(err);
    });
};

const useAlert = (msg = "This is an alert", type = "primary") => {
  let container = document.createElement("div");
  let alertHTML = `
    <div className="alert alert-${type} alert-dismissible fade show mt-3 " role="alert">
    ${msg}
    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
  container.innerHTML = alertHTML;

  let alertContainer = document.querySelector("#alertContainer");
  if (alertContainer) {
    alertContainer.appendChild(container);
    setTimeout(() => {
      container.remove();
    }, 5000);
  } else {
    setTimeout(() => {
      useAlert(msg);
    }, 500);
  }
};

export { useServer, useAlert };
