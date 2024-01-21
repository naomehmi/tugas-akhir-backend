<!-- Chat.vue -->

<template>
  <div>
    <h2>Chat Application</h2>
    <div v-for="message in messages" :key="message.id">
      <strong>{{ message.user }}:</strong> {{ message.text }}
    </div>
    <input v-model="newMessage.text" placeholder="Type your message" />
    <button @click="sendMessage">Send</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      messages: [],
      newMessage: {
        user: 'ExampleUser', // Set default user or get it from user input
        text: '',
      },
    };
  },
  methods: {
    async fetchMessages() {
      try {
        const response = await fetch('http://localhost:3000/chat');
        const data = await response.json();
        this.messages = data;
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    },
    async sendMessage() {
      try {
        await fetch('http://localhost:3000/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.newMessage),
        });

        this.newMessage.text = '';
        this.fetchMessages(); // Update messages after sending a new one
      } catch (error) {
        console.error('Error sending message:', error);
      }
    },
  },
  mounted() {
    this.fetchMessages();
  },
};
</script>

<style>
/* Add your styles here */
</style>
