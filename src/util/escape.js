import { isEmpty } from "../validation/is-empty";
import Validator from "validator";

export const re = /^[0-9\\p{L} _\\.]+$/g;
export const symbols = /[-[\]{}()*+?.,\\^$|#\s]/g;
export const escape = (input, re_b, symbol_b) => {
  let str = input;

  if (!str || isEmpty(str) || Validator.isEmpty(str)) return;

  if (re_b) {
    str = str.replace(re, "");
  }

  if (symbol_b) {
    str = str.replace(symbol_b, "");
  }

  return str;
};
