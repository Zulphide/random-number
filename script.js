function generateRandomNumber(digits) {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  document.getElementById("generateBtn").addEventListener("click", () => {
    const digits = parseInt(document.getElementById("digits").value);
    const unit = document.getElementById("unit").value.trim();
    const output = document.getElementById("output");
  
    if (isNaN(digits) || digits < 1) {
      output.textContent = "Please enter a valid number of digits.";
      output.classList.replace("text-green-600", "text-red-600");
      return;
    }
  
    const randomNum = generateRandomNumber(digits);
    const result = unit.startsWith('$') || unit.startsWith('€') || unit.startsWith('£')
      ? `${unit}${randomNum}`
      : `${randomNum}${unit ? ' ' + unit : ''}`;
  
    output.textContent = result;
    output.classList.replace("text-red-600", "text-green-600");
  });
  