import myDefault from "./global-module-es";

var MyVariable = myDefault.foo + '100';

export { default } from "./global-module-es";
export * from "./global-module-es";
