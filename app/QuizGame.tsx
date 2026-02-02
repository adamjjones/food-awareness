"use client";
import { useState } from "react";

const questions = [
  {
    type: "single",
    text: "What is the biggest problem in our food system today as a society?",
    options: [
      "Lack of food variety",
      "Overconsumption of organic foods",
      "Lack of transparency and information about ingredients and nutrition",
      "Too many local food markets"
    ],
    answer: 2
  },
  {
    type: "multi",
    text: "Which ingredients are the biggest problems in food today? (Select all that apply)",
    options: [
      "High-fructose corn syrup",
      "Artificial trans fats",
      "Whole grains",
      "Monosodium glutamate (MSG)",
      "Artificial food dyes"
    ],
    answers: [0, 1, 3, 4]
  }
];

export default function QuizGame() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<any>(questions[0].type === "multi" ? [] : null);
  const [submitted, setSubmitted] = useState(false);

  const current = questions[step];
  console.log('current:', current);

  const handleSelect = (idx: number) => {
    if (submitted) return;
    if (current.type === "multi") {
      setSelected((prev: number[]) =>
        prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
      );
    } else {
      setSelected(idx);
    }
  };

  const handleSubmit = () => {
    if ((current.type === "multi" && selected.length > 0) || (current.type === "single" && selected !== null)) {
      setSubmitted(true);
    }
  };

  const handleNext = () => {
    setStep(step + 1);
    setSelected(questions[step + 1]?.type === "multi" ? [] : null);
    setSubmitted(false);
  };

  // Check correctness
  let isCorrect = false;
  if (submitted) {
    if (current.type === "single") {
      isCorrect = selected === current.answer;
    } else if (current.type === "multi" && Array.isArray(current.answers)) {
      isCorrect =
        Array.isArray(selected) &&
        selected.length === current.answers.length &&
        selected.every((idx: number) => current.answers.includes(idx)) &&
        current.answers.every((idx: number) => selected.includes(idx));
    }
  }

  // Helper for correct answer(s) display
  let correctAnswerText = "";
  if (current.type === "multi" && Array.isArray(current.answers)) {
    correctAnswerText = current.answers.map((idx: number) => `"${current.options[idx]}"`).join(", ");
  } else if (typeof current.answer === "number") {
    correctAnswerText = `"${current.options[current.answer]}"`;
  }

  return (
    <div className="mt-8 p-6 rounded-lg bg-zinc-100 dark:bg-zinc-800 shadow max-w-md w-full">
      <h4 className="text-lg font-semibold mb-4 text-black dark:text-zinc-50">Quiz: Food Awareness</h4>
      <p className="mb-4 text-zinc-700 dark:text-zinc-200">{current.text}</p>
      <ul className="mb-4">
        {current.options.map((opt: string, idx: number) => {
          // Determine if this option is selected
          const isSelected = current.type === "multi" ? selected.includes(idx) : selected === idx;
          // Base button classes
          const baseClasses = "w-full text-left px-4 py-2 mb-2 rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400";
          // Selected and unselected styles
          const selectedClasses = "bg-blue-500 text-white border-blue-500";
          const unselectedClasses = "bg-white dark:bg-zinc-700 text-black dark:text-zinc-50 border-zinc-300 dark:border-zinc-600 hover:bg-zinc-200 dark:hover:bg-zinc-600";
          // Combine classes
          const buttonClasses = [baseClasses, isSelected ? selectedClasses : unselectedClasses].join(" ");
          return (
            <li key={idx}>
              <button
                className={buttonClasses}
                onClick={() => handleSelect(idx)}
                disabled={submitted}
              >
                {opt}
              </button>
            </li>
          );
        })}
      </ul>
      {!submitted ? (
        <button
          className="px-4 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-50"
          onClick={handleSubmit}
          disabled={current.type === "multi" ? selected.length === 0 : selected === null}
        >
          Submit
        </button>
      ) : (
        <div className="mt-2 text-base font-medium">
          {isCorrect ? (
            <span className="text-green-600">Correct! 🎉</span>
          ) : (
            <span className="text-red-600">
              Incorrect. The correct answer{current.type === "multi" ? "s are" : " is"} {correctAnswerText}.
            </span>
          )}
          {step < questions.length - 1 && (
            <button
              className="ml-4 px-3 py-1 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700"
              onClick={handleNext}
            >
              Next Question
            </button>
          )}
        </div>
      )}
    </div>
  );
}
