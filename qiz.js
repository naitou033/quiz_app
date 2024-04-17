`use strict`
/* ========================
問題一覧
=========================*/
const data =[{
    question:"日本で一番大きい都道府県は?",
    answer: ["北海道","東京都","沖縄県","福岡県"],
    correct:"北海道"},
    {
    question:"日本で一番人口の多い都道府県は?",
    answer: ["北海道","東京都","沖縄県","福岡県"],
    correct:"東京都"},
    {
    question:"日本で一番人口の密度が高い都道府県は?",
    answer: ["北海道","東京都","沖縄県","福岡県"],
    correct:"東京都"},
];
//出題する問題
const QUESTION_LENGTH = 2;

const ANSWER_TIME_MS = 10000;

const INTERVAL_TIME_MS = 10;

let intervalId = null;

let elapsendTime = 0;

//出題する問題データ
// const questions = data.slice(0,QUESTION_LENGTH);
// let questions = [data[0]];
let questions = getRandomQuestion();
//出題する問題のインデックス
let questionIndex = 0;
//正解数
let correctCount = 0;


/* ========================
要素一覧
=========================*/
const startPage = document.getElementById(`startPage`);
const questionPage = document.getElementById(`questionPage`);
const resultPage = document.getElementById(`resultPage`);
const startButton = document.getElementById(`startButton`);
const questionNumber = document.getElementById(`questionNumber`);
const questionText = document.getElementById(`questionText`);
const optionButtons = document.querySelectorAll(`#questionPage button`);

const qestionProgress = document.getElementById("qestionProgress");

const resultMassage = document.getElementById(`resultMessage`);
const backButton = document.getElementById("backButton");

const dialog = document.getElementById("dialog");
const questionResult = document.getElementById("questionResult");
const nextButton = document.getElementById("nextButton");


console.log(optionButtons);
/* ========================
処理
=========================*/
startButton.addEventListener(`click`,clickStartButton);
optionButtons.forEach((button) => {
    button.addEventListener(`click`,clickOptionButton);
});

nextButton.addEventListener("click", clickNextButton);

nextButton.addEventListener("click", clickBackButton);

/* ========================
関数一覧
=========================*/

function qestionTimeover() {
    questionResult.innerText = "×";

    if(isQuestionEnd()) {
        nextButton.innerText = "結果を見る";
    } else {
        nextButton.innerText = "次の問題へ";
    }
    dialog.showModal();
}

function startProgress(){
    
    startTime = Date.now();

    intervalId = setInterval(() => {
        const currentTime = Date.now();
        const progress = ((currentTime - startTime) / ANSWER_TIME_MS) * 100;
        qestionProgress.value = progress;
        if(startTime + ANSWER_TIME_MS <= currentTime) {
            stopProgress();
            questionTimeover();
            return;
        }
        elapsendTime += INTERVAL_TIME_MS;
    }, INTERVAL_TIME_MS);
}

function stopProgress() {
    if(intervalId != null) {
        clearInterval(intervalId);
        intervalId = null;
    }
}


function reset() {
    questions = getRandomQuestion();
    questionIndex = 0;
    correctCount = 0;

    intervalId = null;

    elapsendTime = 0;

    for(let i = 0; i < optionButtons.length; i++) {
        optionButtons[i].removeAttribute("disabled")
    }
}

function isQuestionEnd(){
    //問題が最後かどうかを判定する
    return questionIndex + 1 === QUESTION_LENGTH;
}
function getRandomQuestion(){
    //出題する問題のインデックスリスト
    const questionIndexList = [];
    while(questionIndexList.length !== QUESTION_LENGTH){
        //出題する問題のインデックスをランダムに生成する
        const index = Math.floor(Math.random() * data.length);
        //インデックスリストに含まれていない場合、インデックスリストに追加する
        if(!questionIndexList.includes(index)){
            questionIndexList.push(index);
        }
    }
    //出題する問題リストを取得する
    const questionList = questionIndexList.map((index) => data[index]);
    return questionList;
}
function setQuestion(){
    // 問題を取得する
    const question = questions[questionIndex];
    // 問題番号を表示する
    questionNumber.innerText = `第${questionIndex + 1}問`;
    // 問題文を表示する
    questionText.innerText = question.question;
    // 選択肢を表示する
    for(let i = 0; i < optionButtons.length; i++){
        optionButtons[i].innerText = question.answer[i];
    }
}
function clickOptionButton(event){

    stopProgress();
    //すべての選択肢を無効化する
    optionButtons.forEach((button) => {
        button.disabled = true;
    });
    //回答処理
    //選択した選択肢のテキストを取得する
    const optionText = event.target.innerText;
    //正解のテキストを取得する
    const correctText = questions[questionIndex].correct;
    if(optionText === correctText){
        correctCount+= 1;
        questionResult.innerText = "🔴";
        alert("正解");
    }else{
        questionResult.innerText = "✖";
        alert("不正解");
    }

    if(isQuestionEnd()) {
        nextButton.innerText = "結果を見る";
    } else {
        nextButton.innerText = "次の問題へ";
    }

    dialog.showModal();

}
function setResult() {
    //正解率
    const accuracy = Math.floor((correctCount / QUESTION_LENGTH) * 100);
    //正解率を表示する
    resultMassage.innerText = `正解率:${accuracy}%`;
}
/* ========================
イベント関連の関数
=========================*/
function clickStartButton(){
    reset();
    //問題画面に問題文を設定する
    setQuestion();

    startProgress();
    // スタート画面を非表示にする
    startPage.classList.add("hidden");
    // 問題画面を表示する
    questionPage.classList.remove("hidden");
    // 結果画面を非表示にする
    resultPage.classList.add("hidden");
}

function clickNextButton() {
    if(isQuestionEnd()){
        //正解率を設定する
    setResult();
    //問題画面に問題文を設定する
    dialog.close();
    setQuestion();
    // スタート画面を非表示にする
    startPage.classList.add("hidden");
    // 問題画面を悲表示にする
    questionPage.classList.add("hidden");
    // 結果画面を表示する
    resultPage.classList.remove("hidden");
    }else{
        questionIndex++;
        //問題画面に問題を設定する
        setQuestion();

        intervalId = null;
        elapsendTime = 0;

        //すべての選択肢を有効化する
        for(let i = 0; i < optionButtons.length; i++){
            optionButtons[i].removeAttribute("disabled");
        }
        dialog.close();
    }
}

function clickBackButton() {
    startPage.classList.remove("hidden");
    questionPage.classList.add("hidden");
    resultPage.classList.add("hidden");
}