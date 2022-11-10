// GLOBAL SCRIPT
import { showDangerAlert } from "./alert";

const themeBtn = document.querySelector(".theme");

const mode = localStorage.getItem("mode");
if (mode === "dark") {
  document.body.classList.add("dark-theme");
} else {
  localStorage.setItem("mode", "light");
  document.body.classList.remove("dark-theme");
}

themeBtn.addEventListener("click", function () {
  const theme = localStorage.getItem("mode");
  switch (theme) {
    case "light":
      document.body.classList.add("dark-theme");
      localStorage.setItem("mode", "dark");
      return;
    case "dark":
      document.body.classList.remove("dark-theme");
      localStorage.setItem("mode", "light");
      return;
  }
});

const burgerBtn = document.body.querySelector(".nav__burger");

const closeBtn = document.querySelector(".menu__close");

const menu = document.querySelector(".menu");

if (burgerBtn && menu && closeBtn) {
  burgerBtn.addEventListener("click", function (e) {
    e.preventDefault();
    menu.classList.add("menu--show");
  });
  closeBtn.addEventListener("click", function (e) {
    e.preventDefault();
    menu.classList.remove("menu--show");
  });
}

// END GLOBAL SCRIPT

import { sendAjaxRequest } from "./sendRequest";

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const form = new FormData(this);
    const username = form.get("username");
    const password = form.get("password");
    sendAjaxRequest({
      method: "POST",
      url: "/api/auth/login",
      body: {
        username,
        password,
      },
      success_message: "You Logged In Successfully.",
      redirect_url: "/home",
    });
  });
}

const logoutBtn = document.getElementById("logout");
if (logoutBtn) {
  logoutBtn.addEventListener("click", function (e) {
    e.preventDefault();
    sendAjaxRequest({
      method: "GET",
      url: "/api/auth/logout",
      success_message: "You Logged Out Successfully.",
    });
  });
}

const signupUser = function (url, redirect_url) {
  const form = new FormData(this);
  const username = form.get("username");
  const password = form.get("password");
  const passwordConfirm = form.get("password2");
  const phone = form.get("phone");
  sendAjaxRequest({
    method: "POST",
    url,
    body: {
      username,
      password,
      passwordConfirm,
      phone,
    },
    success_message: "You SignUp Successfully.",
    redirect_url,
  });
};

const clientSignupForm = document.getElementById("clientSignupForm");
if (clientSignupForm) {
  clientSignupForm.addEventListener("submit", function (e) {
    e.preventDefault();
    signupUser.call(this, "/api/auth/signup", "client/add/address");
  });
}

const companySignupForm = document.getElementById("companySignupForm");
if (companySignupForm) {
  companySignupForm.addEventListener("submit", function (e) {
    e.preventDefault();
    signupUser.call(this, "/api/auth/company/signup", "/home");
  });
}

const getAddressFormFields = (form) => {
  const city = form.get("city");
  const street = form.get("street");
  const plaque = form.get("plaque");
  return { city, street, plaque };
};

const addAddressForm = document.getElementById("addAddressForm");
if (addAddressForm) {
  addAddressForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const form = new FormData(this);
    const addressFields = getAddressFormFields(form);
    const redirect = form.get("redirect");
    const redirect_url = redirect ? redirect : "/home";
    sendAjaxRequest({
      method: "POST",
      url: "/api/client/address",
      body: {
        ...addressFields,
      },
      success_message: "Address Added Successfully.",
      redirect_url,
    });
  });
}
const getMaterialsFormFields = (form) => {
  const material = form.get("material");
  const unitPrice = form.get("unitPrice");
  return {
    material,
    unitPrice,
  };
};
const addMaterialForm = document.getElementById("addMaterialForm");
if (addMaterialForm) {
  addMaterialForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const form = new FormData(this);
    const materialsFields = getMaterialsFormFields(form);
    sendAjaxRequest({
      method: "POST",
      url: "/api/company/add/material",
      body: {
        ...materialsFields,
      },
      success_message: "Material Added Successfully.",
      redirect_url: "/panel/materials",
    });
  });
}

