import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { updateMetaTags, updatePreconnectLinks } from "./utils/seo";

// Initialize dynamic meta tags and preconnect links
updateMetaTags({});
updatePreconnectLinks();

createRoot(document.getElementById("root")!).render(<App />);
