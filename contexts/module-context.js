"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

const ModuleContext = createContext(undefined);

// Initialize mock data for demo purposes
function initializeMockData() {
  return [
    {
      id: "mock-1",
      title: "KYC Fundamentals",
      description: "Learn the basics of Know Your Customer requirements and best practices",
      createdBy: "1",
      createdAt: new Date("2024-01-15"),
      status: "published",
      parts: [
        {
          id: "part-1",
          title: "Introduction to KYC",
          videoUrl:
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          questions: [
            {
              id: "q1",
              question: "What does KYC stand for?",
              type: "multiple-choice",
              options: [
                "Know Your Customer",
                "Keep Your Cash",
                "Knowledge Year Certificate",
                "Key Year Compliance",
              ],
              correctAnswer: 0,
              explanation:
                "KYC stands for Know Your Customer, a process used to verify customer identity.",
            },
            {
              id: "q2",
              question: "Is KYC required by financial regulations?",
              type: "true-false",
              options: ["True", "False"],
              correctAnswer: 0,
              explanation: "Yes, KYC is mandatory under most financial regulations worldwide.",
            },
          ],
        },
        {
          id: "part-2",
          title: "Customer Identification Process",
          videoUrl:
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          questions: [
            {
              id: "q3",
              question: "Which documents are typically required for KYC verification?",
              type: "multiple-choice",
              options: [
                "Government ID only",
                "Proof of address only",
                "Government ID and proof of address",
                "No documents needed",
              ],
              correctAnswer: 2,
              explanation: "KYC typically requires both government-issued ID and proof of address.",
            },
          ],
        },
      ],
    },
    {
      id: "mock-2",
      title: "Anti-Money Laundering (AML) Basics",
      description: "Understanding AML regulations and how to identify suspicious activities",
      createdBy: "1",
      createdAt: new Date("2024-01-20"),
      status: "published",
      parts: [
        {
          id: "part-1",
          title: "What is Money Laundering?",
          videoUrl:
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          questions: [
            {
              id: "q1",
              question: "What are the three stages of money laundering?",
              type: "multiple-choice",
              options: [
                "Placement, Layering, Integration",
                "Collection, Transfer, Withdrawal",
                "Deposit, Hide, Spend",
                "Start, Middle, End",
              ],
              correctAnswer: 0,
              explanation:
                "The three stages are Placement (introducing illegal funds), Layering (obscuring the trail), and Integration (making funds appear legitimate).",
            },
            {
              id: "q2",
              question: "Should you report suspicious transactions?",
              type: "true-false",
              options: ["True", "False"],
              correctAnswer: 0,
              explanation:
                "Yes, reporting suspicious transactions is a legal requirement under AML regulations.",
            },
          ],
        },
      ],
    },
    {
      id: "mock-3",
      title: "Transaction Monitoring",
      description: "Learn how to monitor and flag suspicious financial transactions",
      createdBy: "2",
      createdAt: new Date("2024-02-01"),
      status: "published",
      parts: [
        {
          id: "part-1",
          title: "Red Flags in Transactions",
          videoUrl:
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
          questions: [
            {
              id: "q1",
              question: "Which of the following is a red flag for suspicious activity?",
              type: "multiple-choice",
              options: [
                "Regular salary deposits",
                "Multiple small transactions just below reporting threshold",
                "Single large legitimate purchase",
                "Monthly bill payments",
              ],
              correctAnswer: 1,
              explanation:
                "Structuring transactions to avoid reporting thresholds (smurfing) is a major red flag.",
            },
            {
              id: "q2",
              question: "Should unusual transaction patterns always be investigated?",
              type: "true-false",
              options: ["True", "False"],
              correctAnswer: 0,
              explanation:
                "Yes, unusual patterns should always be investigated to rule out potential money laundering.",
            },
          ],
        },
      ],
    },
  ];
}

function initializeMockAssignments() {
  const now = new Date();
  const futureDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days from now

  return [
    {
      id: "assign-1",
      moduleId: "mock-1",
      assignedTo: ["3"], // Learner user ID
      assignedBy: "2",
      assignedAt: new Date("2024-01-15"),
      dueDate: futureDate,
      maxAttempts: 3,
    },
    {
      id: "assign-2",
      moduleId: "mock-2",
      assignedTo: ["3"],
      assignedBy: "2",
      assignedAt: new Date("2024-01-20"),
      dueDate: new Date(futureDate.getTime() + 7 * 24 * 60 * 60 * 1000), // 21 days from now
      maxAttempts: 3,
    },
    {
      id: "assign-3",
      moduleId: "mock-3",
      assignedTo: ["3"],
      assignedBy: "1",
      assignedAt: new Date("2024-02-01"),
      dueDate: new Date(futureDate.getTime() + 14 * 24 * 60 * 60 * 1000), // 28 days from now
    },
  ];
}

