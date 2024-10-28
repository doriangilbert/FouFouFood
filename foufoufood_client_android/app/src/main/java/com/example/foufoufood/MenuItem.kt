package com.example.foufoufood

data class MenuItem(
    val id: Int,
    val name: String,
    val description: String,
    var price: Float,
    val category: String,
    var image: String,
    val restaurantId: Int
)
