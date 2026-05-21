export type SenderRole = 'renter' | 'provider';

export interface ChatMessage {
  id: number;
  sender: SenderRole;
  text: string;
  timestamp: string; // ISO string
}

// Keyed by booking id
export const MOCK_CONVERSATIONS: Record<number, ChatMessage[]> = {
  1: [
    { id: 1, sender: 'provider', text: "Hi! Your booking request for the Toyota Corolla has been received. I'll review it shortly.", timestamp: '2026-05-20T08:00:00' },
    { id: 2, sender: 'renter',   text: "Thanks! Just to confirm — is the meet-up location at your garage on Rizal Ave?",             timestamp: '2026-05-20T08:05:00' },
    { id: 3, sender: 'provider', text: "Yes, exactly. I'll send you the exact pin once confirmed.",                                   timestamp: '2026-05-20T08:07:00' },
  ],
  2: [
    { id: 1, sender: 'provider', text: "Your booking for the Ford Transit is confirmed! We'll deliver it to your address on May 22.", timestamp: '2026-05-19T10:00:00' },
    { id: 2, sender: 'renter',   text: "Perfect, thank you! Will the driver stay for the full duration?",                             timestamp: '2026-05-19T10:15:00' },
    { id: 3, sender: 'provider', text: "Yes, our driver will be with you for all 2 days. His name is Manny.",                        timestamp: '2026-05-19T10:20:00' },
    { id: 4, sender: 'renter',   text: "Great, looking forward to it!",                                                               timestamp: '2026-05-19T10:22:00' },
  ],
  3: [
    { id: 1, sender: 'renter',   text: "Hi, just wanted to say the Isuzu Truck was in great condition. Thanks!", timestamp: '2026-05-12T14:00:00' },
    { id: 2, sender: 'provider', text: "Glad to hear it! Hope to see you again soon.",                           timestamp: '2026-05-12T14:30:00' },
  ],
};
