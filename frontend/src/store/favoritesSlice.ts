import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';


export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async (userId: string) => {
    const response = await axios.get(`http://localhost:8080/api/users/${userId}/favorites`);
    return response.data.map((f: any) => f.id); // Возвращаем только массив ID
  }
);

export interface FavoritesState {
  items: number[]; // Массив ID избранных курсов
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: FavoritesState = {
  items: [],
  status: 'idle',
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    // Локальное добавление/удаление (для мгновенного отклика интерфейса)
    toggleFavoriteLocal: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      if (state.items.includes(id)) {
        state.items = state.items.filter(itemId => itemId !== id);
      } else {
        state.items.push(id);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
      });
  },
});

export const { toggleFavoriteLocal } = favoritesSlice.actions;
export default favoritesSlice.reducer;