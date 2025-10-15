<template>
  <div class="ticket-details-container">
    <button class="back-btn" @click="$emit('back')">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
      </svg>
      Back to Tickets
    </button>

    <div class="ticket-details-panel">
      <div v-if="loading" class="loading-indicator">
        <div class="spinner"></div>
        <p>Loading ticket details...</p>
      </div>

      <div v-else-if="error" class="error-message">
        <p>{{ error }}</p>
        <button class="retry-btn" @click="$emit('retry', ticket.ticketId)">Retry</button>
      </div>

      <div v-else>
        <!-- Admin Status Control with Custom Dropdown -->
        <div v-if="isAdmin" class="admin-status-control">
          <div class="status-dropdown">
            <label>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="status-icon">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              Ticket Status:
            </label>
            <div class="custom-select" :class="{ active: statusDropdownOpen }">
              <div class="select-selected" @click="toggleStatusDropdown">
                {{ getSelectedStatusText() }}
                <span class="select-arrow"></span>
              </div>
              <div class="select-items-container" v-if="statusDropdownOpen">
                <div class="select-items">
                  <div class="select-item default-option" :class="{ selected: selectedStatus === '' }" @click="selectStatus('')">
                    <span v-if="selectedStatus === ''" class="checkmark">✓</span>
                    Keep Current Status
                  </div>
                  <div class="select-item open-option" :class="{ selected: selectedStatus === 'OPEN' }" @click="selectStatus('OPEN')">
                    <span v-if="selectedStatus === 'OPEN'" class="checkmark">✓</span>
                    Open
                  </div>
                  <div class="select-item responded-option" :class="{ selected: selectedStatus === 'RESPONDED' }" @click="selectStatus('RESPONDED')">
                    <span v-if="selectedStatus === 'RESPONDED'" class="checkmark">✓</span>
                    Responded
                  </div>
                  <div class="select-item closed-option" :class="{ selected: selectedStatus === 'CLOSED' }" @click="selectStatus('CLOSED')">
                    <span v-if="selectedStatus === 'CLOSED'" class="checkmark">✓</span>
                    Closed
                  </div>
                </div>
              </div>
            </div>
            <div class="current-status">
              <span>Current: </span>
              <span class="status-badge" :class="getStatusClass(ticket.status)">
                <span class="status-dot"></span>
                {{ ticket.status }}
              </span>
            </div>
          </div>
        </div>

        <!-- Enhanced Ticket Header -->
        <div class="ticket-header">
          <h2>{{ ticket.subject }}</h2>
          <div class="ticket-meta">
            <span class="status-badge" :class="getStatusClass(ticket.status)">
              <span class="status-dot"></span>
              {{ ticket.status }}
            </span>
            <span class="priority-badge" :class="getPriorityClass(ticket.priority)">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="priority-icon">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              {{ ticket.priority }}
            </span>
            <span class="ticket-date">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="date-icon">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              Created: {{ formatDate(ticket.createdAt) }}
            </span>
            <span v-if="ticket.investmentProductName" class="ticket-investment">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="investment-icon">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
              Investment: {{ ticket.investmentProductName }}
            </span>
          </div>
        </div>

        <div class="ticket-content">
          <!-- Enhanced Description Section -->
          <div class="ticket-description">
            <h3>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="description-icon">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              Description
            </h3>
            <p>{{ ticket.description }}</p>
          </div>

          <!-- Enhanced Conversation Section -->
          <div class="ticket-conversation">
            <h3>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="conversation-icon">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              Conversation
            </h3>
            <div class="message-list">
              <div v-for="(message, index) in ticket.messages" :key="index" 
                  class="message" :class="getSenderClass(message.senderType)">
                <div class="message-header">
                  <div class="message-avatar" :class="getSenderAvatarClass(message.senderType)">
                    {{ getSenderInitial(message.senderType) }}
                  </div>
                  <div class="message-info">
                    <strong>{{ getSenderName(message.senderType) }}</strong>
                    <span class="message-message">{{ message.message }}</span>
                  </div>
                </div>
                <div class="message-body">
                  {{ message.content }}
                </div>
              </div>
            </div>

            <!-- Enhanced Reply Form -->
            <div class="reply-form">
              <div class="reply-header">
                <h4>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="reply-icon">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                  Your Response
                </h4>
              </div>
              <textarea 
                :value="newReply" 
                @input="$emit('update:new-reply', $event.target.value)"
                placeholder="Type your reply here..."
                rows="3"
              ></textarea>
              
              <div class="reply-options">
                <button class="reply-btn" @click="$emit('send-reply')" :disabled="!newReply.trim()">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                  Send Response
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { getStatusClass, getPriorityClass, formatDate } from '../utils/helpers';

