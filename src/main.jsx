import { createRoot } from "./lib/react-dom/ReactDOM.js"
import App from "./App.jsx";
const root = createRoot(document.getElementById('root'));

root.render(
  <App id="hello" />
)
