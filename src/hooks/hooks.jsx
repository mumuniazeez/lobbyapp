const useAlert = (msg = "This is an alert", type = "primary") => {
  let container = document.createElement("div");
  let alertHTML = `
    <div class="alert alert-${type} alert-dismissible fade show mt-3 " role="alert">
    ${msg}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
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

const usePrompt = (
  msgTitle = "This is an prompt",
  msgContent = "this is the content",
  btnType1 = "danger",
  btnText1 = "Okay",
  cb1 = () => {},
  btnType2 = "primary",
  btnText2 = "Cancel",
  cb2 = () => {}
) => {
  let container = document.createElement("div");

  let promptHTML = `
  <div class="modal fade" id="promptBox" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="promptBox"  aria-modal="true" role="dialog">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="promptBox">${msgTitle}</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="upCloseBtn"></button>
      </div>
      <div class="modal-body">
        <p>${msgContent}</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-${btnType2}" data-bs-dismiss="modal" id="closeBtn">${btnText2}</button>
        <button type="button" class="btn btn-${btnType1}" data-bs-dismiss="modal" id="funcBtn">${btnText1}</button>
      </div>
    </div>
  </div>
</div>`;
  container.innerHTML = promptHTML;

  let modalContainer = document.querySelector("#modalContainer");
  if (modalContainer) {
    modalContainer.appendChild(container);
    let promptModal = document.querySelector("#promptBox"),
      upCloseBtn = document.querySelector("#upCloseBtn"),
      closeBtn = document.querySelector("#closeBtn"),
      funcBtn = document.querySelector("#funcBtn"),
      launchModalBtn = document.createElement("button");
    launchModalBtn.type = "button";
    launchModalBtn.style.display = "none";
    launchModalBtn.dataset.bsToggle = "modal";
    launchModalBtn.dataset.bsTarget = "#promptBox";
    upCloseBtn.onclick = cb2;
    closeBtn.onclick = cb2;
    funcBtn.onclick = cb1;

    modalContainer.appendChild(launchModalBtn);
    promptModal.addEventListener("hidden.bs.modal", () => {
      container.remove();
      launchModalBtn.remove();
    });

    launchModalBtn.click();
  } else {
    setTimeout(() => {
      usePrompt(
        msgTitle,
        msgContent,
        btnType1,
        btnText1,
        cb1,
        btnType2,
        btnText2,
        cb2
      );
    }, 500);
  }
};

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
    mode: "no-cors",
  };

  fetch(`https://lobbyserver.vercel.app${endpoint}`, option)
    .then((res) => res.json())
    .then((data) => {
      state(data);
    })
    .catch((err) => {
      usePrompt(
        "Unable to connect to server",
        `An error occurred while connecting to server, please try again or restart the page.
        <hr/>
        <small class="text-secondary">${err}</small>
        `,
        "primary",
        "Try again",
        () => {
          useServer(endpoint, method, state, body);
        },
        "primary",
        "Restart page",
        () => {
          location.reload();
        }
      );

      console.log(err);
    });
};

export { useServer, useAlert, usePrompt };
