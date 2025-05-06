const sentences = [
    "The sun dipped below the horizon, painting the sky in shades of orange and purple, while the waves crashed softly against the rocky shore, whispering secrets of the deep ocean.",    
    "A curious cat perched on the windowsill, its tail flicking impatiently, watching birds flutter in the garden, chirping joyfully as they hopped from branch to branch in search of food.",  
    "The old bookstore smelled of leather and ink, with shelves towering above, filled with stories of adventure, romance, and mystery, waiting for eager readers to turn their pages.",  
    "In the quiet town square, children played near the fountain, their laughter echoing through the air, while vendors sold fresh fruit, colorful scarves, and handmade jewelry to passing tourists.",  
    "A sudden gust of wind sent autumn leaves swirling through the air, their crisp edges rustling as they danced along the pavement, painting the streets with fiery reds and golden yellows.",  
    "As the train rumbled over the tracks, passengers gazed out the window, watching rolling hills and distant mountains pass by, dreaming of destinations they had yet to explore.",  
    "The artist dipped her brush into a swirl of blue, spreading color across the canvas, shaping waves and sky, capturing the feeling of freedom that danced in her heart.",  
    "A clock ticked steadily in the quiet room, its rhythmic sound filling the space, marking each passing moment, reminding the listener that time moves forward, never slowing, never stopping.",  
    "Deep in the forest, fireflies glowed softly in the darkness, their gentle flickering light guiding wandering travelers along the winding paths, through the towering trees and tangled undergrowth.",  
    "A musician tuned his guitar beneath the streetlamp, plucking a melody that wove through the night, drawing in strangers who paused to listen, lost in the rhythm of the song.",  
    "The scent of fresh-baked bread filled the air as the baker arranged golden loaves in neat rows, the warm aroma inviting customers to step inside and choose their favorite treat.",  
    "A young girl spun beneath falling snowflakes, her laughter ringing across the frosty street, while the lights of the city twinkled like tiny stars against the winter sky.",  
    "At the edge of the lake, a fisherman cast his line, watching ripples spread across the water, waiting patiently for the tug of a fish that would break the silence.",  
    "The library doors creaked open, revealing rows of books stacked neatly, their pages filled with knowledge and adventure, inviting visitors to immerse themselves in worlds both real and imagined.",  
    "A dog chased its own shadow in the afternoon sun, barking playfully as birds soared overhead, their wings cutting through the breeze, carrying them toward the endless blue sky.",  
]

// random sentence
function getRandomSentence() {
    const index = Math.floor(Math.random() * sentences.length);
    return sentences[index];
}


// timer setup
let timeLimit = 120;
let timer;
let timerStarted = false;

function updateTimerDisplay() {
    const minutes = Math.floor(timeLimit / 60);
    const seconds = timeLimit % 60;
    // add a 0 in the front if second is less than 10
    document.getElementById("timer").innerText = `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
}

function startCountdown() {
    timer = setInterval(() => {
        if (timeLimit > 0) {
            timeLimit--;
            updateTimerDisplay();
        } else {
            clearInterval(timer);
            document.getElementById("typeInput").disabled = true;
            alert("Time is up!");
        }
    }, 1000);
}

const keypressSound = new Audio("sounds/keypress.mp3");


function evaluateInput() {
    const userInput = document.getElementById("typeInput").value;
    const targetSentence = document.getElementById("sentence").innerText;
    
    let correctChars = 0;
    let errorChars = 0;
    const minLength = Math.min(userInput.length, targetSentence.length);
    
    for (let i = 0; i < minLength; i++) {
        if (userInput[i] === targetSentence[i]) {
            correctChars++;
        } else {
            errorChars++;
        }
    }
    // 如果長度不匹配，多出的部分也視為錯誤
    errorChars += Math.abs(userInput.length - targetSentence.length);
    
    // 計算準確率 (以目標句子長度作為基準)
    const accuracy = (correctChars / targetSentence.length) * 100;
    // 計算已用時間：從總時間 120 秒扣除剩下的 timeLimit
    const usedTime = 120 - timeLimit;
    const elapsedMinutes = usedTime / 60;
    
    // 計算每分鐘打字速度：每5個正確字元算一個單位
    let wpm = 0;
    if (elapsedMinutes > 0) {
        wpm = (correctChars / 5) / elapsedMinutes;
    }
    
    // 將結果放入覆蓋層，並顯示該區塊
    showResultOverlay(usedTime, accuracy, wpm);
}

// 當使用者按下 Enter 鍵提交輸入
document.getElementById("typeInput").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        // 防止換行或重複提交
        event.preventDefault();
        // 若計時器還在運作，可選擇停止倒計時
        clearInterval(timer);
        evaluateInput();
    }
});

// 顯示結果覆蓋層功能
function showResultOverlay(usedTime, accuracy, wpm) {
    const overlay = document.getElementById("resultOverlay");
    overlay.innerHTML = `
        <div class="result-content">
            <h2>挑戰結果</h2>
            <p>使用時間：${usedTime} 秒</p>
            <p>打字準確率：${accuracy.toFixed(2)}%</p>
            <p>打字速度：${wpm.toFixed(2)} WPM</p>
            <button id="restartBtn">重新開始</button>
        </div>
    `;
    overlay.classList.add("active");
    overlay.style.display = "flex"; // 以 flex 布局置中顯示
    
    // 重新開始按鈕，讓使用者重整頁面重新挑戰
    document.getElementById("restartBtn").addEventListener("click", function(){
        window.location.reload();
    });
}


// load everything
window.onload = function () {
    const sentenceElement = document.getElementById("sentence");
    sentenceElement.innerText = getRandomSentence();
    const inputElement = document.getElementById("typeInput");

    // start time
    inputElement.addEventListener("input", function () {
        // check if timer started. if not, start it
        if (timerStarted == false && this.value.length > 0) {
            timerStarted = true;
            startCountdown();
        }
    });

    document.getElementById("typeInput").addEventListener("input", function() {
        const soundClone = keypressSound.cloneNode(); // 複製音效物件
        soundClone.play();
    });
    

    updateTimerDisplay();
};