export function ModuleProvider({ children }) {
  const [modules, setModules] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [progress, setProgress] = useState([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedModules = localStorage.getItem("aml_modules");
      const savedAssignments = localStorage.getItem("aml_assignments");
      const savedProgress = localStorage.getItem("aml_progress");

      if (savedModules) {
        const parsedModules = JSON.parse(savedModules).map((m) => ({
          ...m,
          createdAt: new Date(m.createdAt),
        }));
        setModules(parsedModules);
      } else {
        // Initialize with mock data if no data exists
        const mockModules = initializeMockData();
        setModules(mockModules);
      }

      if (savedAssignments) {
        const parsedAssignments = JSON.parse(savedAssignments).map((a) => ({
          ...a,
          assignedAt: new Date(a.assignedAt),
          dueDate: a.dueDate ? new Date(a.dueDate) : undefined,
        }));
        setAssignments(parsedAssignments);
      } else {
        // Initialize mock assignments for learner (id: '3')
        const mockAssignments = initializeMockAssignments();
        setAssignments(mockAssignments);
      }

      if (savedProgress) {
        const parsedProgress = JSON.parse(savedProgress).map((p) => ({
          ...p,
          completedAt: p.completedAt ? new Date(p.completedAt) : undefined,
          passedAt: p.passedAt ? new Date(p.passedAt) : undefined,
          attempts: p.attempts.map((a) => ({
            ...a,
            timestamp: new Date(a.timestamp),
          })),
        }));
        setProgress(parsedProgress);
      }
    } catch (error) {
      console.error("Failed to load data from localStorage:", error);
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage whenever modules change
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem("aml_modules", JSON.stringify(modules));
      } catch (error) {
        console.error("Failed to save modules to localStorage:", error);
      }
    }
  }, [modules, isHydrated]);

  // Save to localStorage whenever assignments change
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem("aml_assignments", JSON.stringify(assignments));
      } catch (error) {
        console.error("Failed to save assignments to localStorage:", error);
      }
    }
  }, [assignments, isHydrated]);

  // Save to localStorage whenever progress changes
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem("aml_progress", JSON.stringify(progress));
      } catch (error) {
        console.error("Failed to save progress to localStorage:", error);
      }
    }
  }, [progress, isHydrated]);

  const createModule = (title, description, createdBy) => {
    const newModule = {
      id: `mod_${Date.now()}`,
      title,
      description,
      createdBy,
      createdAt: new Date(),
      parts: [],
      status: "draft",
    };
    setModules((prev) => [...prev, newModule]);
    return newModule;
  };

  const updateModule = (moduleId, updates) => {
    setModules((prev) => prev.map((m) => (m.id === moduleId ? { ...m, ...updates } : m)));
  };

  const deleteModule = (moduleId) => {
    setModules((prev) => prev.filter((m) => m.id !== moduleId));
    setAssignments((prev) => prev.filter((a) => a.moduleId !== moduleId));
    setProgress((prev) => prev.filter((p) => p.moduleId !== moduleId));
  };

  const addPart = (moduleId, part) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              parts: [...m.parts, { ...part, id: `part_${Date.now()}` }],
            }
          : m,
      ),
    );
  };

  const updatePart = (moduleId, partId, updates) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              parts: m.parts.map((p) => (p.id === partId ? { ...p, ...updates } : p)),
            }
          : m,
      ),
    );
  };

  const deletePart = (moduleId, partId) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId ? { ...m, parts: m.parts.filter((p) => p.id !== partId) } : m,
      ),
    );
  };

  const addQuestion = (moduleId, partId, question) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              parts: m.parts.map((p) =>
                p.id === partId
                  ? {
                      ...p,
                      questions: [...p.questions, { ...question, id: `q_${Date.now()}` }],
                    }
                  : p,
              ),
            }
          : m,
      ),
    );
  };

  const updateQuestion = (moduleId, partId, questionId, updates) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              parts: m.parts.map((p) =>
                p.id === partId
                  ? {
                      ...p,
                      questions: p.questions.map((q) =>
                        q.id === questionId ? { ...q, ...updates } : q,
                      ),
                    }
                  : p,
              ),
            }
          : m,
      ),
    );
  };

  const deleteQuestion = (moduleId, partId, questionId) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              parts: m.parts.map((p) =>
                p.id === partId
                  ? {
                      ...p,
                      questions: p.questions.filter((q) => q.id !== questionId),
                    }
                  : p,
              ),
            }
          : m,
      ),
    );
  };

  const publishModule = (moduleId) => {
    setModules((prev) => prev.map((m) => (m.id === moduleId ? { ...m, status: "published" } : m)));
  };

  const assignModule = (moduleId, learnerIds, assignedBy, dueDate, maxAttempts) => {
    const newAssignment = {
      id: `assign_${Date.now()}`,
      moduleId,
      assignedTo: learnerIds,
      assignedBy,
      assignedAt: new Date(),
      dueDate,
      maxAttempts,
    };
    setAssignments((prev) => [...prev, newAssignment]);

    // Initialize progress for each learner
    learnerIds.forEach((learnerId) => {
      const existingProgress = progress.find(
        (p) => p.learnerId === learnerId && p.moduleId === moduleId,
      );
      if (!existingProgress) {
        const newProgress = {
          learnerId,
          moduleId,
          currentPartIndex: 0,
          attempts: [],
          watchedSeconds: {},
          isPassed: false,
          score: 0,
          attemptCount: 0,
        };
        setProgress((prev) => [...prev, newProgress]);
      }
    });
  };

  const recordAttempt = (learnerId, moduleId, partId, questionId, selectedAnswer) => {
    const mod = modules.find((m) => m.id === moduleId);
    if (!mod) return;

    const part = mod.parts.find((p) => p.id === partId);
    if (!part) return;

    const question = part.questions.find((q) => q.id === questionId);
    if (!question) return;

    const isCorrect = question.correctAnswer === selectedAnswer;

    setProgress((prev) =>
      prev.map((p) => {
        if (p.learnerId === learnerId && p.moduleId === moduleId) {
          const newAttempts = [
            ...p.attempts,
            {
              partId,
              questionId,
              selectedAnswer,
              isCorrect,
              timestamp: new Date(),
            },
          ];

          // Calculate score
          const correctAnswers = newAttempts.filter((a) => a.isCorrect).length;
          const totalQuestions = mod.parts.reduce((acc, pt) => acc + pt.questions.length, 0);
          const score = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

          return {
            ...p,
            attempts: newAttempts,
            score,
          };
        }
        return p;
      }),
    );
  };

  const updateWatchedSeconds = (learnerId, moduleId, partId, seconds) => {
    setProgress((prev) =>
      prev.map((p) => {
        if (p.learnerId === learnerId && p.moduleId === moduleId) {
          const watchedSeconds = { ...p.watchedSeconds };
          watchedSeconds[partId] = (watchedSeconds[partId] || 0) + seconds;
          return { ...p, watchedSeconds };
        }
        return p;
      }),
    );
  };

  const getModuleById = (moduleId) => {
    return modules.find((m) => m.id === moduleId);
  };

  const getLearnerProgress = (learnerId, moduleId) => {
    return progress.find((p) => p.learnerId === learnerId && p.moduleId === moduleId);
  };

  const getModuleAssignments = (learnerId) => {
    return assignments.filter((a) => a.assignedTo.includes(learnerId));
  };

  const retakeModule = (learnerId, moduleId) => {
    setProgress((prev) =>
      prev.map((p) => {
        if (p.learnerId === learnerId && p.moduleId === moduleId) {
          return {
            ...p,
            currentPartIndex: 0,
            attempts: [],
            watchedSeconds: {},
            isPassed: false,
            score: 0,
            attemptCount: p.attemptCount + 1,
            completedAt: undefined,
            passedAt: undefined,
          };
        }
        return p;
      }),
    );
  };

  const completeModule = (learnerId, moduleId) => {
    setProgress((prev) =>
      prev.map((p) => {
        if (p.learnerId === learnerId && p.moduleId === moduleId) {
          const isPassed = p.score >= 70; // 70% pass threshold
          return {
            ...p,
            isPassed,
            completedAt: new Date(),
            passedAt: isPassed ? new Date() : undefined,
          };
        }
        return p;
      }),
    );
  };

  return (
    <ModuleContext.Provider
      value={{
        modules,
        assignments,
        progress,
        createModule,
        updateModule,
        deleteModule,
        addPart,
        updatePart,
        deletePart,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        publishModule,
        assignModule,
        recordAttempt,
        updateWatchedSeconds,
        getModuleById,
        getLearnerProgress,
        getModuleAssignments,
        retakeModule,
        completeModule,
      }}
    >
      {children}
    </ModuleContext.Provider>
  );
}

export function useModules() {
  const context = useContext(ModuleContext);
  if (context === undefined) {
    throw new Error("useModules must be used within a ModuleProvider");
  }
  return context;
}
