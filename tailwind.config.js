import defaultTheme from "tailwindcss/defaultTheme";

export default {
  theme: {
    extend: {
      colors: {
        "neu-green": '#DAEE01',
        "neu-green-light": "#b3d9ad",
        "neu-yellow-light": "#f5efd5",
        "neu-yellow": "#ffbf36",
      },
      boxShadow: {
        "glow-green": "0 0px 20px 5px rgba(74, 222, 12, 0.5)",
        "neu-black": "5px 5px 0px 0px rgba(00, 00, 00, 1)",
        "neu-border": "4px 4px 0px rgba(00, 00, 00, 1)",
      },
      dropShadow: {
        "neu-border": ["-1px -1px 0px rgba(00, 00, 00, 1)","2px -1px 0px rgba(00, 00, 00, 1)","2px 2px 0px rgba(00, 00, 00, 1)","-1px 2px 0px rgba(00, 00, 00, 1)",]
      }
    },
  },
};
