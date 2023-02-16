const hostApi = process.env.NODE_ENV === "development" ? "http://localhost" : "https://api.dealermasters.com";
const portApi = process.env.NODE_ENV === "development" ? 80 : 443;
const baseURLApi = `${hostApi}${portApi ? `:${portApi}` : ``}`;
const media_base_url = process.env.NODE_ENV === "development" ? "http://d2ztewo589hjnx.cloudfront.net/" : "https://media.dealermasters.com/"
console.log(baseURLApi, process.env)
const redirectUrl = process.env.NODE_ENV === "development" ? "http://localhost:3000/sing-app-react" : "https://demo.flatlogic.com/sing-app-react";

export default {
  media_base_url,
  redirectUrl,
  hostApi,
  portApi,
  baseURLApi,
  remote: "https://sing-generator-node.herokuapp.com",
  isBackend: process.env.REACT_APP_BACKEND,
  auth: {
    email: 'admin@flatlogic.com',
    password: 'password'
  },
  app: {
    colors: {
      dark: "#0a3452",
      light: "#FFFFFF",
      sea: "#004472",
      sky: "#E9EBEF",
      wave: "#D1E7F6",
      rain: "#CCDDE9",
      middle: "#D7DFE6",
      black: "#13191D",
      salat: "#21AE8C",
    },
  }
};
