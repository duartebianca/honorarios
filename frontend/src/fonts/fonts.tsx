// src/fonts.tsx
import { Global } from "@emotion/react";

export const Fonts = () => (
  <Global
    styles={`
    @import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap');
    @font-face {
        font-family: 'Higuen Elegant Serif';
        src: url('/fonts/Higuen-Regular.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
    }
    `}
  />
);
