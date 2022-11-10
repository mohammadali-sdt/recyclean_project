import axios from "axios";
import { showDangerAlert, showSuccessAlert } from "./alert";

export const sendAjaxRequest = async function ({
  method,
  url,
  success_message,
  body = {},
  redirect_url = "/",
}) {
  try {
    const res = await axios({
      method,
      url,
      data: body,
    });
    const { data } = res;
    console.log(data);
    if (data.status !== "success") {
      console.log(data.message);
      showDangerAlert(data.message);
      return;
    }
    showSuccessAlert(success_message);
    setTimeout(() => {
      if (redirect_url === "refresh") {
        location.reload();
        return true;
      }
      location.replace(redirect_url);
    }, 1000);
  } catch (err) {
    console.log(err);
    const { data } = err.response;
    if (data.status === "fail" || data.status === "error") {
      if (typeof data.message === "string") {
        showDangerAlert(data.message);
        return;
      }
      data.message.forEach((msg, i) => showDangerAlert(msg, (i + 1) * 7));
    }
  }
};
