<template>
    <div class="reply-form">
      <div class="reply-header">
        <h4>Your Response</h4>
      </div>
  
      <textarea
        v-model="localReply"
        placeholder="Type your reply here..."
        rows="3"
        @input="$emit('update-reply', localReply)"
      ></textarea>
  
      <button class="reply-btn" @click="$emit('send-reply')">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
             viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
        Send Response
      </button>
    </div>
  </template>
  
  <script setup>
  import { defineProps,watch,ref } from 'vue'
  const props = defineProps({
    reply: String
  })
  const localReply = ref(props.reply)
  
  watch(() => props.reply, (newVal) => {
    localReply.value = newVal
  })
  </script>
  
  <style scoped>
  .reply-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
    background-color: #f8fafc;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
  }
  .reply-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .reply-form textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    resize: vertical;
    font-family: inherit;
    font-size: 14px;
    background-color: white;
  }
  .reply-form textarea:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  }
  .reply-btn {
    background-color: #172b4d;
    color: white;
    padding: 10px 16px;
    align-self: flex-end;
    border: none;
    border-radius: 4px;
    display: flex;
    align-items: center;
  }
  .reply-btn:hover {
    background-color: #0f1d35;
  }
  .reply-btn svg {
    margin-right: 8px;
  }
  </style>
  