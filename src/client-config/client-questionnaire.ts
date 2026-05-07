export type ClientQuestionType =
  | "short_text"
  | "long_text"
  | "single_select"
  | "multi_select"
  | "system_access"
  | "file_upload"
  | "approval_rule";

export interface ClientQuestion {
  id: string;
  label: string;
  type: ClientQuestionType;
  required: boolean;
  whyItMatters: string;
  exampleAnswer?: string;
  options?: string[];
}

export interface ClientQuestionnaireSection {
  id: string;
  title: string;
  purpose: string;
  questions: ClientQuestion[];
}

export interface ClientQuestionnaire {
  title: string;
  purpose: string;
  sections: ClientQuestionnaireSection[];
}

export function buildBaseClientQuestionnaire(): ClientQuestionnaire {
  return {
    title: "FinanceOps Agent Client Discovery Questionnaire",
    purpose:
      "Collect the minimum information needed to scope a client-owned FinanceOps agent implementation.",
    sections: [
      {
        id: "business-context",
        title: "Business and finance process context",
        purpose: "Understand what accounting workflow the client actually wants automated.",
        questions: [
          {
            id: "finance-process",
            label: "Which finance or accounting process should the agent improve first?",
            type: "long_text",
            required: true,
            whyItMatters:
              "The implementation should start from the client's actual pain, not a generic feature list.",
            exampleAnswer:
              "Review overdue invoices, detect orphan bank transactions, prepare CFO exception summaries, or prepare payment approval requests."
          },
          {
            id: "current-manual-work",
            label: "What is currently done manually by the accounting or finance team?",
            type: "long_text",
            required: true,
            whyItMatters:
              "Manual steps define where the agent saves time and where human approval remains required."
          }
        ]
      },
      {
        id: "inputs",
        title: "Inputs and source systems",
        purpose: "Identify what data the client can provide and where it lives.",
        questions: [
          {
            id: "available-inputs",
            label: "What input files, APIs, exports, or databases are available?",
            type: "multi_select",
            required: true,
            whyItMatters:
              "The implementation depends on actual client inputs, not prebuilt SaaS assumptions.",
            options: [
              "CSV",
              "JSON",
              "Excel",
              "ERP API",
              "Bank API",
              "Payment processor",
              "Email inbox",
              "Internal API"
            ]
          },
          {
            id: "input-owner",
            label: "Who owns access to each input source?",
            type: "short_text",
            required: true,
            whyItMatters:
              "The client owns credentials, data access, and deployment responsibility."
          }
        ]
      },
      {
        id: "outputs",
        title: "Desired outputs",
        purpose: "Define exactly what the agent should produce after processing client data.",
        questions: [
          {
            id: "desired-output-format",
            label: "What should the final output look like?",
            type: "multi_select",
            required: true,
            whyItMatters:
              "The output determines the adapter, UI/API response, export format, and acceptance criteria.",
            options: [
              "CFO briefing",
              "Exception queue",
              "CSV export",
              "JSON artifact",
              "Dashboard payload",
              "Payment approval request"
            ]
          },
          {
            id: "reviewer",
            label: "Who reviews or approves the output?",
            type: "short_text",
            required: true,
            whyItMatters:
              "Finance agents should support human review before material actions."
          }
        ]
      },
      {
        id: "governance",
        title: "Governance and forbidden actions",
        purpose: "Define what the agent can suggest, what requires approval, and what is blocked.",
        questions: [
          {
            id: "allowed-actions",
            label: "What actions may the agent recommend or prepare?",
            type: "long_text",
            required: true,
            whyItMatters:
              "Action boundaries prevent the system from behaving like an uncontrolled autonomous finance tool."
          },
          {
            id: "forbidden-actions",
            label: "What actions are forbidden without explicit human approval?",
            type: "long_text",
            required: true,
            whyItMatters:
              "This protects the client and keeps the implementation scoped to approved workflows."
          }
        ]
      }
    ]
  };
}

export type ClientOnboardingQuestion = ClientQuestion;
export type ClientQuestionCategory =
  | "business-context"
  | "inputs"
  | "outputs"
  | "governance";
