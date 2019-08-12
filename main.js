const startButton = document.getElementById("start-button");
startButton.addEventListener("click", startGame);

const Questions = [];

class Question {
  constructor( dictionary, id ) {
    this.id = id;
    this.category = dictionary["category"];
    this.difficulty = dictionary["difficulty"];
    this.text = dictionary["question"];
    this.correct_answer = dictionary["correct_answer"];
    this.choice = dictionary["incorrect_answers"].concat( [ dictionary["correct_answer"] ]);
    this._userAnswer = "noneAnswer";
  };

  get userAnswer() {
    return this._userAnswer;
  };

  set userAnswer ( value ) {
    this._userAnswer = value;
  };
  isCorrectAnswer(){
    return this.correct_answer == this.userAnswer;
  };
};

function getQuiz () {
  fetch('https://opentdb.com/api.php?amount=10')
  .then((response) => {
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
  Questions.push(new Question(element, index));
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
  const question = Questions[questionId];
  this.value = question.userAnswer;
};

function nextQuiz() {
  let questionId = document.getElementById("title").dataset.questionId;
  if ( !questionId ) {
    return displayQuestion( Questions[0] );
  }else if(Number(questionId) === 9){
    return displayResult();
  };
  const nextId = Number(questionId) + 1;
  const nextQuiz = Questions[nextId];
  displayQuestion( nextQuiz );
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
  Questions.length = 0;
};

function calculateQuestions(){  
  const collecNumber = [];
  // collecNumberに０を代入して結果に1足していったけど0のままだった
  Questions.forEach(function(question){
    if (question.isCorrectAnswer()){
      collecNumber.push(question);
    };
  });
  return collecNumber.length;
};

