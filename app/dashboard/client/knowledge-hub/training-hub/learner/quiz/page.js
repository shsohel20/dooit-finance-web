"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const questions = [
    {
      id: "1",
      text: "What does KYC stand for?",
      type: "single",
      answers: [
        { id: "a", text: "Know Your Client" },
        { id: "b", text: "Keep Your Company" },
        { id: "c", text: "Know Your Compliance" },
        { id: "d", text: "Kindred Youth Club" },
      ],
    },
    {
      id: "2",
      text: "Which of the following are part of KYC? (Select all that apply)",
      type: "multiple",
      answers: [
        { id: "a", text: "Identity verification" },
        { id: "b", text: "Source of funds verification" },
        { id: "c", text: "Beneficial ownership verification" },
        { id: "d", text: "Personal social media review" },
      ],
    },
    {
      id: "3",
      text: "OFAC stands for Office of Foreign Assets Control.",
      type: "truefalse",
      answers: [
        { id: "true", text: "True" },
        { id: "false", text: "False" },
      ],
    },
    {
      id: "4",
      text: "What is the primary purpose of AML compliance?",
      type: "single",
      answers: [
        {
          id: "a",
          text: "To prevent money laundering and terrorist financing",
        },
        { id: "b", text: "To increase company profits" },
        { id: "c", text: "To reduce customer satisfaction" },
        { id: "d", text: "To simplify banking processes" },
      ],
    },
    {
      id: "5",
      text: "Suspicious Activity Reports (SARs) must be filed within how many days?",
      type: "single",
      answers: [
        { id: "a", text: "30 days" },
        { id: "b", text: "60 days" },
        { id: "c", text: "90 days" },
        { id: "d", text: "180 days" },
      ],
    },
  ];

  const question = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;
  const allAnswered = Object.keys(userAnswers).length === questions.length;

  const handleAnswer = (answerId) => {
    setUserAnswers((prev) => ({
      ...prev,
      [question.id]:
        question.type === "multiple"
          ? prev[question.id]?.includes(answerId)
            ? prev[question.id].filter((id) => id !== answerId)
            : [...(prev[question.id] || []), answerId]
          : [answerId],
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    // Mock correct answers
    const correctAnswers = {
      1: ["a"],
      2: ["a", "b", "c"],
      3: ["true"],
      4: ["a"],
      5: ["b"],
    };

    Object.keys(userAnswers).forEach((questionId) => {
      const userAns = userAnswers[questionId].sort();
      const correctAns = correctAnswers[questionId].sort();
      if (
        userAns.length === correctAns.length &&
        userAns.every((val, idx) => val === correctAns[idx])
      ) {
        correct++;
      }
    });

    const percentage = Math.round((correct / questions.length) * 100);
    setScore(percentage);
    setShowResults(true);
  };

  if (showResults) {
    const passed = score >= 70;
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Results Card */}
        <Card className="border-border">
          <CardHeader>
            <div className="text-center space-y-4">
              <div
                className={`text-6xl font-bold ${
                  passed ? "text-[hsl(142_71%_45%)]" : "text-destructive"
                }`}
              >
                {score}%
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {passed ? "Quiz Passed!" : "Quiz Failed"}
                </h1>
                <p className="text-muted-foreground mt-2">
                  {passed
                    ? "Congratulations! You passed the assessment."
                    : "You did not meet the passing score of 70%."}
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Results Details */}
        <Card className="border-border">
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Correct Answers</p>
                <p className="text-2xl font-bold mt-1">
                  {Math.round((score / 100) * questions.length)}/{questions.length}
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Pass Score</p>
                <p className="text-2xl font-bold mt-1">70%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          {passed ? (
            <>
              <Button variant="outline" className="flex-1 bg-transparent">
                Review Answers
              </Button>
              <Button className="flex-1">Continue Learning</Button>
            </>
          ) : (
            <>
              <Button variant="outline" className="flex-1 bg-transparent">
                Review Answers
              </Button>
              <Button className="flex-1">Retake Quiz</Button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Quiz</h1>
        <p className="text-muted-foreground">
          Answer the following questions to test your knowledge.
        </p>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Question Progress</span>
          <span className="text-sm text-muted-foreground">
            {currentQuestion + 1} of {questions.length}
          </span>
        </div>
        <Progress value={((currentQuestion + 1) / questions.length) * 100} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>
            Question {currentQuestion + 1} of {questions.length}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Question Text */}
          <div>
            <p className="text-lg font-medium text-foreground">{question.text}</p>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {question.type === "single" ? (
              <RadioGroup
                value={userAnswers[question.id]?.[0] || ""}
                onValueChange={(value) => {
                  setUserAnswers((prev) => ({
                    ...prev,
                    [question.id]: [value],
                  }));
                }}
              >
                {question.answers.map((answer) => (
                  <div
                    key={answer.id}
                    className="flex items-center gap-3 p-4 border border-border rounded-lg hover:border-primary/50 cursor-pointer"
                  >
                    <RadioGroupItem value={answer.id} id={answer.id} />
                    <Label htmlFor={answer.id} className="flex-1 cursor-pointer font-normal">
                      {answer.text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <div className="space-y-3">
                {question.answers.map((answer) => (
                  <div
                    key={answer.id}
                    className="flex items-center gap-3 p-4 border border-border rounded-lg hover:border-primary/50 cursor-pointer"
                  >
                    <Checkbox
                      id={answer.id}
                      checked={userAnswers[question.id]?.includes(answer.id) || false}
                      onCheckedChange={() => handleAnswer(answer.id)}
                    />
                    <Label htmlFor={answer.id} className="flex-1 cursor-pointer font-normal">
                      {answer.text}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-primary/10 border border-primary rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-primary">
                {question.type === "multiple"
                  ? "Multiple answers may be correct"
                  : "Select one answer"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1 bg-transparent"
          disabled={currentQuestion === 0}
          onClick={() => setCurrentQuestion(currentQuestion - 1)}
        >
          Previous
        </Button>

        {isLastQuestion ? (
          <Button className="flex-1" onClick={calculateScore} disabled={!allAnswered}>
            Submit Quiz
          </Button>
        ) : (
          <Button
            className="flex-1"
            onClick={() => setCurrentQuestion(currentQuestion + 1)}
            disabled={!userAnswers[question.id]}
          >
            Next Question
          </Button>
        )}
      </div>
    </div>
  );
}
