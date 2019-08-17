const startButton = document.getElementById("start-button");
startButton.addEventListener("click", startGame);

const questions = [];
let nextQuestionId = 0;
let collectCount = 0;

class Question {
  constructor( dictionary, id ) {
    this._id = id;
    this._category = dictionary["category"];
    this._difficulty = dictionary["difficulty"];
    this._text = dictionary["question"];
    this._correctAnswer = dictionary["correct_answer"];
    this._choice = dictionary["incorrect_answers"].concat( [ dictionary["correct_answer"] ]);
    this._userAnswer = "noneAnswer";
  };

  get id(){
    return this._id;
  };

  get category(){
    return this._category;
  };

  get difficulty(){
    return this._difficulty;
  };

  get text(){
    return this._text;
  };

  get correctAnswer(){
    return this._correctAnswer;
  };

  get choice(){
    return this._choice;
  };

  get userAnswer() {
    return this._userAnswer;
  };

  set userAnswer ( value ) {
    this._userAnswer = value;
  };
  isCorrectAnswer(){
    return this.correctAnswer === this.userAnswer;
  };
};

function getQuiz () {
  fetch('https://opentdb.com/api.php?amount=10')
  .then(function(response){
    if(response.ok) { 
      return response.json();
    } else {
      throw new Error();
    };
  })
  .then(function(jsonData){
    createQuiz( jsonData["results"] );
    nextQuiz();
  });
};

function createQuiz (json) {
  json.forEach(function(element, index){
    questions.push(new Question(element, index));
  });
};

function startGame () {
  document.getElementById("start-button").classList.add("hide");
  document.getElementById("btn-ol").classList.remove("hide");
  const titleTarget = document.getElementById("title");
  titleTarget.innerHTML = "取得中";
  const textTarget = document.getElementById("text")
  textTarget.innerHTML = "少々お待ちください";
  getQuiz();
};

function createChoiseButton ( text ) {
  const li = document.createElement('li');
  const button = document.createElement('button');
  button.value = text;
  button.textContent = text;
  button.addEventListener('click', setUserAnswer, true);
  button.addEventListener('click', nextQuiz);
  li.appendChild(button);
  document.getElementById("btn-ol").appendChild(li);
};

function displayQuestion ( question ) {
  const titleTarget = document.getElementById("title");
  titleTarget.innerHTML = ("問題" + (Number(question.id) + 1));
  titleTarget.dataset.questionId = question.id;
  const categoryTarget = document.getElementById("category");
  categoryTarget.innerHTML = ("[ジャンル]" + question.category);
  const difficultyTarget = document.getElementById("difficulty");
  difficultyTarget.innerHTML = ("[難易度]" + question.difficulty);
  const textTarget = document.getElementById("text");
  textTarget.innerHTML = ( question.text );
  document.getElementById("btn-ol").innerHTML = "";
  question.choice.forEach(function(text){
    createChoiseButton(text);
  });
};

function setUserAnswer () {
  const questionId = document.getElementById("title").dataset.questionId;
  const question = questions[questionId];
  question.userAnswer = this.value ;
};

function nextQuiz() {
  if ( nextQuestionId === questions.length  ) {
    return displayResult();
  };
  displayQuestion( questions[nextQuestionId] );
  nextQuestionId = nextQuestionId + 1;
};

function displayResult() {
  const collecNumber = calculateQuestions();
  const titleTarget = document.getElementById("title");
  titleTarget.innerHTML = ("あなたの正解数は" + collecNumber + "回です");
  document.getElementById("category").innerHTML = "";
  document.getElementById("difficulty").innerHTML = "";
  document.getElementById("btn-ol").innerHTML = "";
  document.getElementById("text").innerHTML = "再度チャレンジしたい場合は以下をクリック！";
  document.getElementById("start-button").classList.remove("hide");
  document.getElementById("title").dataset.questionId = 0;
  questions.length = 0;
  nextQuestionId = 0
};

function calculateQuestions(){  
  questions.forEach(function(question){
    if (question.isCorrectAnswer()){
      collectCount += 1;
    };
  });
  return collectCount
};

