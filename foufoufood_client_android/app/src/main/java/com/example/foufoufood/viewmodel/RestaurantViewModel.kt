package com.example.foufoufood.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.foufoufood.RestaurantRepository
import com.example.foufoufood.model.Restaurant
import kotlinx.coroutines.launch
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow

class RestaurantViewModel(private val repository: RestaurantRepository) : ViewModel() {
    private val _events = MutableStateFlow<List<Restaurant>>(emptyList())
    val events = _events.asStateFlow()

    init {
        fetchEvents()
    }

    private fun fetchEvents() {
        viewModelScope.launch {
            _events.value = repository.getAllEvents()
        }
    }

    fun addEvent(event: Event) {
        viewModelScope.launch {
            repository.createEvent(event)
            fetchEvents()  // Rafraîchir la liste
        }
    }
}