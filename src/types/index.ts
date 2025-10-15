export enum TicketStatus {
  OPEN = 'OPEN',
  RESPONDED = 'RESPONDED',
  CLOSED = 'CLOSED'
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export interface TicketMessageDto {
  senderName: string;
  message: string;
  senderType: string;
  timestamp: string;
}

export interface SupportTicketResponseDto {
  ticketId: string;
  userId: string;
  userName: string;
  investmentProductId?: number;
  investmentProductName?: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: Priority;
  response?: string;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessageDto[];
}

export interface SupportTicketRequestDto {
  subject: string;
  description: string;
  priority: Priority;
  investmentProductId?: number;
}

export interface FilterParams {
  status?: TicketStatus;
  priority?: Priority;
}