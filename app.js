console.log("⚡ MathBitcoin Arcade Ready");

// GAME STATE
let scoreSats = 0;
let totalQuestions = 0;
let streak = 0;
let difficulty = 1;

// ELEMENTS
const questionText = document.getElementById("questionText");
const answerInput = document.getElementById("answerInput");
const totalSatoshis = document.getElementById("totalSatoshis");
const totalQuestionsEl = document.getElementById("totalQuestions");
const accuracyEl = document.getElementById("accuracy");

// START GAME
document.getElementById("startGame").addEventListener("click", () => {
    document.getElementById("gameZone").classList.remove("hidden");
    newQuestion();
});

// GENERATE QUESTION
function newQuestion() {
    const a = Math.floor(Math.random() * (10 * difficulty) + 1);
    const b = Math.floor(Math.random() * (10 * difficulty) + 1);

    questionText.innerText = `${a} + ${b} = ?`;
    questionText.dataset.answer = a + b;

    answerInput.value = "";
    answerInput.focus();
}

// SUBMIT ANSWER
document.getElementById("submitAnswer").addEventListener("click", handleAnswer);

function handleAnswer() {
    const user = parseInt(answerInput.value);
    const ans = parseInt(questionText.dataset.answer);

    totalQuestions++;

    if (user === ans) {
        streak++;

        const sats = 1 + Math.floor(streak / 5);
        scoreSats += sats;

        if (streak % 5 === 0) {
            difficulty++;
            flashMessage(`🔥 Streak x${streak}! Difficulté augmentée!`);
        } else {
            flashMessage(`+${sats} ⚡ sats`);
        }

    } else {
        streak = 0;
        flashMessage("❌ Faux, continue!");
    }

    updateStats();
    newQuestion();
}

// UPDATE DASHBOARD
function updateStats() {
    totalSatoshis.innerText = scoreSats;
    totalQuestionsEl.innerText = totalQuestions;

    const acc = Math.round((scoreSats / totalQuestions) * 100);
    accuracyEl.innerText = acc > 0 ? `${acc}%` : "0%";
}

// FLASH TEXT
function flashMessage(msg) {
    let div = document.createElement("div");
    div.innerText = msg;
    div.style.position = "fixed";
    div.style.top = "20px";
    div.style.left = "50%";
    div.style.transform = "translateX(-50%)";
    div.style.background = "#f2c94c";
    div.style.color = "#000";
    div.style.padding = "10px 20px";
    div.style.borderRadius = "10px";
    div.style.fontWeight = "700";
    div.style.zIndex = "999";
    div.style.opacity = "0.95";

    document.body.appendChild(div);

    setTimeout(() => div.remove(), 1200);
}

// ZBD WITHDRAW
const ZBD_API_KEY = "TON_API_KEY_ÉCRIS_ICI"; // <<< IMPORTANT

async function sendSats(amount, gamertag) {
    const res = await fetch("https://api.zebedee.io/v0/gamertags/ln", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "apikey": ZBD_API_KEY
        },
        body: JSON.stringify({
            amount: amount * 1000,
            gamertag
        })
    });

    const data = await res.json();
    console.log("⚡ ZBD Response:", data);
    alert("⚡ Tes sats arrivent ! Vérifie ton wallet.");
}

document.getElementById("withdrawSats").addEventListener("click", () => {
    if (scoreSats < 1) {
        alert("Tu dois gagner au moins 1 sat avant de retirer !");
        return;
    }

    const tag = prompt("Entre ton Gamertag ZBD :");
    if (!tag) return;

    sendSats(scoreSats, tag);
});
