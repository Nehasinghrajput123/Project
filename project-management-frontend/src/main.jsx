import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Toaster } from "react-hot-toast";



import { Provider } from "react-redux";
import { store } from "./redux/store";
ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />
    <App />
  </Provider>
);