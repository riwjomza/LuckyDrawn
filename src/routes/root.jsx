import { createBrowserRouter } from "react-router-dom";
import LuckyDraw from "../pages/lucky-draw";
import Report from "../pages/report";

const router = createBrowserRouter([
    {
        path:"/",
        element: <LuckyDraw/>    
    },
    {
        path:"/report",
        element: <Report/>
    }
],);

export default router ;