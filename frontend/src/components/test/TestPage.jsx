import { useState, useCallback, useRef } from "react";
import useFullscreen from "./useFullscreen";
import TestTimer from "./TestTimer";
import { Button } from "../ui/button";

const TestPage = ({ test, onSubmit }) => {
  const [answers, setAnswers] = useState({});
  const [currentSection, setCurrentSection] = useState(0);
  const [showSubmit, setShowSubmit] = useState(false);
  const [started, setStarted] = useState(false);
  const containerRef = useRef();

  // Only request fullscreen on user gesture
  const handleStart = () => {
    setStarted(true);
    const el = containerRef.current;
    if (el) {
      if (el.requestFullscreen) {
        el.requestFullscreen();
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
      } else if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen();
      } else if (el.msRequestFullscreen) {
        el.msRequestFullscreen();
      }
    }
  };

  const handleOptionChange = (sectionIdx, qIdx, option) => {
    setAnswers((prev) => ({
      ...prev,
      [`${sectionIdx}-${qIdx}`]: option
    }));
  };

  const handleSectionChange = (idx) => {
    setCurrentSection(idx);
  };

  const handleTimeUp = useCallback(() => {
    setShowSubmit(true);
  }, []);

  const handleManualSubmit = () => {
    setShowSubmit(true);
  };

  const handleConfirmSubmit = () => {
    // Prepare answers in backend format, including options
    const formatted = test.sections.map((section, sIdx) => ({
      sectionName: section.section_name,
      questions: section.questions.map((q, qIdx) => ({
        question: q.question,
        options: q.options,
        answer: q.answer,
        userAnswer: answers[`${sIdx}-${qIdx}`] || null
      }))
    }));
    onSubmit(formatted);
  };

  // Count attempted
  const totalQuestions = test.sections.reduce((sum, s) => sum + s.questions.length, 0);
  const attempted = Object.keys(answers).length;

  return (
    <div ref={containerRef} className="fixed inset-0 bg-white z-50 flex flex-col">
      {!started ? (
        <div className="flex flex-1 items-center justify-center">
          <Button size="lg" onClick={handleStart} className="text-xl px-8 py-4">Start Test (Fullscreen)</Button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center p-4 border-b">
            <TestTimer duration={40 * 60} onTimeUp={handleTimeUp} />
            <Button variant="destructive" onClick={handleManualSubmit}>Submit Test</Button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex gap-2 mb-4">
              {test.sections.map((section, idx) => (
                <Button
                  key={section.section_name}
                  variant={idx === currentSection ? "default" : "outline"}
                  onClick={() => handleSectionChange(idx)}
                >
                  {section.section_name}
                </Button>
              ))}
            </div>
            <div>
              {test.sections[currentSection].questions.map((q, qIdx) => (
                <div key={q.question} className="mb-6 p-4 border rounded-lg shadow-sm">
                  <div className="font-semibold mb-2">Q{qIdx + 1}. {q.question}</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {q.options.map((opt, oIdx) => (
                      <label key={opt} className="flex items-center gap-2 cursor-pointer p-2 border rounded hover:bg-blue-50">
                        <input
                          type="radio"
                          name={`q-${currentSection}-${qIdx}`}
                          value={opt}
                          checked={answers[`${currentSection}-${qIdx}`] === opt}
                          onChange={() => handleOptionChange(currentSection, qIdx, opt)}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Submit Modal */}
          {showSubmit && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 shadow-xl max-w-sm w-full text-center">
                <div className="text-xl font-bold mb-2">Submit Test?</div>
                <div className="mb-4">
                  Attempted: <span className="font-semibold">{attempted}</span> / {totalQuestions}<br />
                  Remaining: <span className="font-semibold">{totalQuestions - attempted}</span>
                </div>
                <div className="flex gap-4 justify-center">
                  <Button variant="outline" onClick={() => setShowSubmit(false)}>Cancel</Button>
                  <Button variant="default" onClick={handleConfirmSubmit}>Confirm Submit</Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TestPage;
