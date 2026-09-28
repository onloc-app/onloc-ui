/** @type {import("stylelint").Config} */
export default {
  extends: ["stylelint-config-standard", "stylelint-config-recess-order"],
  rules: {
    "at-rule-no-unknown": [true, { ignoreAtRules: ["mixin"] }],
    "at-rule-prelude-no-invalid": [true, { ignoreAtRules: ["mixin"] }],
  },
}
