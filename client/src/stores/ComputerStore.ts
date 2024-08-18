import { createSlice } from '@reduxjs/toolkit'

interface ComputerState {
  computerId: null | string
}

const initialState: ComputerState = {
  computerId: null,
}

export const computerSlice = createSlice({
  name: 'computer',
  initialState,
  reducers: {},
})

export default computerSlice.reducer
