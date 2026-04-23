import { useState, useEffect } from 'react';
import api from '../utils/api';
import '../styles/phishingquiz.css';

export default function PhishingQuiz() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [answerKey, setAnswerKey] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);

  const loadQuiz = async () => {
    setLoading(true); setAnswers({}); setSubmitted(false); setResult(null); setCurrent(0);
    try {
      const res = await api.get('/advanced/quiz');
      setQuestions(res.data.questions);
      setAnswerKey(res.data.answers);
    } catch {
      window.showNotification?.('Failed to load quiz', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadQuiz(); }, []);

  const handleAnswer = (qId, optIdx) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      window.showNotification?.('Please answer all questions', 'warning');
      return;
    }
    try {
      const payload = Object.entries(answers).map(([id, answer]) => ({ id: parseInt(id), answer }));
      const res = await api.post('/advanced/quiz/submit', { answers: payload });
      setResult(res.data);
      setSubmitted(true);
    } catch {
      window.showNotification?.('Submission failed', 'error');
    }
  };

  const gradeColor = { A: '#10b981', B: '#22c55e', C: '#f59e0b', F: '#ef4444' };

  if (loading) return (
    <div className="quiz-page">
      <div className="quiz-loading"><div className="loading-spinner"></div><p>Loading quiz...</p></div>
    </div>
  );

  return (
    <div className="quiz-page">
      <div className="quiz-header">
        <span className="quiz-icon">🎯</span>
        <h1>Phishing Awareness Quiz</h1>
        <p>Test your ability to spot phishing attacks and social engineering</p>
      </div>

      {!submitted ? (
        <div className="quiz-container">
          <div className="quiz-progress">
            <div className="quiz-progress-bar" style={{ width: `${((current + 1) / questions.length) * 100}%` }}></div>
          </div>
          <div className="quiz-counter">Question {current + 1} of {questions.length}</div>

          {questions[current] && (
            <div className="quiz-question-card">
              <h2 className="quiz-question">{questions[current].question}</h2>
              <div className="quiz-options">
                {questions[current].options.map((opt, i) => (
                  <button
                    key={i}
                    className={`quiz-option ${answers[questions[current].id] === i ? 'selected' : ''}`}
                    onClick={() => handleAnswer(questions[current].id, i)}
                  >
                    <span className="option-letter">{String.fromCharCode(65 + i)}</span>
                    <span>{opt}</span>
                  </button>
                ))}
              </div>

              <div className="quiz-nav">
                <button className="quiz-nav-btn" onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0}>
                  ← Previous
                </button>
                {current < questions.length - 1 ? (
                  <button className="quiz-nav-btn primary" onClick={() => setCurrent(c => c + 1)} disabled={answers[questions[current].id] === undefined}>
                    Next →
                  </button>
                ) : (
                  <button className="quiz-submit-btn" onClick={handleSubmit} disabled={Object.keys(answers).length < questions.length}>
                    Submit Quiz ✓
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="quiz-dots">
            {questions.map((q, i) => (
              <button key={i} className={`quiz-dot ${i === current ? 'active' : ''} ${answers[q.id] !== undefined ? 'answered' : ''}`} onClick={() => setCurrent(i)} />
            ))}
          </div>
        </div>
      ) : (
        <div className="quiz-results">
          <div className="quiz-score-card">
            <div className="quiz-grade" style={{ color: gradeColor[result?.grade] }}>
              {result?.grade}
            </div>
            <div className="quiz-score-num">{result?.score}%</div>
            <div className="quiz-score-label">{result?.correct}/{result?.total} correct</div>
            <p className="quiz-message">{result?.message}</p>
          </div>

          <div className="quiz-review">
            <h3>Review Answers</h3>
            {questions.map((q, i) => {
              const userAns = answers[q.id];
              const correctAns = answerKey.find(a => a.id === q.id);
              const isCorrect = userAns === correctAns?.answer;
              return (
                <div key={i} className={`quiz-review-item ${isCorrect ? 'correct' : 'wrong'}`}>
                  <div className="review-q">
                    <span>{isCorrect ? '✅' : '❌'}</span>
                    <strong>{q.question}</strong>
                  </div>
                  <div className="review-answers">
                    <div className="review-your">Your answer: <span>{q.options[userAns]}</span></div>
                    {!isCorrect && <div className="review-correct">Correct: <span>{q.options[correctAns?.answer]}</span></div>}
                    {correctAns?.explanation && <div className="review-explanation">💡 {correctAns.explanation}</div>}
                  </div>
                </div>
              );
            })}
          </div>

          <button className="quiz-retry-btn" onClick={loadQuiz}>🔄 Try Again</button>
        </div>
      )}
    </div>
  );
}