export default {
  name: 'TicketDetails',
  props: {
    ticket: {
      type: Object,
      required: true,
      default: () => ({})
    },
    newReply: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: ''
    },
    selectedStatus: {
      type: String,
      default: ''
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      statusDropdownOpen: false
    };
  },
  emits: ['back', 'send-reply', 'update:new-reply', 'update:selected-status', 'retry'],
  mounted() {
    // Add click outside listener to close dropdown
    document.addEventListener('click', this.closeDropdownOnClickOutside);
  },
  beforeUnmount() {
    // Remove event listener when component is destroyed
    document.removeEventListener('click', this.closeDropdownOnClickOutside);
  },
  methods: {
    // Helper functions for message display based on sender type
    getSenderClass(senderType) {
      if (!senderType) return 'user-message';
      return senderType === 'USER' ? 'user-message' : 'admin-message';
    },
    
    getSenderAvatarClass(senderType) {
      if (!senderType) return 'user-avatar';
      return senderType === 'USER' ? 'user-avatar' : 'admin-avatar';
    },
    
    getSenderInitial(senderType) {
      if (!senderType) return 'U';
      return senderType === 'USER' ? 'U' : 'A';
    },
    
    getSenderName(senderType) {
      if (!senderType) return 'You';
      
      // If admin is viewing, show "User" for user messages and "Admin" for admin messages
      if (this.isAdmin) {
        return senderType === 'USER' ? 'User' : 'Admin';
      }
      
      // If user is viewing, show "You" for user messages and "Support Team" for admin messages
      return senderType === 'USER' ? 'You' : 'Support Team';
    },
    
    getStatusClass,
    getPriorityClass,
    formatDate,
    
    // Custom dropdown methods
    toggleStatusDropdown(event) {
      event.stopPropagation();
      this.statusDropdownOpen = !this.statusDropdownOpen;
    },
    
    closeDropdownOnClickOutside(event) {
      const dropdown = this.$el.querySelector('.custom-select');
      if (dropdown && !dropdown.contains(event.target)) {
        this.statusDropdownOpen = false;
      }
    },
    
    selectStatus(status) {
      this.$emit('update:selected-status', status);
      this.statusDropdownOpen = false;
    },
    
    getSelectedStatusText() {
      if (!this.selectedStatus) return 'Keep Current Status';
      return this.selectedStatus.charAt(0) + this.selectedStatus.slice(1).toLowerCase();
    }
  }
}
</script>

