package com.example.foufoufood.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.foufoufood.model.MenuItem
import com.example.foufoufood.model.MenuItemRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class MenuItemDetailViewModel(private val repository: MenuItemRepository) : ViewModel() {
    private val _menuItem = MutableStateFlow<MenuItem?>(null)
    val menuItem = _menuItem.asStateFlow()

    fun fetchMenuItem(restaurantId: String, menuItemId: String) {
        viewModelScope.launch {
            _menuItem.value = repository.getMenuItemById(restaurantId, menuItemId)
        }
    }
}