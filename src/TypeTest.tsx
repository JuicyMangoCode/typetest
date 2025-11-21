import { useState, useEffect, useRef } from "react";
import style from "./TypeTest.module.css";
import typeSound from "./assets/button-press.mp3";

const TypeTest = () => {
    const [quote, setQuote] = useState("");
    const [userInput, setUserInput] = useState("");
    const [startTime, setStartTime] = useState<number | null>(null);
    const [endTime, setEndTime] = useState<number | null>(null);
    const [wpm, setWpm] = useState<number | null>(null);
    const audioRef = useRef(new Audio(typeSound));

    useEffect(() => {
        audioRef.current.volume = 0.1;

        async function getRandomQuote() {
            try {
                const res = await fetch(
                    "https://corsproxy.io/?url=https://zenquotes.io/api/random/"
                );

                if (!res.ok) throw new Error("Failed to fetch quote");

                const data = await res.json();

                setQuote(data[0].q);
            } catch (error) {
                setQuote("The quick brown fox jumps over the lazy dog.");
                console.error("Error fetching quote:", error);
            }
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
        if (startTime === null) {
            setStartTime(Date.now());
        }

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

        audioRef.current.currentTime = 0;
        audioRef.current.play();

        setUserInput(newValue);

        if (newValue === quote) {
            const curTime = Date.now();
            setEndTime(curTime);

            const timeTaken = (curTime - (startTime ?? curTime)) / 1000;
            const wordsPerMinute = (quote.split(" ").length / timeTaken) * 60;

            setWpm(wordsPerMinute);
        }
    }

    return (
        <div className={style.container}>
            <p className={userInput === quote ? style.correct : style.phrase}>
                {renderQuote()}
                <br />
                <textarea
                    autoFocus
                    name="input"
                    onPaste={(e) => e.preventDefault()}
                    onCut={(e) => e.preventDefault()}
                    className={style.input}
                    value={userInput}
                    onChange={(e) => handleInputChange(e.target.value)}
                />
            </p>

            <br />

            {wpm !== null && (
                <p className={style.result}>Your WPM: {wpm.toFixed(2)}</p>
            )}

            {startTime !== null && endTime !== null && (
                <p className={style.time}>
                    Time taken: {((endTime - startTime) / 1000).toFixed(2)}{" "}
                    seconds
                </p>
            )}
        </div>
    );
};

export default TypeTest;
