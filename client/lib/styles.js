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

export const bgPrimary = "#fff";
export const bgSecondary = "#171717";

export const linkColor = "#b366f9";
export const linkColorHover = "#fff";

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
        --bg-overlay: rgba(255, 255, 255, 0.5);

        --line-height: 1.5;
        --line-height-em: 1.5rem;

        --font-default: ${noto_sans.style.fontFamily};
        --font-title: ${noto_sans.style.fontFamily};
        --font-title-color: ${linkColor};
      }

      html,
      body {
        padding: 0.5rem;
        max-width: 980px;
        margin: 0 auto;

        font-family: var(--font-default);
        font-weight: 400;
        font-size: var(--text-size);
        line-height: 1;

        background: var(--bg-primary);
        color: #555463;
        color: var(--text-color);

        background: #111827;
        color: #fff;

        * {
          box-sizing: border-box;
        }

        a {
          color: var(--link-color);
          text-decoration: none;
          outline: none;
        }

        a:hover {
          color: var(--link-color-hover);
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
          line-height: 1.25em;
          user-select: none;
        }

        input,
        textarea {
          margin: 0;
          padding: 0.5rem 0.75rem;
          width: 100%;
          line-height: 1rem;
          background: #242424;
          border: 2px solid #7627c0;
          border-radius: 0.5rem;
          font-size: 1rem;
          box-shadow: none;
          color: #fff;

          ::placeholder {
            color: #8a8a8a;
          }

          :focus {
            outline: none;
            outline-offset: 0;
            border: 2px solid #b366f9;
          }
        }

        input:focus-within,
        textarea:focus-within {
          outline: none;
        }

        button {
          padding: 0.5rem 0.75rem;
          line-height: 1rem;
          background: #242424;
          border: 2px solid #7627c0;
          border-radius: 0.5rem;
          font-size: 1rem;
          box-shadow: none;
          color: #fff;

          :hover {
            border: 2px solid #b366f9;
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
