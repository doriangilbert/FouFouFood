package com.example.foufoufood.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.foufoufood.model.MenuItem
import com.example.foufoufood.model.Restaurant
import com.example.foufoufood.model.RestaurantRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class RestaurantDetailViewModel(private val repository: RestaurantRepository) : ViewModel() {
    private val _restaurant = MutableStateFlow<Restaurant?>(null)
    val restaurant = _restaurant.asStateFlow()
    private val _menuItems = MutableStateFlow<List<MenuItem>>(emptyList())
    val menuItems = _menuItems.asStateFlow()
    private val _cart = MutableStateFlow<List<Pair<MenuItem, Int>>>(emptyList())
    val cart = _cart.asStateFlow()

    fun fetchRestaurant(restaurantId: String) {
        viewModelScope.launch {
            _restaurant.value = repository.getRestaurantById(restaurantId)
        }
    }

    fun fetchMenuItems(restaurantId: String) {
        viewModelScope.launch {
            _menuItems.value = repository.getAllMenuItems(restaurantId)
        }
    }

    fun addToCart(menuItem: MenuItem, quantity: Int) {
        viewModelScope.launch {
            val newCart = _cart.value.toMutableList()
            newCart.add(menuItem to quantity)
            _cart.value = newCart
            println(_cart.value)
        }
    }
}