"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, CheckCircle2, AlertCircle, CheckSquare, ArrowLeft, ArrowRight } from "lucide-react"

const questions = [
  {
    id: 1,
    question:
      "You are a VASP employee. A user deposits $900 in crypto from a high-risk wallet, then immediately transfers it to five other wallets. This is a red flag for:",
    options: ["Excellent privacy practices.", "The Layering stage.", "Standard crypto trading.", "Customer loyalty."],
    correctAnswer: 1,
    explanation:
      "Rapid movement of funds between multiple wallets from a high-risk source is a classic layering technique used to obscure the origin of illicit cryptocurrency.",
  },
  {
    id: 2,
    question:
      "You are a real estate agent. A client pays a holding deposit for a multi-million dollar property with a briefcase of cash. What should you do?",
    options: [
      "Accept it and thank them for their business.",
      "Recognize it as a red flag and report it through the proper channel.",
      "Suggest they get a bank cheque instead, but take the cash if they refuse.",
      "Tell the client they seem suspicious.",
    ],
    correctAnswer: 1,
    explanation:
      "Large cash payments for high-value real estate are a significant red flag. Professionals must follow their firm's procedures for reporting suspicious activities while avoiding 'tipping off' the client.",
  },
  {
    id: 3,
    question:
      "What does 'Tipping Off' mean?",
    options: [
      "Giving a customer a helpful hint.",
      "Illegally warning a customer that they are under suspicion.",
      "Counting cash tips from a customer.",
      "Reporting a suspicion to your manager.",
    ],
    correctAnswer: 2,
    explanation:
      "'Tipping off' is a criminal offense in many jurisdictions. It involves informing a customer that a suspicious activity report (SAR) has been filed or that they are under investigation, which can compromise the investigation.",
  },
  {
    id: 4,
    question: "You are a gambling compliance officer. A customer loses 95% of a $100,000 cash buy-in on a single low-odds bet and then cashes out the remaining $5,000. This could be:",
    options: [
      "A very unlucky gambler.",
      "A potential attempt to integrate illicit funds.",
      "Standard gambling behavior.",
      "A sign of a problem gambler, but not an AML concern.",
    ],
    correctAnswer: 2,
    explanation:
      "This could represent 'integration' where illicit cash is converted to 'clean' funds through gambling. The customer may accept significant losses to legitimize the remaining funds as gambling winnings.",
  },
]

