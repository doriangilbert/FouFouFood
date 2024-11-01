package com.example.foufoufood.model

import com.example.foufoufood.RetrofitInstance
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class RestaurantRepository {

    private val token: String = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzFmMGIwNzlkOGI1MDA3MzJiM2NiYTUiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MzAwODc3MTl9.aB_l4fwS_qroUcHkWrAp_yKSu_VkE4tTKWQV2hjl_D0"

    private val api = RetrofitInstance.api

    suspend fun getAllRestaurants(): List<Restaurant> = withContext(Dispatchers.IO) {
        api.getAllRestaurants("Bearer $token")
    }

    suspend fun getRestaurantById(restaurantId: String): Restaurant = withContext(Dispatchers.IO) {
        api.getRestaurantById("Bearer $token", restaurantId)
    }

    suspend fun getAllMenuItems(restaurantId: String): List<MenuItem> = withContext(Dispatchers.IO) {
        api.getAllMenuItems("Bearer $token", restaurantId)
    }

    /*suspend fun getRestaurantByName(restaurantName: String): Restaurant = withContext(Dispatchers.IO) {
        api.getRestaurantByName("Bearer $token", restaurantName)
    }*/
}