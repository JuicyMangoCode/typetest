import { useState, useEffect } from "react";
import style from "./TypeTest.module.css";
import typeSound from "./assets/button-press.mp3";

const TypeTest = () => {
    const [quote, setQuote] = useState("");
    const [userInput, setUserInput] = useState("");

    useEffect(() => {
        async function getRandomQuote() {
            const res = await fetch(
                "https://corsproxy.io/?url=https://zenquotes.io/api/random/"
            );
            const data = await res.json();

            setQuote(data[0].q);
        }

        getRandomQuote();
    }, []);

    function renderQuote() {
        return quote.split("").map((char, index) => {
            const hasTyped = index < userInput.length;
            const isCorrect = hasTyped && userInput[index] === char;
            const isIncorrect = hasTyped && userInput[index] !== char;

            return (
                <span
                    key={index}
                    className={
                        isCorrect
                            ? style.correctChar
                            : isIncorrect
                            ? style.incorrectChar
                            : ""
                    }
                >
                    {char}
                </span>
            );
        });
    }

    function handleInputChange(newValue: string) {
        if (newValue.length > quote.length) {
            return;
        }

        let correctCount = 0;
        for (let i = 0; i < Math.min(userInput.length, quote.length); i++) {
            if (userInput[i] === quote[i]) {
                correctCount++;
            } else {
                break; // Stop at first incorrect character
            }
        }

        if (newValue.length < correctCount) {
            return;
        }

        const audio = new Audio(typeSound);
        audio.volume = 0.1;
        audio.play();

        setUserInput(newValue);
    }

    return (
        <div className={style.container}>
            <p className={userInput === quote ? style.correct : style.phrase}>
                {renderQuote()}
                <br />
                <input
                    autoFocus
                    type="text"
                    name="input"
                    className={style.input}
                    value={userInput}
                    onChange={(e) => handleInputChange(e.target.value)}
                />
            </p>
        </div>
    );
};

export default TypeTest;
