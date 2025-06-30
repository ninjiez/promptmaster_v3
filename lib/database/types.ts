// Export Prisma types for use throughout the application
export type {
  User,
  Prompt,
  PromptVersion,
  TestResult,
  Question,
  Example,
  Feedback,
  Subscription,
  TokenTransaction,
  Account,
  Session,
  VerificationToken,
  ApiUsage,
  SystemConfig,
  SubscriptionTier,
  PromptStatus,
  TransactionType,
  PromptType,
  FeedbackType,
} from '../generated/prisma'

// Custom types for API responses
export interface UserWithTokens extends User {
  tokenTransactions?: TokenTransaction[]
  subscriptions?: Subscription[]
}

export interface PromptWithVersions extends Prompt {
  versions: PromptVersion[]
  user: User
  _count?: {
    versions: number
    tests: number
    feedback: number
  }
}

export interface PromptVersionWithDetails extends PromptVersion {
  prompt: Prompt
  questions?: Question[]
  examples?: Example[]
  testResults?: TestResult[]
  feedback?: Feedback[]
}

export interface TokenTransactionWithUser extends TokenTransaction {
  user: User
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Token operation types
export interface TokenDeduction {
  userId: string
  amount: number
  description: string
  reference?: string
}

export interface TokenAddition {
  userId: string
  amount: number
  type: TransactionType
  description: string
  reference?: string
}

// Prompt generation types
export interface PromptGenerationRequest {
  idea: string
  category?: string
  subcategory?: string
  useCase?: string
  targetModel?: string
  constraints?: string
}

export interface QuestionGenerationRequest {
  promptVersionId: string
  currentPrompt: string
  context?: string
  recentResults?: string
}

export interface ExampleGenerationRequest {
  promptVersionId: string
  prompt: string
  useCase: string
  requirements?: string
  previousFailures?: string
}

export interface FeedbackAnalysisRequest {
  currentPrompt: string
  previousResult: string
  currentResult: string
  userFeedback: string
  rating: 'better' | 'worse'
}