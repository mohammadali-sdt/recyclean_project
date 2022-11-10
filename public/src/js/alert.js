const createAlert = (message) => {
  const html = `<div class="alert">
                    <a class="alert__link" href="#">
                        <svg class="alert__icon">
                            <use href="/src/img/sprite.svg#icon-times"></use>
                        </svg>
                    </a>
                    <p class="alert__message">${message}</p>
                </div>`;
  document.body.insertAdjacentHTML("afterbegin", html);
  const alert = document.querySelector(".alert");
  return alert;
};

const displayAlert = (alert) => {
  alert.classList.add("alert--show");
  setTimeout(() => {
    alert.classList.remove("alert--show");
    alert.remove();
  }, 2000);
};

export const showSuccessAlert = (message) => {
  const alert = createAlert(message);
  alert.classList.add("alert--success");
  displayAlert(alert);
};

export const showDangerAlert = (message, top) => {
  const alert = createAlert(message);
  alert.classList.add("alert--danger");
  alert.style.top = top ? top + "rem" : "5%";
  displayAlert(alert);
};
