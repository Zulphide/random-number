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

function convertToChineseCurrency(amount) {
  // Split into integer and decimal parts
  const parts = amount.toFixed(2).split('.');
  const yuan = parts[0]; // Whole part
  const mao = parts[1].charAt(0); // Tenths place (mao)
  const fen = parts[1].charAt(1); // Hundredths place (fen)

  let result = '';

  // Process yuan (元)
  result += `${yuan}元`;

  // Process mao (毛)
  if (mao !== '0') {
    result += `${mao}毛`;
  }

  // Process fen (分)
  if (fen !== '0') {
    result += `${fen}分`;
  }

  return result;
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

document.getElementById("speakBtn").addEventListener("click", () => {
  const output = document.getElementById("output").textContent;
  const language = document.getElementById("language").value;

  if (!output) {
    alert("Nothing to speak yet. Generate a number first.");
    return;
  }

  // If the selected language is Mandarin (Chinese)
  if (language === 'zh-CN') {
    const number = parseFloat(output.replace(/[^\d.-]/g, '')); // Extract the number part
    const chineseCurrency = convertToChineseCurrency(number); // Convert to Mandarin currency format
    const utterance = new SpeechSynthesisUtterance(chineseCurrency);
    utterance.lang = language;

    // Wait for voices to load
    const voices = window.speechSynthesis.getVoices();
  
    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        const voices = window.speechSynthesis.getVoices();
        const match = voices.find(v => v.lang === language);
        if (match) utterance.voice = match;
        window.speechSynthesis.speak(utterance);
      };
    } else {
      const match = voices.find(v => v.lang === language);
      if (match) utterance.voice = match;
      window.speechSynthesis.speak(utterance);
    }
  } else {
    // Default behavior for other languages (Spanish, etc.)
    const utterance = new SpeechSynthesisUtterance(output);
    utterance.lang = language;

    const voices = window.speechSynthesis.getVoices();
    const match = voices.find(v => v.lang === language);
    if (match) utterance.voice = match;

    window.speechSynthesis.speak(utterance);
  }
});
