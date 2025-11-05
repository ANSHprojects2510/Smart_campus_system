
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import store from "./Redux/store";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

import { GoogleOAuthProvider } from "@react-oauth/google";

// ✅ Your Google OAuth Client ID
const clientId = "260124459593-hb0bmkr0a6atfbqotlo2kit3c1p7vqff.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={clientId}>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </GoogleOAuthProvider>
);
