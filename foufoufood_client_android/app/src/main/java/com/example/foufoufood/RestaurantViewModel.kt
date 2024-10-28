package com.example.foufoufood

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.async
import kotlinx.coroutines.launch
import kotlinx.coroutines.delay
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData

class RestaurantViewModel : ViewModel() {
    private val _restaurants = MutableLiveData<List<Restaurant>>()
    val restaurants: LiveData<List<Restaurant>> get() = _restaurants

    init {
        loadRestaurants()
    }

    // Chargement asynchrone des restaurants
    private fun loadRestaurants() {
        viewModelScope.launch {
            val restaurantsDeferred = async { fetchRestaurants() }
            _restaurants.value = restaurantsDeferred.await()
        }
    }

    private suspend fun fetchRestaurants(): List<Restaurant> {
        delay(1000)  // Simule un chargement de données
        return listOf(
            Restaurant(
                id = 1,
                name = "Le Gourmet",
                address = "123 Rue de la Gastronomie",
                cuisine = "Française",
                phone = "555-1234",
                openingHours = "10:00 - 22:00",
                menu = listOf(101, 102),
                rating = 4.5f,
                reviews = listOf("Excellent service!", "Bonne ambiance.")
            ),
            Restaurant(
                id = 2,
                name = "Pizza Bella",
                address = "456 Rue de l'Italie",
                cuisine = "Italienne",
                phone = "555-5678",
                openingHours = "11:00 - 23:00",
                menu = listOf(201, 202),
                rating = 4.0f,
                reviews = listOf("Meilleure pizza en ville!", "J'adore la sauce.")
            )
        )
    }

    // Méthode pour obtenir un restaurant par ID
    fun getRestaurantById(id: Int): Restaurant? {
        return _restaurants.value?.find { it.id == id }
    }
}