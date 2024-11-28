import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Root from "./routes/root";
import Category from "./routes/category";
import Finish from "./routes/finish";
import ErrorPage from "./error-page";
import { MusicProvider } from "./sound/MusicContext";
import { SoundEffectsProvider } from "./sound/SoundEffectsContext";
import AudioPlayer from "./sound/AudioPlayer";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: "category",
    element: <Category />,
    errorElement: <ErrorPage />,
  },
  {
    path: "finish",
    element: <Finish />,
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MusicProvider>
      <SoundEffectsProvider>
        <AudioPlayer />
        <RouterProvider router={router} />
      </SoundEffectsProvider>
    </MusicProvider>
  </React.StrictMode>
);