<style scoped>
/* Back Button Styles */
.back-btn {
  background-color: transparent;
  color: #4a5568;
  padding: 8px 12px;
  margin-bottom: 16px;
  border: 1px solid #e2e8f0;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background-color: #f7fafc;
  transform: translateX(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.back-btn svg {
  margin-right: 8px;
}

/* Ticket Details Styles */
.ticket-details-panel {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 28px;
  border: 1px solid #e2e8f0;
  min-height: 300px;
}

/* Admin Status Control Styles */
.admin-status-control {
  margin-bottom: 24px;
  padding: 20px;
  border-radius: 12px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: visible; /* Changed from hidden to visible */
}

.admin-status-control::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 5px;
  height: 100%;
  background: linear-gradient(to bottom, #4299e1, #3182ce);
}

.status-dropdown {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  position: relative; /* Added position relative */
  z-index: 10; /* Added z-index */
}

.status-dropdown label {
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-icon {
  color: #4299e1;
}

/* Custom Select Dropdown Styles */
.custom-select {
  position: relative;
  min-width: 240px;
  user-select: none;
  z-index: 100; /* Higher z-index to ensure dropdown appears above other elements */
}

.select-selected {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 18px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background-color: white;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  color: #2d3748;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.select-selected:hover {
  background-color: #f7fafc;
  border-color: #cbd5e0;
}

.custom-select.active .select-selected {
  border-color: #4299e1;
  box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.2);
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.select-arrow {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.select-arrow::before {
  content: '';
  display: block;
  width: 8px;
  height: 8px;
  border-right: 2px solid #718096;
  border-bottom: 2px solid #718096;
  transform: rotate(45deg);
  transition: transform 0.2s ease;
}

.custom-select.active .select-arrow::before {
  transform: rotate(-135deg);
}

/* New container for dropdown items to fix positioning */
.select-items-container {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 999; /* Very high z-index to ensure visibility */
}

.select-items {
  background-color: white;
  border: 1px solid #e2e8f0;
  border-top: none;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  max-height: 250px;
  overflow-y: auto;
  margin-top: -1px; /* Align with the selected item border */
}

.select-item {
  padding: 12px 18px;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  border-left: 3px solid transparent;
}

.select-item:not(:last-child) {
  border-bottom: 1px solid #f0f0f0;
}

.select-item:hover {
  background-color: #f7fafc;
}

.select-item.selected {
  background-color: #f0f7ff;
  border-left-color: #4299e1;
}

.checkmark {
  margin-right: 8px;
  color: #4299e1;
  font-weight: bold;
}

/* Status option colors */
.select-item.default-option {
  background-color: #f8fafc;
  font-weight: 600;
}

.select-item.open-option {
  color: #1273da;
  border-left-color: #1273da;
}

.select-item.open-option.selected {
  background-color: rgba(18, 115, 218, 0.1);
}

.select-item.responded-option {
  color: #059718;
  border-left-color: #059718;
}

.select-item.responded-option.selected {
  background-color: rgba(5, 151, 24, 0.1);
}

.select-item.closed-option {
  color: #d50a0a;
  border-left-color: #d50a0a;
}

.select-item.closed-option.selected {
  background-color: rgba(213, 10, 10, 0.1);
}

.select-item.reopened-option {
  color: #f22828;
  border-left-color: #f22828;
}

.select-item.reopened-option.selected {
  background-color: rgba(242, 40, 40, 0.1);
}

.current-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #4a5568;
  padding: 8px 12px;
  background-color: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.ticket-header {
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e2e8f0;
  position: relative;
  z-index: 1; /* Lower z-index than dropdown */
}

.ticket-id {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 14px;
  color: #a0aec0;
  font-weight: 500;
  background-color: #f7fafc;
  padding: 4px 10px;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
}

.ticket-header h2 {
  margin: 0;
  font-size: 24px;
  color: #2d3748;
  font-weight: 600;
  line-height: 1.3;
}

.ticket-meta {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  align-items: center;
}

.status-badge, .priority-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: currentColor;
}

.status-open {
  background-color: #c6ebff;
  color: #1273da;
}

.status-responded {
  background-color: #98ffea;
  color: #059718;
}

.status-closed {
  background-color: #ffb6ab;
  color: #d50a0a;
}

.status-reopened {
  background-color: #ffebb1;
  color: #f22828;
}

.priority-low {
  background-color: #c1ffd2;
  color: #0bac5b;
}

.priority-medium {
  background-color: #fff585;
  color: #fcae14;
}

.priority-high {
  background-color: #ffabab;
  color: #c53030;
}

.ticket-date, .ticket-investment {
  color: #718096;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.date-icon, .investment-icon, .priority-icon {
  color: #a0aec0;
}

.ticket-content {
  display: flex;
  flex-direction: column;
  gap: 28px;
  position: relative;
  z-index: 1; /* Lower z-index than dropdown */
}

.ticket-description {
  background-color: #f8fafc;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.03);
}

.ticket-description h3 {
  margin: 0 0 12px 0;
  font-size: 18px;
  color: #2d3748;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.description-icon {
  color: #4299e1;
}

.ticket-description p {
  color: #4a5568;
  line-height: 1.7;
  margin: 0;
  white-space: pre-line;
  font-size: 15px;
}

/* Message Styles */
.ticket-conversation h3 {
  margin: 0 0 18px 0;
  font-size: 18px;
  color: #2d3748;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.conversation-icon {
  color: #4299e1;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 28px;
  max-height: 450px;
  overflow-y: auto;
  padding-right: 12px;
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}

.message-list::-webkit-scrollbar {
  width: 6px;
}

.message-list::-webkit-scrollbar-track {
  background: #f7fafc;
  border-radius: 10px;
}

.message-list::-webkit-scrollbar-thumb {
  background-color: #cbd5e0;
  border-radius: 10px;
}

.message {
  padding: 18px;
  border-radius: 12px;
  max-width: 85%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
  position: relative;
}

.message:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
}

.user-message {
  background-color: #ebf8ff;
  align-self: flex-end;
  border-bottom-right-radius: 0;
  border: 1px solid #bee3f8;
}

.user-message::after {
  content: '';
  position: absolute;
  bottom: -10px;
  right: 0;
  width: 0;
  height: 0;
  border: 10px solid transparent;
  border-top-color: #ebf8ff;
  border-right: 0;
  margin-right: 0;
}

.admin-message {
  background-color: #f0fff4;
  align-self: flex-start;
  border-bottom-left-radius: 0;
  border: 1px solid #c6f6d5;
}

.admin-message::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 0;
  height: 0;
  border: 10px solid transparent;
  border-top-color: #f0fff4;
  border-left: 0;
  margin-left: 0;
}

.message-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-right: 12px;
  font-size: 14px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.admin-avatar {
  background-color: #c6f6d5;
  color: #2f855a;
  font-size: 12px;
  width: 42px;
  height: 42px;
}

.user-avatar {
  background-color: #bee3f8;
  color: #2b6cb0;
}

.message-info {
  display: flex;
  flex-direction: column;
}

.message-info strong {
  font-size: 15px;
  color: #2d3748;
}

.message-message {
  color: #718096;
  font-size: 12px;
  margin-top: 3px;
}

.message-body {
  color: #4a5568;
  line-height: 1.6;
  white-space: pre-line;
  font-size: 15px;
}

/* Reply Form */
.reply-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
  background-color: #f8fafc;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.reply-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.reply-header h4 {
  margin: 0;
  font-size: 16px;
  color: #2d3748;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.reply-icon {
  color: #4299e1;
}

