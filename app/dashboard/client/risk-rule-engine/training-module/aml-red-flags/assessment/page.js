"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Clock, CheckCircle2, AlertCircle, ArrowLeft, BookOpen, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Card } from "@/components/ui/card"

export default function AdvancedAssessmentPage() {
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const questions = [
    {
      id: 1,
      question:
        "You are a VASP employee. A user deposits $900 in crypto from a high-risk wallet, then immediately transfers it to five other wallets. This is a red flag for:",
      options: ["Excellent privacy practices.", "The Layering stage.", "Standard crypto trading.", "Customer loyalty."],
      correct: "The Layering stage.",
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
      correct: "Recognize it as a red flag and report it through the proper channel.",
      explanation:
        "Large cash payments for high-value real estate are a significant red flag. Professionals must follow their firm's procedures for reporting suspicious activities while avoiding 'tipping off' the client.",
    },
    {
      id: 3,
      question:
        "An accountant notices a client's business shows minimal revenue but regularly moves millions internationally. The client becomes defensive when asked about it. What stage is this?",
      options: [
        "Placement - introducing illicit funds.",
        "Layering - obscuring the source.",
        "Integration - legitimizing the funds.",
        "Normal business operations.",
      ],
      correct: "Integration - legitimizing the funds.",
      explanation:
        "Using a business with minimal legitimate activity to move large amounts internationally suggests integration. The criminal is trying to make dirty money appear legitimate through business transactions, even though the revenue doesn't support the transaction volumes.",
    },
    {
      id: 4,
      question:
        "You suspect a transaction is suspicious but you're not 100% certain. According to your legal duties, you should:",
      options: [
        "Wait until you have proof before reporting.",
        "Report it immediately based on reasonable suspicion.",
        "Ask the customer directly if they're laundering money.",
        "Ignore it since you're not sure.",
      ],
      correct: "Report it immediately based on reasonable suspicion.",
      explanation:
        "You don't need proof or certainty to report suspicious activity. Your legal obligation is to report based on reasonable suspicion. The compliance team and authorities will investigate further. Never confront the customer (no tipping off).",
    },
  ]

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer })
  }

  const handleSubmit = () => {
    let correctCount = 0
    questions.forEach((q) => {
      if (answers[q.id] === q.correct) correctCount++
    })
    const percentage = (correctCount / questions.length) * 100
    setScore(percentage)
    setSubmitted(true)
  }

  const allAnswered = questions.every((q) => answers[q.id])
  const passed = score >= 75

  const handleRetake = () => {
    setAnswers({})
    setSubmitted(false)
    setScore(0)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen ">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        {/* <div className="mb-8">
          <Link
            href="/dashboard/client/risk-rule-engine/training-module/aml-red-flags"
            className="inline-flex items-center text-teal-600 hover:text-teal-700 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Red Flags Module
          </Link>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Advanced AML Compliance Training</h1>
              <p className="text-slate-600 text-lg">
                Interactive scenario-based assessment for financial professionals
              </p>
            </div>
            <div className="bg-white border-2 border-slate-200 rounded-lg px-6 py-3">
              <p className="text-sm text-slate-600 mb-1">Training Module</p>
              <p className="text-lg font-semibold text-slate-900">AML-TR-2023-04-B</p>
            </div>
          </div>
        </div> */}



        <header className="border-b border-border bg-card sticky top-0 z-10">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-primary flex items-center justify-center">
                <BookOpen className="size-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">Advanced AML Compliance Training</h1>
                <p className="text-sm text-muted-foreground">Training Module</p>
              </div>
            </div>
            <div className="text-xs font-mono bg-secondary/10 text-primary px-3 py-1 rounded">AML-TR-2023-04-B</div>
          </div>
        </header>



        {/* Purpose & Objectives */}
        <div className="bg-white rounded-2xl shadow-sm p-8 my-8">
          <p className="text-primary font-medium text-sm mb-2">Advanced Training Overview</p>
          <h2 className="text-2xl font-bold text-foreground mb-3">Purpose & Objectives</h2>

          <p className="text-muted-foreground mb-4">
            This training module provides essential knowledge on Anti-Money Laundering (AML) compliance requirements.
            Upon completion, participants should be able to:
          </p>

          <ul className="space-y-2 mb-6">
            {[
              "Identify the three stages of money laundering",
              "Recognize red flags and suspicious activities",
              "Understand compliance obligations and consequences",
              "Apply knowledge to real-world financial scenarios",
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-slate-700 mb-2">Estimated Duration</p>
              <div className="flex items-center gap-2 text-slate-900">
                <Clock className="w-5 h-5" />
                <span className="font-medium">10 minutes</span>
              </div>
            </div>
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-slate-700 mb-2">Required Score</p>
              <div className="flex items-center gap-2 text-slate-900">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">75% to pass</span>
              </div>
            </div>
          </div>
        </div>

        {/* Success/Error Message */}
        {submitted && (
          <div
            className={`rounded-lg border-l-4 p-6 mb-8 ${passed ? "bg-green-50 border-green-500" : "bg-red-50 border-red-500"
              }`}
          >
            <div className="flex items-start gap-3">
              {passed ? (
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <h3 className={`font-bold text-lg mb-1 ${passed ? "text-green-900" : "text-red-900"}`}>
                  {passed ? "Congratulations! You passed!" : "You have made a mistake!"}
                </h3>
                <p className={passed ? "text-green-800" : "text-red-800"}>
                  {passed
                    ? `You scored ${score}% and have successfully completed the Advanced AML Compliance Training. You've demonstrated strong understanding of AML compliance principles and scenario analysis.`
                    : `You scored ${score}%, which is below the required 75%. Please review the answer explanations below and retake the assessment to improve your understanding of AML compliance.`}
                </p>
                {!passed && <Button className={`mt-4
                  `} onClick={handleRetake} variant="outline" size="lg">Retake Assessment</Button>}
              </div>
            </div>
          </div>
        )}

        {/* Scenario-Based Assessment */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <AlertCircle className="w-6 h-6" />
            Scenario-Based Assessment
          </h2>

          {/* Instructions */}
          <div className="bg-slate-50 rounded-lg p-4 mb-8">
            <h3 className="font-semibold text-slate-900 mb-2">Instructions</h3>
            <p className="text-slate-700 text-sm">
              Read each scenario carefully and select the most appropriate response based on AML compliance principles.
              All questions are based on real-world situations you might encounter in your role.
            </p>
          </div>

          {/* Questions */}
          <div className="space-y-8">
            {questions.map((q) => {
              const isQuestionCorrect = submitted && answers[q.id] === q.correct

              return (
                <div
                  key={q.id}
                  className={`border rounded-xl p-6 ${submitted
                    ? isQuestionCorrect
                      ? "border-green-300 bg-green-50/30"
                      : "border-red-300 bg-red-50/30"
                    : "border-slate-200"
                    }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-500 mb-2">
                        Question {q.id} of {questions.length}
                      </p>
                      <p className="text-slate-900 font-medium">{q.question}</p>
                    </div>
                    {submitted && (
                      <div
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${isQuestionCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}
                      >
                        {isQuestionCorrect ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            Correct
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-4 h-4" />
                            Incorrect
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 mb-4">
                    {q.options.map((option, index) => {
                      const isSelected = answers[q.id] === option
                      const isCorrect = option === q.correct
                      const showFeedback = submitted

                      return (
                        <label
                          key={index}
                          className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${showFeedback
                            ? isCorrect
                              ? "border-green-500 bg-green-50"
                              : isSelected
                                ? "border-red-500 bg-red-50"
                                : "border-slate-200 bg-white"
                            : isSelected
                              ? "border-teal-500 bg-teal-50"
                              : "border-slate-200 bg-white hover:border-slate-300"
                            }`}
                        >
                          <input
                            type="radio"
                            name={`question-${q.id}`}
                            value={option}
                            checked={isSelected}
                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                            disabled={submitted}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <span className="text-slate-900">{option}</span>
                            {showFeedback && isCorrect && (
                              <div className="flex items-center gap-1 text-green-700 text-sm font-medium mt-1">
                                <CheckCircle2 className="w-4 h-4" />
                                Correct Answer
                              </div>
                            )}
                            {showFeedback && !isCorrect && isSelected && (
                              <div className="flex items-center gap-1 text-red-700 text-sm font-medium mt-1">
                                <AlertCircle className="w-4 h-4" />
                                Your Answer
                              </div>
                            )}
                          </div>
                        </label>
                      )
                    })}
                  </div>

                  {submitted && (
                    <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mt-4">
                      <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        Answer Explanation
                      </h4>
                      <p className="text-blue-800 text-sm leading-relaxed">{q.explanation}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Submit Button */}
        {!submitted && (
          <>

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
          </>
        )}
      </div>
    </div>
  )
}
