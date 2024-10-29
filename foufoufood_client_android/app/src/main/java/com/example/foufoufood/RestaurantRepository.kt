package com.example.foufoufood

import com.example.foufoufood.model.Restaurant
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class RestaurantRepository {
    private val api = RetrofitInstance.api

    suspend fun getAllRestaurant(): List<Restaurant> = withContext(Dispatchers.IO) {
        api.getAllEvents()
    }

    suspend fun createRestaurant(event: Restaurant): Restaurant = withContext(Dispatchers.IO) {
        api.createEvent(event)
    }
}