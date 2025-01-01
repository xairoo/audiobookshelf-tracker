import { css, Global } from "@emotion/react";
import { Noto_Sans } from "next/font/google";

const noto_sans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-noto-sans",
});

export const colorActive = "#5711ee";

export const textColor = "#fff";
export const textColorSecondary = "#c1c1c1";

export const bgPrimary = "#111827";
export const bgSecondary = "#1a1c22";

export const linkColor = "#b366f9";
export const linkColorHover = "#fff";

export const inputBackground = "#151515";
export const inputBackgroundFocus = "#1f1e1e";
export const inputBorderColor = "#242424"; // #7627c0
export const inputBorderColorFocus = "#b366f9";

export const GlobalStyles = (
  <Global
    styles={css`
      :root {
        --color-active: ${colorActive};

        --text-size: 16px;
        --text-color: ${textColor};
        --text-color-secondary: ${textColorSecondary};

        --link-color: ${linkColor};
        --link-color-hover: ${linkColorHover};

        --bg-primary: ${bgPrimary};
        --bg-secondary: ${bgSecondary};
        --bg-overlay: rgba(17, 24, 39, 0.75);

        --line-height: 1.5;
        --line-height-em: 1.5rem;

        --font-default: ${noto_sans.style.fontFamily};
        --font-title: ${noto_sans.style.fontFamily};
        --font-title-color: ${linkColor};

        --input-background: ${inputBackground};
        --input-background-focus: ${inputBackgroundFocus};
        --input-border-color: ${inputBorderColor};
        --input-border-color-focus: ${inputBorderColorFocus};
      }

      html {
        font-family: var(--font-default);
        font-weight: 400;
        font-size: var(--text-size);
        line-height: var(--line-height);

        background: var(--bg-primary);
        color: var(--text-color);
      }

      body {
        /* https://github.com/tailwindlabs/headlessui/issues/762 */
        padding: 0.5rem !important;
        overflow-y: scroll !important;

        max-width: 980px;
        margin: 0 auto;

        * {
          box-sizing: border-box;
        }

        a {
          color: var(--link-color);
          text-decoration: none;
          outline: none;

          &:hover {
            color: var(--link-color-hover);
          }
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-family: var(--font-title);
          font-size: 2.375rem;
          font-weight: 400;
          margin: 1rem;
          color: var(--text-color);
          text-align: center;
          line-height: var(--line-height);
          user-select: none;
        }

        input,
        textarea {
          margin: 0;
          padding: 0.25rem 0.5rem;
          width: 100%;
          line-height: var(--line-height);
          background: var(--input-background);
          border: 2px solid var(--input-border-color);
          border-radius: 0.5rem;
          font-size: 1rem;
          box-shadow: none;
          color: var(--text-color);
          transition: all ease-in-out 0.1s;

          ::placeholder {
            color: #7a7a7a;
          }

          &:focus {
            outline: none;
            outline-offset: 0;
            border: 2px solid var(--input-border-color-focus);
            background-color: var(--input-background-focus);
          }
        }

        input:focus-within,
        textarea:focus-within {
          outline: none;
        }

        button {
          padding: 0.25rem 0.5rem;
          line-height: var(--line-height);
          background: var(--input-background);
          border: 2px solid var(--input-border-color);
          border-radius: 0.5rem;
          font-size: 1rem;
          box-shadow: none;
          color: var(--text-color);
          transition: all ease-in-out 0.1s;

          &:hover {
            border: 2px solid var(--input-border-color-focus);
            background-color: var(--input-background-focus);
          }
        }

        u {
          text-decoration: underline;
          text-decoration-line: underline;
          text-decoration-thickness: 2px;
          text-underline-offset: 2px;
          text-decoration-color: var(--bg-colored);
        }

        strong {
          font-weight: 600;
        }
      }
    `}
  />
);
