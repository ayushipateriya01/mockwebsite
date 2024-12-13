const apiUrl = "https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=multiple"
let currentQuestionIndex = 0;
let score = 0;
let questions = [];

const questionContainer = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const nextButton = document.getElementById("next-btn");

// Function to fetch questions from the API
async function fetchQuestions() {
  try {
    const response = await fetch(apiUrl);

    // Check if the response is okay
    if (!response.ok) {
      throw new Error("Failed to fetch quiz questions");
    }

    // Parse the JSON response
    const data = await response.json();
    questions = data.results;

    // Load the first question after fetching
    loadQuestion();
  } catch (error) {
    // Display an error message if the API call fails
    questionContainer.innerHTML = `<p>Error loading quiz: ${error.message}</p>`;
    nextButton.style.display = "none";
  }
}

// Function to load a question
function loadQuestion() {
  const currentQuestion = questions[currentQuestionIndex];
  questionElement.textContent = currentQuestion.question;
  optionsElement.innerHTML = ""; // Clear previous options

  // Combine correct and incorrect answers and shuffle them
  const allOptions = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];
  shuffle(allOptions);

  // Generate buttons for each option
  allOptions.forEach((option) => {
    const button = document.createElement("button");
    button.textContent = option;
    button.addEventListener("click", () => selectAnswer(option, currentQuestion.correct_answer));
    optionsElement.appendChild(button);
  });
}

// Shuffle function to randomize options
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
}

// Function to handle answer selection
function selectAnswer(selectedOption, correctAnswer) {
  const buttons = optionsElement.querySelectorAll("button");

  // Highlight correct and incorrect answers
  buttons.forEach((button) => {
    if (button.textContent === correctAnswer) {
      button.style.backgroundColor = "#28a745"; // Green for correct
    } else if (button.textContent === selectedOption) {
      button.style.backgroundColor = "#dc3545"; // Red for incorrect
    }
    button.disabled = true; // Disable all buttons after selection
  });

  // Increment score if the answer is correct
  if (selectedOption === correctAnswer) {
    score++;
  }

  // Show the "Next" button
  nextButton.style.display = "block";
}

// Function to load the next question
function nextQuestion() {
  currentQuestionIndex++;

  // Check if there are more questions
  if (currentQuestionIndex < questions.length) {
    loadQuestion();
    nextButton.style.display = "none"; // Hide "Next" button until an answer is selected
  } else {
    showResults(); // Show results if the quiz is over
  }
}

// Function to display the quiz results
function showResults() {
  questionContainer.innerHTML = `
    <h2>Your Score: ${score}/${questions.length}</h2>
    <p>Thank you for playing!</p>
  `;
  nextButton.style.display = "none";
}

// Initialize the quiz
fetchQuestions();
nextButton.addEventListener("click", nextQuestion);