.reply-form textarea {
  width: 100%;
  padding: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  resize: vertical;
  font-family: inherit;
  font-size: 15px;
  background-color: white;
  transition: all 0.2s ease;
  min-height: 100px;
}

.reply-form textarea:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.reply-form textarea::placeholder {
  color: #a0aec0;
}

.reply-options {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 8px;
}

.reply-btn {
  background-color: #172b4d;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 15px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(23, 43, 77, 0.2);
}

.reply-btn:hover:not(:disabled) {
  background-color: #0f1d35;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(23, 43, 77, 0.25);
}

.reply-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(23, 43, 77, 0.2);
}

.reply-btn:disabled {
  background-color: #a0aec0;
  cursor: not-allowed;
  opacity: 0.7;
}

.reply-btn svg {
  margin-right: 10px;
}

/* Loading indicator */
.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3182ce;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error message */
.error-message {
  text-align: center;
  padding: 30px;
  color: #e53e3e;
  background-color: #fff5f5;
  border-radius: 8px;
  border: 1px solid #fed7d7;
  margin: 20px 0;
}

.retry-btn {
  background-color: #3182ce;
  color: white;
  padding: 10px 18px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 15px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.retry-btn:hover {
  background-color: #2b6cb0;
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .ticket-details-panel {
    padding: 20px;
  }
  
  .message {
    max-width: 90%;
  }
  
  .status-dropdown {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .custom-select {
    width: 100%;
  }
  
  .reply-options {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .reply-btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .ticket-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .admin-status-control {
    padding: 15px;
  }
  
  .ticket-description, 
  .reply-form {
    padding: 15px;
  }
}
</style>
