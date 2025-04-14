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
  const parts = amount.toFixed(2).split('.');
  const kuai = parts[0];
  const mao = parts[1].charAt(0);
  const fen = parts[1].charAt(1);

  let result = `${kuai}块`;
  if (mao !== '0') result += `${mao}毛`;
  if (fen !== '0') result += `${fen}分`;

  return result;
}

function convertToSpanishCurrency(amount) {
  const numberToWords = window.numeralToWordsES;
  const parts = amount.toFixed(2).split('.');
  const pesos = parseInt(parts[0], 10);
  const centavos = parseInt(parts[1], 10);

  let result = `${numberToWords(pesos)} peso${pesos !== 1 ? 's' : ''}`;
  if (centavos > 0) {
    result += ` con ${numberToWords(centavos)} centavo${centavos !== 1 ? 's' : ''}`;
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
  const formatted = unit.startsWith('$') || unit.startsWith('€') || unit.startsWith('£') || unit.startsWith('¥')
    ? `${unit}${randomNum}`
    : `${randomNum}${unit ? ' ' + unit : ''}`;

  output.textContent = formatted;
  output.classList.replace("text-red-600", "text-green-600");
});

// Update displayed slider values
document.getElementById("digits").addEventListener("input", (e) => {
  document.getElementById("digitsValue").textContent = e.target.value;
});
document.getElementById("decimals").addEventListener("input", (e) => {
  document.getElementById("decimalsValue").textContent = e.target.value;
});

function handleSpeak() {
  const outputText = document.getElementById("output").textContent;
  const language = document.getElementById("language").value;
  const unit = document.getElementById("unit").value.trim();
  const speakAsCurrency = document.getElementById("speakAsCurrency")?.checked || false;

  if (!outputText) {
    alert("Nothing to speak yet. Generate a number first.");
    return;
  }

  const isCurrency = ["¥", "元", "块", "$", "€", "£"].includes(unit);
  const rawNumber = parseFloat(outputText.replace(/[^\d.-]/g, ''));
  let textToSpeak = outputText;

  if (language === 'zh-CN' && (isCurrency || speakAsCurrency)) {
    textToSpeak = convertToChineseCurrency(rawNumber);
  } else if ((language === 'es-MX' || language === 'es-419') && (isCurrency || speakAsCurrency)) {
    textToSpeak = convertToSpanishCurrency(rawNumber);
  }

  // Cancel and use delay to reset Android speech queue
  window.speechSynthesis.cancel();

  // Wait a tick before re-creating and speaking
  setTimeout(() => {
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = language;

    const voices = window.speechSynthesis.getVoices();
    const match = voices.find(v => v.lang === language);
    if (match) utterance.voice = match;

    // Resume is sometimes needed on Android after cancel
    window.speechSynthesis.resume();
    window.speechSynthesis.speak(utterance);
  }, 100); // small delay to allow speech engine to reset
}

// Add both click and touchstart to ensure cross-device support
const speakBtn = document.getElementById("speakBtn");
speakBtn.addEventListener("click", handleSpeak);