// Show Next fields in form
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");
if (nextBtn) {
  const fieldsOfForm = document.querySelectorAll(".form__field");
  const displayFields = (e) => {
    e.preventDefault();
    fieldsOfForm.forEach((field) => {
      field.classList.toggle("form__field--hidden");
    });
  };
  nextBtn.addEventListener("click", function (e) {
    displayFields(e);
  });

  prevBtn.addEventListener("click", function (e) {
    displayFields(e);
  });
}

const submitOrderForm = document.getElementById("submitOrderForm");
if (submitOrderForm) {
  submitOrderForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const form = new FormData(this);
    const paper = form.get("paper");
    const metal = form.get("metal");
    const plastic = form.get("plastic");
    const glass = form.get("glass");
    const electric = form.get("electric");
    const address = form.get("address");
    if (!(paper || metal || plastic || glass || electric)) {
      showDangerAlert("Please Select One Material.");
      return false;
    } else if (!address) {
      showDangerAlert("Please Select Address.");
      return false;
    }
    sendAjaxRequest({
      method: "POST",
      url: "/api/client/submit/order",
      body: {
        materials: [paper, metal, plastic, glass, electric].filter(Boolean),
        address,
      },
      success_message: "Order Submitted Successfully.",
      redirect_url: "/home",
    });
  });
}

const cashMoneyForm = document.getElementById("cashMoneyForm");
if (cashMoneyForm) {
  cashMoneyForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const form = new FormData(this);
    const creditCard = form.get("card");
    const money = form.get("money");
    if (!Number(creditCard) || creditCard.length < 16) {
      showDangerAlert("Invalid Credit Card.");
    }
    if (!Number(money)) {
      showDangerAlert("Invalid Cash.");
    }
    sendAjaxRequest({
      url: "/api/client/cash/money",
      method: "POST",
      body: {
        card: creditCard,
        money,
      },
      success_message: "Your request has been registered.",
      redirect_url: "/home",
    });
  });
}

const addAgentForm = document.getElementById("addAgentForm");
if (addAgentForm) {
  addAgentForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const form = new FormData(this);
    const firstname = form.get("firstname");
    const lastname = form.get("lastname");
    const username = form.get("username");
    const phone = form.get("phone");
    const password = form.get("password");
    const passwordConfirm = form.get("password2");
    const city = form.get("city");
    const street = form.get("street");
    const plaque = form.get("plaque");
    sendAjaxRequest({
      method: "POST",
      url: "/api/admin/add/agent",
      body: {
        firstname,
        lastname,
        username,
        phone,
        password,
        passwordConfirm,
        city,
        street,
        plaque,
      },
      success_message: "Agent Added Successfully.",
      redirect_url: "/panel/agents",
    });
  });
}

const usersSection = document.querySelector(".users");
if (usersSection) {
  usersSection.addEventListener("click", function (e) {
    e.preventDefault();
    const deleteUserBtn = e.target.closest(".btn--delete");
    if (deleteUserBtn) {
      const { user } = deleteUserBtn.dataset;
      sendAjaxRequest({
        method: "DELETE",
        url: "/api/admin/delete/user",
        body: {
          user,
        },
        success_message: "User Deleted Successfully",
        redirect_url: "refresh",
      });
    }
  });
}

const userProfileForm = document.getElementById("userProfileForm");
if (userProfileForm) {
  userProfileForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const form = new FormData(this);
    const username = form.get("username");
    const firstname = form.get("firstname");
    const lastname = form.get("lastname");
    const phone = form.get("phone");
    sendAjaxRequest({
      method: "PATCH",
      url: "/api/auth/user/profile",
      body: {
        username,
        firstname,
        lastname,
        phone,
      },
      success_message: "Your Profile Updated Successfully.",
      redirect_url: "refresh",
    });
  });
}

