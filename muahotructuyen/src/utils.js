export const isJsonString = (data) => {
  try {
    JSON.parse(data);
  } catch (error) {
    return false;
  }
  return true;
};

export const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

export const renderOptions = (arr) => {
  let results = [];
  if (arr) {
    results = arr.map((opt) => {
      return {
        value: opt,
        label: opt,
      };
    });
  }
  results.push({
    label: "Thêm type",
    value: "add_type",
  });
  return results
};
export const initFacebookSDK = () => {
  if (window.FB) {
    window.FB.XFBML.parse();
  }
  let locale = "vi_VN";
  window.fbAsyncInit = function () {
    window.FB.init({
      appId: process.env.REACT_APP_FP_ID , // You App ID
      cookie: true, // enable cookies to allow the server to access the session
      xfbml: true, // parse social plugins on this page
      version: "v8.6", // use version 2.1
    });
  };
  // Load the SDK asynchronously
  (function (d, s, id) {
    console.log(s);
    var js,
      fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = `//connect.facebook.net/${locale}/sdk.js`;
    fjs.parentNode.insertBefore(js, fjs);
  })(document, "script", "facebook-jssdk");
};