// itemsActions.js

import { addItem } from '../Redux-toolkit/Slice/itemsSlice';

export const addNewItem = (itemData) => async (dispatch) => {
  try {
    const response = await fetch('/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itemData),
    });

    if (!response.ok) {
      throw new Error('Failed to add item');
    }

    const newItem = await response.json();

    dispatch(addItem(newItem));
  } catch (error) {
    console.error('Error adding item:', error);
    // Handle error or dispatch an error action
  }
};
