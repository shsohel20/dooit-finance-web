const QuestionCard = ({
  question,
  options,
  correct,
  explanation,
  questions,
}) => {
  const isCorrect = selectedAnswers[q.id] === q.correct;
  return (
    <Card
      key={q.id}
      className="p-6 border-2 hover:border-primary/30 transition-colors"
    >
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
            Question {q.id} of {questions.length}
          </span>
          {submitted && (
            <span
              className={`text-xs font-semibold px-2 py-1 rounded flex items-center gap-1 ${
                isCorrect
                  ? "bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400"
                  : "bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400"
              }`}
            >
              {isCorrect ? (
                <>
                  <CheckCircle2 className="size-3" />
                  Correct
                </>
              ) : (
                <>
                  <XCircle className="size-3" />
                  Incorrect
                </>
              )}
            </span>
          )}
        </div>
        <p className="font-medium text-foreground">{q.question}</p>
      </div>

      <div className="space-y-3">
        {q.options.map((option, index) => {
          const isSelected = selectedAnswers[q.id] === option;
          const isCorrectAnswer = option === q.correct;
          const showAsCorrect = submitted && isCorrectAnswer;
          const showAsIncorrect = submitted && isSelected && !isCorrect;

          return (
            <label
              key={index}
              className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-all ${
                submitted
                  ? showAsCorrect
                    ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                    : showAsIncorrect
                    ? "border-red-500 bg-red-50 dark:bg-red-950/20"
                    : "border-border bg-background"
                  : isSelected
                  ? "border-primary bg-primary/5 cursor-pointer"
                  : "border-border hover:border-primary/30 hover:bg-accent cursor-pointer"
              }`}
            >
              <input
                type="radio"
                name={`question-${q.id}`}
                value={option}
                checked={isSelected}
                onChange={() => handleAnswerSelect(q.id, option)}
                disabled={submitted}
                className="mt-1 size-4 text-primary focus:ring-primary"
              />
              <span className="text-sm text-foreground flex-1">{option}</span>
              {showAsCorrect && (
                <CheckCircle2 className="size-5 text-green-600 flex-shrink-0" />
              )}
              {showAsIncorrect && (
                <XCircle className="size-5 text-red-600 flex-shrink-0" />
              )}
            </label>
          );
        })}
      </div>

      {submitted && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg">
          <h5 className="font-semibold text-sm text-foreground mb-2 flex items-center gap-2">
            <AlertCircle className="size-4 text-blue-600" />
            Answer Explanation
          </h5>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {q.explanation}
          </p>
        </div>
      )}
    </Card>
  );
};
export default QuestionCard;