export default function DooitAssessmentPage() {
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswerChange = (questionId, answerIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }))
  }
  const allAnswered = questions.every((q) => answers[q.id] !== undefined)
  const handleSubmit = () => {


    if (!allAnswered) {
      alert("Please answer all questions before submitting.")
      return
    }

    let correctCount = 0
    questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        correctCount++
      }
    })

    const finalScore = Math.round((correctCount / questions.length) * 100)
    setScore(finalScore)
    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleRetake = () => {
    setAnswers({})
    setSubmitted(false)
    setScore(0)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const isQuestionCorrect = (questionId) => {
    const question = questions.find((q) => q.id === questionId)
    return question && answers[questionId] === question.correctAnswer
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-5xl px-4 py-12">
        {/* Header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <Link
              href="/dooit-ecosystem"
              className="mb-4 inline-flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Training Module
            </Link>
            <h1 className="text-lg font-semibold text-foreground">Advanced AML Compliance Training</h1>
            <p className="text-sm text-muted-foreground">
              Interactive scenario-based assessment for financial professionals
            </p>
          </div>

          <p className="text-xs font-mono bg-secondary/10 text-primary px-3 py-1 rounded">AML-TR-2023-04-B</p>

        </div>

        {/* Success/Error Message */}
        {submitted && (
          <Card
            className={`mb-8 border-2 ${score >= 75 ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {score >= 75 ? (
                  <CheckCircle2 className="h-8 w-8 flex-shrink-0 text-green-600" />
                ) : (
                  <AlertCircle className="h-8 w-8 flex-shrink-0 text-red-600" />
                )}
                <div className="flex-1">
                  <h3 className={`text-xl font-bold ${score >= 75 ? "text-green-900" : "text-red-900"}`}>
                    {score >= 75 ? "Congratulations! You passed!" : "You have made a mistake!"}
                  </h3>
                  <p className={`mt-1 ${score >= 75 ? "text-green-700" : "text-red-700"}`}>
                    {score >= 75
                      ? `You scored ${score}% on this assessment. You have demonstrated strong understanding of AML compliance principles.`
                      : `You scored ${score}%. You need at least 75% to pass. Please review the explanations below and retake the assessment.`}
                  </p>
                  {score < 75 && (
                    <Button className={`mt-4
                  `} onClick={handleRetake} variant="outline" size="lg">Retake Assessment</Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Purpose & Objectives */}
        <Card className="mb-8 ">
          <CardContent className="p-6">
            <p className="mb-3 text-sm font-medium text-primary">Advanced Training Overview</p>
            <h2 className="mb-4 text-2xl font-bold ">Purpose & Objectives</h2>
            <p className="mb-4 text-slate-700">
              This training module provides essential knowledge on Anti-Money Laundering (AML) compliance requirements.
              Upon completion, participants should be able to:
            </p>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start gap-2">
                <CheckSquare className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                <span>Identify the three stages of money laundering</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckSquare className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                <span>Recognize red flags and suspicious activities</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckSquare className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                <span>Understand compliance obligations and consequences</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckSquare className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                <span>Apply knowledge to real-world financial scenarios</span>
              </li>
            </ul>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-primary/5 p-4">
                <div className="mb-2 flex items-center gap-2 text-primary">
                  <Clock className="h-5 w-5" />
                  <span className="font-semibold">Estimated Duration</span>
                </div>
                <p className="text-2xl font-bold text-primary">10 minutes</p>
              </div>
              <div className="rounded-lg bg-primary/5 p-4">
                <div className="mb-2 flex items-center gap-2 text-primary">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-semibold">Required Score</span>
                </div>
                <p className="text-2xl font-bold text-primary">75% to pass</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scenario-Based Assessment */}
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">Scenario-Based Assessment</h2>

          <Card className="mb-6 bg-slate-50">
            <CardContent className="p-6">
              <h3 className="mb-2 font-semibold text-slate-900">Instructions</h3>
              <p className="text-slate-700">
                Read each scenario carefully and select the most appropriate response based on AML compliance
                principles. All questions are based on real-world situations you might encounter in your role.
              </p>
            </CardContent>
          </Card>

          {/* Questions */}
          <div className="space-y-6">
            {questions.map((question, index) => {
              const isCorrect = isQuestionCorrect(question.id)
              return (
                <Card
                  key={question.id}
                  className={`border-2 ${submitted
                    ? isCorrect
                      ? "border-green-200 "
                      : "border-red-200 "
                    : "border-slate-200"
                    }`}
                >
                  <CardContent className="p-6">
                    {/* Question Header */}
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="mb-2 text-sm font-medium text-slate-600">
                          Question {index + 1} of {questions.length}
                        </p>
                        <p className="text-lg font-medium text-slate-900">{question.question}</p>
                      </div>
                      {/* Correct/Incorrect Badge */}
                      {submitted && (
                        <div
                          className={`flex items-center gap-2 rounded-full px-4 py-2 ${isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}
                        >
                          {isCorrect ? (
                            <>
                              <CheckCircle2 className="h-5 w-5" />
                              <span className="font-semibold">Correct</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-5 w-5" />
                              <span className="font-semibold">Incorrect</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Options */}
                    <div className="space-y-3">
                      {question.options.map((option, optionIndex) => {
                        const isSelected = answers[question.id] === optionIndex
                        const isCorrectOption = optionIndex === question.correctAnswer

                        return (
                          <label
                            key={optionIndex}
                            className={`flex cursor-pointer items-start gap-3 rounded-lg border-2 p-4 transition-all ${submitted
                              ? isCorrectOption
                                ? "border-green-300 bg-green-50"
                                : isSelected
                                  ? "border-red-300 bg-red-50"
                                  : "border-slate-200 bg-white opacity-60"
                              : isSelected
                                ? "border-teal-500 bg-teal-50"
                                : "border-slate-200 bg-white hover:border-slate-300"
                              }`}
                          >
                            <input
                              type="radio"
                              name={`question-${question.id}`}
                              checked={isSelected}
                              onChange={() => handleAnswerChange(question.id, optionIndex)}
                              disabled={submitted}
                              className="mt-1 h-4 w-4 text-teal-600 focus:ring-teal-500"
                            />
                            <span
                              className={`flex-1 ${submitted && isCorrectOption ? "font-semibold text-green-900" : "text-slate-700"
                                }`}
                            >
                              {option}
                            </span>
                            {submitted && isCorrectOption && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                          </label>
                        )
                      })}
                    </div>

                    {submitted && (
                      <div className="mt-4 rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
                        <div className="flex gap-3">
                          <AlertCircle className="h-5 w-5 flex-shrink-0 text-blue-600" />
                          <div>
                            <h4 className="mb-1 font-semibold text-blue-900">Explanation</h4>
                            <p className="text-sm text-blue-800">{question.explanation}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Submit Button */}
        {/* {!submitted && (
          <div className="flex justify-center">
            <Button
              onClick={handleSubmit}
              size="lg"
              className="bg-gradient-to-r from-teal-600 to-blue-600 px-8 text-lg hover:from-teal-700 hover:to-blue-700"
            >
              Submit Assessment
            </Button>
          </div>
        )} */}
        {!submitted && <Card className="p-6 bg-gradient-to-br from-primary/5 to-teal-500/5 border-2">
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
        </Card>}

        {/* Success Actions */}
        {submitted && score >= 75 && (
          <div className="flex justify-center gap-4">
            <Button onClick={handleRetake} variant="outline" size="lg">
              Retake Assessment
            </Button>
            <Link href="/dooit-ecosystem">
              <Button
                size="lg"
                className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700"
              >
                Return to Training Module
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