const changePasswordForm = document.getElementById("changePasswordForm");
if (changePasswordForm) {
  changePasswordForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const form = new FormData(this);
    const password = form.get("oldPassword");
    const newPassword = form.get("newPassword");
    const newPasswordConfirm = form.get("newPassword2");
    sendAjaxRequest({
      method: "PATCH",
      url: "/api/auth/user/password",
      body: {
        password,
        newPassword,
        newPasswordConfirm,
      },
      success_message: "Your Password Changed Successfully.",
      redirect_url: "refresh",
    });
  });
}

const editAddressForm = document.getElementById("editAddressForm");
if (editAddressForm) {
  editAddressForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const form = new FormData(this);
    const { address } = this.dataset;
    const { user } = this.dataset;
    const addressFields = getAddressFormFields(form);
    sendAjaxRequest({
      method: "PATCH",
      url:
        user === "client"
          ? `/api/client/address/${address}`
          : `/api/agent/address`,
      body: {
        ...addressFields,
      },
      success_message: "Your Address Edited Successfully.",
      redirect_url: user === "client" ? "/panel/addresses" : "/panel/address",
    });
  });
}

const addressesSection = document.querySelector(".addresses");
if (addressesSection) {
  addressesSection.addEventListener("click", function (e) {
    const deleteBtn = e.target.closest(".btn--delete");
    if (deleteBtn) {
      e.preventDefault();
      const { address } = deleteBtn.dataset;
      sendAjaxRequest({
        method: "DELETE",
        url: `/api/client/address/${address}`,
        success_message: "Address Deleted Successfully.",
        redirect_url: "refresh",
      });
    }
    return false;
  });
}

const editMaterialForm = document.getElementById("editMaterialForm");
if (editMaterialForm) {
  editMaterialForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const form = new FormData(this);
    const materialsFields = getMaterialsFormFields(form);
    const { material } = this.dataset;
    sendAjaxRequest({
      method: "PATCH",
      url: `/api/company/material/${material}`,
      body: {
        ...materialsFields,
      },
      success_message: "Material Edited Successfully.",
      redirect_url: "/panel/materials",
    });
  });
}

const materialsSection = document.querySelector(".materials-section");
if (materialsSection) {
  materialsSection.addEventListener("click", function (e) {
    const deleteMaterialBtn = e.target.closest(".btn--delete");
    if (deleteMaterialBtn) {
      e.preventDefault();
      const { material } = deleteMaterialBtn.dataset;
      sendAjaxRequest({
        method: "DELETE",
        url: `/api/company/material/${material}`,
        success_message: "Material Deleted Successfully.",
        redirect_url: "refresh",
      });
    }
    return false;
  });
}

const deliverOrderForm = document.getElementById("deliverOrderForm");
if (deliverOrderForm) {
  deliverOrderForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const form = new FormData(this);
    const paper = form.get("paper");
    const metal = form.get("metal");
    const plastic = form.get("plastic");
    const glass = form.get("glass");
    const electric = form.get("electric");
    const materials = {
      paper,
      metal,
      plastic,
      glass,
      electric,
    };
    console.log(materials);
    for (const type of Object.keys(materials)) {
      if (materials[type]) {
        if (!Number(materials[type])) {
          showDangerAlert(
            `${type[0].toUpperCase() + type.slice(1)} invalid value: ${
              materials[type]
            }.`
          );
          return false;
        } else {
          materials[type] = Number(materials[type]);
        }
      } else {
        delete materials[type];
      }
    }

    const { order } = this.dataset;

    sendAjaxRequest({
      method: "POST",
      url: `/api/agent/deliver/order/${order}`,
      body: {
        materials,
      },
      success_message: "Order Delivered Successfully.",
      redirect_url: "/home",
    });
  });
}

const deleteOrderBtn = document.getElementById("deleteOrderBtn");
if (deleteOrderBtn) {
  deleteOrderBtn.addEventListener("click", function (e) {
    e.preventDefault();
    const { order } = this.dataset;
    sendAjaxRequest({
      method: "DELETE",
      url: `/api/client/delete/order/${order}`,
      success_message: "Order deleted successfully.",
      redirect_url: "/home",
    });
  });
}
