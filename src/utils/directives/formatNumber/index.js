const formatNumber = {};
formatNumber.install = (Vue) => {
  /**
   * // 根据需求不断扩展
   * value格式：v-slFormatNumber="{type: 'integer', includeZero: true, obj: obj, key: key}"
   *
   * type: 格式化方式，integer（正整数）、gold（保留两位小数的金钱格式）
   * includeZero：type为integer时（可选 包含0），type为gold时（表示是否自动补位）
   * obj、key 可选 兼容对象属性可能没有更新的情况
   */
  Vue.directive("formatNumber", {
    bind(el, binding) {
      const validate = {
        init: function(param) {
          switch (param.type) {
            case "integer":
              this.setInteger(param);
              break;
            case "gold":
              this.setGold(param);
              break;
            default:
              console.log("暂不支持此格式化方式");
              break;
          }
        },
        setInteger: function(param) {
          const input$ = el.getElementsByTagName("input")[0];
          const onInput = () => {
            const valuePrev = input$.value;
            const valueNext = compare(
              param,
              formatInteger(input$.value, param)
            );
            if (valueNext !== valuePrev) {
              input$.value = valueNext;
              input$.dispatchEvent(new Event("input"));
            }
          };
          validate.addEvent(input$, ["input"], onInput);
        },
        setGold: function(param) {
          const input$ = el.getElementsByTagName("input")[0];
          const onInput = () => {
            const valuePrev = input$.value;
            const valueNext = compare(
              param,
              goldChange(input$.value, param.decimalPlaces || 2)
            );
            if (valueNext !== valuePrev) {
              input$.value = valueNext;
              input$.dispatchEvent(new Event("input"));
            }
          };
          const onChange = () => {
            const valuePrev = input$.value;
            const valueNext = compare(
              param,
              goldBlur(input$.value, param.includeZero)
            );
            if (valueNext !== valuePrev) {
              input$.value = valueNext;
              input$.dispatchEvent(new Event("input"));
            }
          };
          validate.addEvent(input$, ["input"], onInput);
          validate.addEvent(input$, ["change"], onChange);
        },
        addEvent(el, eventName, eventFn) {
          eventName.forEach(() => {
            el.addEventListener(eventName, eventFn);
          });
        },
      };
      validate.init(binding.value);
    },
  });
};

function formatInteger(value, param) {
  const reg = "/[^d]/g";
  let _value = parseInt(value.replace(reg, ""));
  _value = _value ? _value : param.includeZero && _value === 0 ? _value : "";
  return _value.toString();
}
function goldChange(v, decimalPlaces = 2) {
  let newValue = v.toString();
  let decimalPlacesReg = "^(-)*(\\d+)\\.(";
  for (let index = 0; index < decimalPlaces; index++) {
    decimalPlacesReg += "\\d";
  }
  decimalPlacesReg += ").*$";
  decimalPlacesReg = new RegExp(decimalPlacesReg);
  newValue = v
    .replace(/[^\d.]/g, "")
    .replace(/\.{2,}/g, ".")
    .replace(".", "$#$")
    .replace(/\./g, "")
    .replace("$#$", ".")
    .replace(decimalPlacesReg, "$1$2.$3");
  if (
    newValue.length > 1 &&
    newValue.indexOf(".") !== 1 &&
    newValue.indexOf("0") === 0
  ) {
    newValue = newValue.toString().substring(1);
  }

  return newValue;
}
function goldBlur(v, includeZero) {
  let nv = v.replace(/\.$/, "");
  if (!includeZero) {
    return nv;
  } else {
    if (nv.indexOf(".") === -1) {
      return nv + ".00";
    } else {
      return nv.split(".")[1].length === 1 ? nv + "0" : nv;
    }
  }
}
function compare(param, value) {
  let result = value;
  if (!isNull(param.max) && compareMax(value, param.max)) {
    if (param.compareLength) result = generateValue(value, param.max);
    else result = param.max;
  } else if (!isNull(param.min) && compareMin(value, param.min)) {
    result = param.min;
  }
  return result;
}
function generateValue(value, maxValue) {
  const _origin = parseInt(value).toString();
  const maxLength = maxValue.toString().length;
  if (_origin.length > maxLength) {
    return _origin.substr(0, maxLength);
  }
  return _origin;
}
function compareMax(origin, dest) {
  const _origin = parseInt(origin);
  return _origin >= dest;
}
function compareMin(origin, dest) {
  const _origin = parseInt(origin);
  return _origin <= dest;
}
function isNull(val) {
  return val === undefined || val === null;
}

export default formatNumber;
