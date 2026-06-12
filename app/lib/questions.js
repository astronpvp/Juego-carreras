const questions = [
  {
    id: 1,
    question: "¿Cuál es la capital de Francia?",
    options: ["Madrid", "París", "Roma", "Berlín"],
    correctIndex: 1,
  },
  {
    id: 2,
    question: "¿Cuántos planetas hay en el sistema solar?",
    options: ["7", "8", "9", "10"],
    correctIndex: 1,
  },
  {
    id: 3,
    question: "¿Quién pintó la Mona Lisa?",
    options: ["Van Gogh", "Picasso", "Leonardo da Vinci", "Dalí"],
    correctIndex: 2,
  },
  {
    id: 4,
    question: "¿Cuál es el río más largo del mundo?",
    options: ["Nilo", "Amazonas", "Yangtsé", "Misisipi"],
    correctIndex: 1,
  },
  {
    id: 5,
    question: "¿En qué año llegó el hombre a la Luna?",
    options: ["1965", "1969", "1972", "1959"],
    correctIndex: 1,
  },
  {
    id: 6,
    question: "¿Cuál es el metal más ligero?",
    options: ["Hierro", "Litio", "Oro", "Plata"],
    correctIndex: 1,
  },
  {
    id: 7,
    question: "¿Qué país ganó el Mundial de fútbol de 2010?",
    options: ["Brasil", "Alemania", "España", "Argentina"],
    correctIndex: 2,
  },
  {
    id: 8,
    question: "¿Cuál es el océano más grande?",
    options: ["Atlántico", "Índico", "Pacífico", "Ártico"],
    correctIndex: 2,
  },
  {
    id: 9,
    question: "¿Qué instrumento mide la temperatura?",
    options: ["Barómetro", "Termómetro", "Higrómetro", "Anemómetro"],
    correctIndex: 1,
  },
  {
    id: 10,
    question: "¿Cuál es el resultado de 9 x 7?",
    options: ["56", "63", "72", "81"],
    correctIndex: 1,
  },
  {
    id: 11,
    question: "¿Qué gas respiramos principalmente para vivir?",
    options: ["Oxígeno", "Hidrógeno", "Helio", "Nitrógeno"],
    correctIndex: 0,
  },
  {
    id: 12,
    question: "¿Cuál es el animal terrestre más rápido?",
    options: ["León", "Guepardo", "Caballo", "Tigre"],
    correctIndex: 1,
  },
  {
    id: 13,
    question: "¿Qué lenguaje se usa principalmente para páginas web interactivas?",
    options: ["HTML", "CSS", "JavaScript", "SQL"],
    correctIndex: 2,
  },
  {
    id: 14,
    question: "¿Cuál es la capital de Italia?",
    options: ["Roma", "Milán", "Venecia", "Nápoles"],
    correctIndex: 0,
  },
  {
    id: 15,
    question: "¿Qué planeta es conocido como el planeta rojo?",
    options: ["Venus", "Marte", "Júpiter", "Saturno"],
    correctIndex: 1,
  },
];

function getRandomQuestion() {
  const index = Math.floor(Math.random() * questions.length);
  return questions[index];
}

module.exports = {
  questions,
  getRandomQuestion,
};