import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../Pages/HomePage/HomePage";
import Canvas from "../Pages/CanvasPage/CanvasPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />, 
        children: [
            // {path: "boby", element:<HomePage/>}
        ]
    },
    {

    }
])