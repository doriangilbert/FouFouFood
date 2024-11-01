package com.example.foufoufood.model

import com.example.foufoufood.RetrofitInstance
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class MenuItemRepository {
    private val token: String = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzFmMGIwNzlkOGI1MDA3MzJiM2NiYTUiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MzAwODc3MTl9.aB_l4fwS_qroUcHkWrAp_yKSu_VkE4tTKWQV2hjl_D0"

    private val api = RetrofitInstance.api

    suspend fun getMenuItemById(restaurantId: String, menuItemId: String): MenuItem = withContext(Dispatchers.IO) {
        api.getMenuItemById("Bearer $token", restaurantId, menuItemId)
    }
}