export const OPERATORS = [
  { id: "equal", label: "Equals", symbol: "=", needsValue: true },
  { id: "not_equal", label: "Does not equal", symbol: "≠", needsValue: true },
  { id: "greater", label: "Greater than", symbol: ">", needsValue: true },
  {
    id: "greater_or_equal",
    label: "Greater or equal",
    symbol: "≥",
    needsValue: true,
  },
  { id: "less", label: "Less than", symbol: "<", needsValue: true },
  {
    id: "less_or_equal",
    label: "Less or equal",
    symbol: "≤",
    needsValue: true,
  },
  { id: "contain", label: "Contains", symbol: "∋", needsValue: true },
  {
    id: "not_contain",
    label: "Does not contain",
    symbol: "∌",
    needsValue: true,
  },
  { id: "exist", label: "Exists", symbol: "∃", needsValue: false },
  { id: "not_exist", label: "Does not exist", symbol: "∄", needsValue: false },
] as const;

export type OperatorId = (typeof OPERATORS)[number]["id"];

export type ConditionRule = {
  left: string;
  operator: OperatorId;
  right: string;
};

export function isOperator(value: unknown): value is OperatorId {
  return OPERATORS.some((operator) => operator.id === value);
}

export function operatorById(id: OperatorId) {
  const match = OPERATORS.find((operator) => operator.id === id);
  return match ?? OPERATORS[0];
}

export function readRules(value: string | undefined): ConditionRule[] {
  if (!value) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.flatMap((item) => {
      if (!item || typeof item !== "object") {
        return [];
      }

      const record = item as Record<string, unknown>;
      if (typeof record.left !== "string" || !isOperator(record.operator)) {
        return [];
      }

      return [
        {
          left: record.left,
          operator: record.operator,
          right: typeof record.right === "string" ? record.right : "",
        },
      ];
    });
  } catch {
    return [];
  }
}

export function writeRules(rules: ConditionRule[]) {
  return JSON.stringify(rules);
}

export function formatRule(rule: ConditionRule) {
  const operator = operatorById(rule.operator);
  if (!operator.needsValue) {
    return `${rule.left} ${operator.symbol}`.trim();
  }

  return `${rule.left} ${operator.symbol} ${rule.right}`.trim();
}

export function emptyRule(): ConditionRule {
  return { left: "", operator: "equal", right: "" };
}
