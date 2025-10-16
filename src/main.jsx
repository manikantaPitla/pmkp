import { createRoot } from "react-dom/client";
import store from "./app/store.js";
import "react-loading-skeleton/dist/skeleton.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GlobalStyles />
    <SkeletonTheme baseColor="#f1f1f1" highlightColor="#444">
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </SkeletonTheme>
  </StrictMode>
);
