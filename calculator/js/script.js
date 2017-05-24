new Vue({
  el: "#calculator",
  data: {
    displayValue: "0",
    currentOperator: "",
    waitingForOperand: true,
    canClear: false,
    calculation: ["0"],
    tempCalculation: []
  },
  computed: {
    displayValueFormatted: function () {
      var value = this.displayValue.replace(/e\+/, 'e') || '0';
      var number = value.split(".");
      var integerPart = number[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      var floatPart = number[1] || '';
      if (this.waitingForOperand && number.length === 2) {
        return integerPart + '.' + floatPart;
      } else {
        return floatPart === '' ? integerPart : integerPart + '.' + floatPart;
      }
    }
  },
  methods: {
    inputDigit: function (digit) {
      var length = this.calculation.length;

      this.canClear = true;

      if (this.waitingForOperand) {
        if (this.displayValue === "0") {
          // Check digit is "."
          if (digit === ".") {
            this.displayValue = "0.";
          } else {
            this.displayValue = digit;
          }

          this.calculation[length - 1] += digit;
        } else {
          // Add digit to current number, maximum digits is 9
          if (this.displayValue.length < 9) {
            // Only allow one "."
            if (digit === "." && this.displayValue.indexOf(".") !== -1) return;

            this.displayValue += digit;
            this.calculation[length - 1] += digit;
          }
        }
      } else {
        // Display new number
        this.displayValue = digit;
        this.waitingForOperand = true;

        // Add operator and digit to the calculation
        if (this.currentOperator !== '=') {
          this.calculation.push(this.currentOperator);
          this.calculation.push(digit);
        } else {
          this.calculation = [digit];
        }
      }
    },
    inputOperator: function (operator) {
      var length = this.calculation.length;
      var currentOperator = this.currentOperator;

      if ((operator === "-" || operator === "+") && length > 2) {
        this.displayValue = eval(this.calculation.join("")).toString();
      } else if (operator === "=") {
        if (length === 1 && currentOperator) {
          // If the calculation only has 1 number, calculate itself with current operator
          this.displayValue = eval(this.calculation[0] + currentOperator + this.calculation[0]);
        } else if (currentOperator === '=') {
          // If current operator is "=", continue calculate the last calculation
          this.displayValue = eval(
            this.displayValue +
            this.calculation[length - 2] +
            this.calculation[length - 1]
          ).toString();
        } else {
          this.displayValue = eval(this.calculation.join("")).toString();
        }
      }

      this.currentOperator = operator;
      this.waitingForOperand = false;

      // Round to 9 digits
      this.displayValue = (+(+this.displayValue).toFixed(8)).toPrecision(9);

      // Remove insignificant trailing zeros of float number
      var value = this.displayValue;
      if (value[value.length - 1] === '0') this.displayValue = parseFloat(value).toString();

      // Display "Error" instead of "Infinity"
      if (value === "Infinity") this.displayValue = "Error";
    },
    clear: function () {
      // Reset current number
      this.canClear = false;
      this.displayValue = '0';

      var length = this.calculation.length;
      if (this.waitingForOperand) {
        this.calculation[length - 1] = '0';
      }
    },
    clearAll: function () {
      // Reset the calculation
      this.displayValue = "0";
      this.currentOperator = "";
      this.waitingForOperand = true;
      this.calculation = ["0"];
      this.tempNumber = '';
    },
    changeSign: function () {
      if (this.displayValue.indexOf('-') === 0) {
        this.displayValue = this.displayValue.replace('-', '');
      } else {
        this.displayValue = '-' + this.displayValue;
      }

      if (this.waitingForOperand) {
        this.calculation[this.calculation.length - 1] = this.displayValue;
      }
    },
    calculatePercent: function () {
      this.displayValue = (+this.displayValue / 100).toString();

      if (this.waitingForOperand) {
        this.calculation[this.calculation.length - 1] = this.displayValue;
      }
    }
  }
});
