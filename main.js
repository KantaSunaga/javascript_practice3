const startButton = document.getElementById("start-button");
startButton.addEventListener("click", getQuiz)

const questions = []

class Question {
  constructor( dictionary ) {
    this.category = dictionary["category"];
    this.difficulty = dictionary["difficulty"];
    this.question = dictionary["question"];
    this.correct_answer = dictionary["correct_answer"];
    this.choice = dictionary["incorrect_answers"].push( this.correct_answer).sort();
    this.userAnswer = "noneAnswer";
  };
  isCorrectAnswer(){
    his.correct_answer === this.userAnswer;
  };
};

function getQuiz () {
  fetch('https://opentdb.com/api.php?amount=10')
  .then((response) => {
    if(response.ok) { 

      return createQuiz(response.text()["results"]);
    } else {
      throw new Error();
    }
  })
  .then((text) => console.log(text))
  .catch((error) => console.log(error));
};

function createQuiz (json) {
  json.array.forEach(element => {
    questions.push(new Question(json))
  });
};