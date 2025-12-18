import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { MotiaStreamProvider } from "@motiadev/stream-client-react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MotiaStreamProvider address="ws://localhost:3000">
      <App />
    </MotiaStreamProvider>
  </StrictMode>,
);
