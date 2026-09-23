/** @type {import("stylelint").Config} */
export default {
  extends: ["stylelint-config-standard"],
  rules: {
    "at-rule-no-unknown": [true, { ignoreAtRules: ["mixin"] }],
    "at-rule-prelude-no-invalid": [true, { ignoreAtRules: ["mixin"] }],
  },
}
