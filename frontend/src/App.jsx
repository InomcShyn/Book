import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "./configs/routes";
import { ToastContainer } from "react-toastify";
import "./assets/styles/index.scss";
import { ConfigProvider } from "antd";

const router = createBrowserRouter(routes);
function App() {
  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#ffa000",
          },
        }}
      >
        <RouterProvider router={router} />
        <ToastContainer stacked />
      </ConfigProvider>
    </>
  );
}

export default App;
