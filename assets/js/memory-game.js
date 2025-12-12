document.addEventListener("DOMContentLoaded", () => {
    // === DOM ELEMENTS ===
    const board = document.getElementById("board");          // <div id="board" class="memory-board"></div>
    const movesSpan = document.getElementById("moves");
    const matchesSpan = document.getElementById("matches");
    const pairsTotalSpan = document.getElementById("pairsTotal");

    const btnStart = document.getElementById("startGame");
    const btnRestart = document.getElementById("restartGame");
    const difficultySelect = document.getElementById("difficulty");

    const winPopup = document.getElementById("winPopup");
    const playAgainBtn = document.getElementById("playAgainBtn");

    // === GAME STATE ===
    let moves = 0;
    let matches = 0;
    let totalPairs = 0;

    let firstCard = null;
    let lockBoard = false;

    // At least 6 unique icons (you have 12 – good for hard mode)
    const icons = ["🍎","🍌","🍇","🍒","🍑","🥝","🍉","🍍","🥥","🍓","🍈","🍋"];

    // Simple shuffle helper
    function shuffle(arr) {
        return arr.sort(() => Math.random() - 0.5);
    }

    // === START / RESTART GAME ===
    function startGame() {
        // Reset board + state
        board.innerHTML = "";
        moves = 0;
        matches = 0;
        lockBoard = false;
        firstCard = null;

        movesSpan.textContent = "0";
        matchesSpan.textContent = "0";

        // Difficulty: easy = 6 pairs, hard = 12 pairs
        const size = difficultySelect.value === "easy" ? 6 : 12;
        totalPairs = size;
        pairsTotalSpan.textContent = totalPairs.toString();

        // Apply correct grid layout class
        board.className = "memory-board " + (size === 6 ? "easy" : "hard");

        // 1. Pick needed icons
        const selectedIcons = shuffle(icons).slice(0, size);
        // 2. Duplicate for pairs + shuffle
        const cardSet = shuffle([...selectedIcons, ...selectedIcons]);

        // 3. Create card elements
        cardSet.forEach(icon => {
            const card = document.createElement("div");
            card.classList.add("memory-card");

            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">${icon}</div>
                    <div class="card-back">?</div>
                </div>
            `;

            card.addEventListener("click", () => flipCard(card));
            board.appendChild(card);
        });

        // Hide win popup if it was open
        if (winPopup) winPopup.style.display = "none";
    }

    // === CARD CLICK / FLIP LOGIC ===
    function flipCard(card) {
        if (lockBoard) return;                            // board temporarily locked
        if (card === firstCard) return;                   // same card
        if (card.classList.contains("matched")) return;   // already matched
        if (card.classList.contains("flipped")) return;   // already face-up

        card.classList.add("flipped");

        // First card of the pair
        if (!firstCard) {
            firstCard = card;
            return;
        }

        // Second card
        moves++;
        movesSpan.textContent = moves.toString();

        const secondIcon = card.querySelector(".card-front").textContent;
        const firstIconText = firstCard.querySelector(".card-front").textContent;

        if (firstIconText === secondIcon) {
            // --- MATCH ---
            card.classList.add("matched");
            firstCard.classList.add("matched");

            firstCard = null;
            matches++;
            matchesSpan.textContent = matches.toString();

            checkWin();
        } else {
            // --- NO MATCH: flip back after delay ---
            lockBoard = true;
            setTimeout(() => {
                card.classList.remove("flipped");
                firstCard.classList.remove("flipped");
                firstCard = null;
                lockBoard = false;
            }, 700);
        }
    }

    // === WIN CHECK ===
    function checkWin() {
        const totalCards = document.querySelectorAll(".memory-card").length;
        const matchedCards = document.querySelectorAll(".memory-card.matched").length;

        if (matchedCards === totalCards && totalCards > 0) {
            if (winPopup) {
                winPopup.style.display = "flex";  // show popup overlay
            }
        }
    }

    // === EVENT LISTENERS ===
    btnStart.addEventListener("click", startGame);
    btnRestart.addEventListener("click", startGame);

    // Requirement: changing difficulty must re-initialize board
    difficultySelect.addEventListener("change", startGame);

    if (playAgainBtn) {
        playAgainBtn.addEventListener("click", () => {
            winPopup.style.display = "none";
            startGame(); // restart WITHOUT reloading
        });
    }

    // Optional: create initial board on page load
    startGame();
});
