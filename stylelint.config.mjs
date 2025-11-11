const config = {
  extends: ["stylelint-config-standard"],
  plugins: ["stylelint-order"],
  rules: {
    "alpha-value-notation": "number",
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: ["tailwind"],
      },
    ],
    "value-keyword-case": null,
    "order/order": [
      "custom-properties",
      "dollar-variables",
      { type: "at-rule" },
      "declarations",
      { type: "rule" },
    ],
    "order/properties-order": [
      "position",
      "top",
      "right",
      "bottom",
      "left",
      "display",
      "align-items",
      "justify-content",
      "width",
      "height",
      "margin",
      "padding",
      "background",
      "color",
      "font",
      "border",
    ],
  },
};

export default config;
