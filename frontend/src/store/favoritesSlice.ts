import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../api/axios'; // Импортируем ваш настроенный инстанс

// Асинхронный экшен для загрузки избранного
export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users/${userId}/favorites`);
      return response.data.map((f: any) => f.id); // Возвращаем массив ID
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Ошибка загрузки');
    }
  }
);

export interface FavoritesState {
  items: number[];
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
    // 1. Установка списка принудительно (из вашего компонента)
    setFavorites: (state, action: PayloadAction<number[]>) => {
      state.items = action.payload;
    },
    // 2. Полная очистка при выходе из аккаунта
    clearFavorites: (state) => {
      state.items = [];
      state.status = 'idle';
    },
    // 3. Локальное переключение (оптимистичный UI)
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
      .addCase(fetchFavorites.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchFavorites.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { toggleFavoriteLocal, setFavorites, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;