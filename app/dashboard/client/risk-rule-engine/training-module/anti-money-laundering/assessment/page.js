"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Clock, CheckCircle2, ArrowRight, AlertCircle, Shield, XCircle } from "lucide-react"
import Link from "next/link"


export default function AssessmentPage() {
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const questions = [
    {
      id: 1,
      question:
        "What is the first stage of money laundering, where illegal funds are introduced into the financial system?",
      options: ["Integration", "Layering", "Placement", "Structuring"],
      correct: "Placement",
      explanation:
        "Placement is the initial stage where criminals introduce illegal funds into the financial system. This is when they're most vulnerable to detection. When illegal cash first enters a bank or legitimate business, it creates the primary opportunity for authorities to identify and stop the process.",
    },
    {
      id: 2,
      question:
        "You are a bank teller. A customer you know to be unemployed regularly deposits $9,900 in cash. This is most likely an example of:",
      options: [
        "Excellent customer service.",
        "A red flag for the Placement stage.",
        "Standard investment strategy.",
        "Integration.",
      ],
      correct: "A red flag for the Placement stage.",
      explanation:
        "Deposits just under $10,000 are a classic red flag for 'structuring' or 'smurfing' - deliberately avoiding the $10,000 threshold that triggers mandatory reporting requirements. When combined with an unemployed status and regular patterns, this strongly suggests Placement-stage money laundering activity.",
    },
    {
      id: 3,
      question:
        "You are an accountant. A new client with poor business history asks you to register five new companies for them. This could be a sign of:",
      options: [
        "A savvy entrepreneur.",
        "The Layering stage of money laundering.",
        "Tax optimization.",
        "A marketing strategy.",
      ],
      correct: "The Layering stage of money laundering.",
      explanation:
        "Creating complex corporate structures with no clear business purpose is a classic Layering technique. It distances money from its illegal source by moving it through multiple entities and jurisdictions, making the paper trail difficult to follow. A poor business history combined with multiple new entities is a significant red flag.",
    },
    {
      id: 4,
      question: "Which of the following is a potential consequence of poor compliance for your firm?",
      options: [
        "Increased customer satisfaction.",
        "Multi-million dollar fines and reputational damage.",
        "Reduced paperwork.",
        "More flexible regulations.",
      ],
      correct: "Multi-million dollar fines and reputational damage.",
      explanation:
        "Poor compliance leads to serious consequences including multi-million dollar fines, severe reputational damage that can destroy partnerships and client trust, and personal criminal charges with potential jail time for compliance officers. It certainly does NOT lead to increased customer satisfaction - in fact, legitimate customers prefer doing business with compliant, trustworthy institutions.",
    },
  ]

  const handleAnswerSelect = (questionId, answer) => {
    if (submitted) return

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const calculateScore = () => {
    let correct = 0
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correct) {
        correct++
      }
    })
    return Math.round((correct / questions.length) * 100)
  }

  const handleSubmit = () => {
    setSubmitted(true)
  }

  const allAnswered = Object.keys(selectedAnswers).length === questions.length
  const score = allAnswered ? calculateScore() : null
  const passed = score !== null && score >= 75

  const handleRetake = () => {
    setSelectedAnswers({})
    setSubmitted(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-primary flex items-center justify-center">
              <BookOpen className="size-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Anti-Money Laundering Training</h1>
              <p className="text-sm text-muted-foreground">Essential compliance training for financial professionals</p>
            </div>
          </div>
          <div className="text-xs font-mono bg-secondary/10 text-primary px-3 py-1 rounded">AML-TR-2023-03-A</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        {submitted && !passed && (
          <Card className="mb-6 p-6 bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-900">
            <div className="flex items-start gap-3">
              <XCircle className="size-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-red-900 dark:text-red-400 text-lg mb-2">You have made a mistake!</h3>
                <p className="text-sm text-red-700 dark:text-red-300">
                  Your score of {score}% is below the required 75% passing threshold. Please review the answer key and
                  explanations below to understand where you went wrong.
                </p>
                <Button className={`mt-4
                  `} onClick={handleRetake} variant="outline" size="lg">Retake Assessment</Button>
              </div>
            </div>
          </Card>
        )}

        {submitted && passed && (
          <Card className="mb-6 p-6 bg-green-50 dark:bg-green-950/20 border-2 border-green-200 dark:border-green-900">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="size-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-green-900 dark:text-green-400 text-lg mb-2">Congratulations!</h3>
                <p className="text-sm text-green-700 dark:text-green-300">
                  You passed the assessment with a score of {score}%. You have successfully completed the Anti-Money
                  Laundering training module.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Purpose & Objectives Section */}
        {!submitted && (
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
            <div className="flex items-center gap-2 ">

              <h2 className="text-primary font-medium text-sm mb-2">Training Overview</h2>
            </div>

            <h3 className="text-2xl font-bold text-foreground mb-3">Purpose & Objectives</h3>

            <p className="text-muted-foreground mb-4">
              This training module provides essential knowledge on Anti-Money Laundering (AML) compliance requirements.
              Upon completion, participants should be able to:
            </p>

            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-foreground">Identify the three stages of money laundering</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-foreground">Recognize red flags and suspicious activities</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-foreground">Understand the consequences of AML non-compliance</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-foreground">Apply knowledge to real-world financial scenarios</span>
              </li>
            </ul>

            {/* Duration and Score Cards */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-5 border-2 border-primary/20 bg-primary/5">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Estimated Duration</p>
                    <p className="text-lg font-semibold text-foreground">10 minutes</p>
                  </div>
                </div>
              </Card>

              <Card className="p-5 border-2 border-teal-500/20 bg-teal-500/5">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-teal-500/10 flex items-center justify-center">
                    <CheckCircle2 className="size-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Required Score</p>
                    <p className="text-lg font-semibold text-foreground">75% to pass</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Assessment Questions Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <AlertCircle className="size-5 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">
              {submitted ? "Answer Key & Explanations" : "Assessment Questions"}
            </h2>
          </div>

          {!submitted && (
            <Card className="p-6 mb-6 bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
              <h4 className="font-semibold text-foreground mb-2">Instructions</h4>
              <p className="text-sm text-muted-foreground">
                Select the correct answer for each question below. All questions must be answered to complete the
                training. Review your answers before final submission.
              </p>
            </Card>
          )}

          {/* Questions */}
          <div className="space-y-6">
            {questions.map((q) => {
              const isCorrect = selectedAnswers[q.id] === q.correct
              const userAnswer = selectedAnswers[q.id]

              return (
                <Card key={q.id} className="p-6 border-2 hover:border-primary/30 transition-colors">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                        Question {q.id} of {questions.length}
                      </span>
                      {submitted && (
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded flex items-center gap-1 ${isCorrect
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
                      const isSelected = selectedAnswers[q.id] === option
                      const isCorrectAnswer = option === q.correct
                      const showAsCorrect = submitted && isCorrectAnswer
                      const showAsIncorrect = submitted && isSelected && !isCorrect

                      return (
                        <label
                          key={index}
                          className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-all ${submitted
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
                          {showAsCorrect && <CheckCircle2 className="size-5 text-green-600 flex-shrink-0" />}
                          {showAsIncorrect && <XCircle className="size-5 text-red-600 flex-shrink-0" />}
                        </label>
                      )
                    })}
                  </div>

                  {submitted && (
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg">
                      <h5 className="font-semibold text-sm text-foreground mb-2 flex items-center gap-2">
                        <AlertCircle className="size-4 text-blue-600" />
                        Answer Explanation
                      </h5>
                      <p className="text-sm text-muted-foreground leading-relaxed">{q.explanation}</p>
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        </div>

        {/* Submit Section */}
        {!submitted && (
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-teal-500/5 border-2">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-semibold text-foreground mb-1">Ready to submit?</h4>
                <p className="text-sm text-muted-foreground">
                  {allAnswered
                    ? "All questions answered. Click submit to see your results."
                    : `Please answer all ${questions.length} questions before submitting.`}
                </p>
              </div>
              <Button size="lg" disabled={!allAnswered} onClick={handleSubmit} className="group">
                Submit Assessment
                <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </Card>
        )}

        {submitted && (
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-teal-500/5 border-2">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center">
                {passed ? (
                  <CheckCircle2 className="size-8 text-green-600" />
                ) : (
                  <XCircle className="size-8 text-red-600" />
                )}
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-xl mb-2">
                  {passed ? "Training Complete!" : "Please Try Again"}
                </h4>
                <p className="text-muted-foreground mb-4">
                  {passed
                    ? "You have successfully completed the Anti-Money Laundering training module."
                    : "Review the explanations above and consider retaking the training module."}
                </p>
                <Link href="/">
                  <Button size="lg" className="group">
                    {passed ? "Complete Training" : "Return to Training"}
                    <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        )}

        {/* Back to Training Link */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
            ← Back to Training Module
          </Link>
        </div>
      </main>
    </div>
  )
}
