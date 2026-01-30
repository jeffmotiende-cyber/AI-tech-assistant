import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

// Async thunk for sending chat message
export const sendMessage = createAsyncThunk('chat/sendMessage', async (message, { rejectWithValue }) => {
  try {
    console.log('Attempting to send message to /chat endpoint:', message);
    const response = await api.post('/chat', { message });
    console.log('Response from /chat:', response);
    return response.data;
  } catch (error) {
    console.log('Error from /chat:', error);
    return rejectWithValue(error.response.data);
  }
});

// Slice
const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push({ role: 'user', content: action.meta.arg });
        state.messages.push({ role: 'assistant', content: action.payload.response });
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addMessage, clearMessages, clearError } = chatSlice.actions;
export default chatSlice.reducer;