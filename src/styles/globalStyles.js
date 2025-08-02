import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Inter', sans-serif !important;
  }

  
:root {
  line-height: 1.5;
  font-weight: 400;
  color-scheme: light dark;
  color: #ffffff;
  background-color: #000000;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  --bg-shaded: #212121;

  --bg-shaded: #303030;

  

  --border-shaded: rgba(255, 255, 255, 0.2);
  /* --border-shaded: #e1e1e1 */
  --bg-shaded-dark: rgba(0, 0, 0, 0.08);

  --text-light-shaded: #ced4da;
  --text-dark-shaded: rgba(0, 0, 0, 0.4);

  --fs-secondary: 13px;
  --fs-s: 10px;
  --fs-m: 11px;
  --fs-l: 12px;
  --fs-xl: 14px;

  --radius: 15px;

  --primary-el-height: 45px;
}

*,
*::before,
*::after {
  -webkit-tap-highlight-color: transparent;
  -webkit-focus-ring-color: transparent;
}

::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

::-webkit-scrollbar-thumb {
  background-color: var(--bg-shaded);
  border-radius: 4px;
}

button {
  cursor: pointer;
}

a {
  text-decoration: none;
}

`;

export default GlobalStyles;
