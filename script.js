function generateRandomNumber(digits, decimals) {
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  const integerPart = Math.floor(Math.random() * (max - min + 1)) + min;

  if (decimals > 0) {
    const decimalPart = Math.random().toFixed(decimals).split('.')[1];
    return parseFloat(`${integerPart}.${decimalPart}`);
  }

  return integerPart;
}

document.getElementById("generateBtn").addEventListener("click", () => {
  const digits = parseInt(document.getElementById("digits").value);
  const decimals = parseInt(document.getElementById("decimals").value) || 0;
  const unit = document.getElementById("unit").value.trim();
  const output = document.getElementById("output");

  if (isNaN(digits) || digits < 1) {
    output.textContent = "Please enter a valid number of digits.";
    output.classList.replace("text-green-600", "text-red-600");
    return;
  }

  const randomNum = generateRandomNumber(digits, decimals);
  const formatted = unit.startsWith('$') || unit.startsWith('€') || unit.startsWith('£')
    ? `${unit}${randomNum}`
    : `${randomNum}${unit ? ' ' + unit : ''}`;

  output.textContent = formatted;
  output.classList.replace("text-red-600", "text-green-600");
});
