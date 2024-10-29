package com.example.foufoufood.model

data class MenuItem(
    val id: Int,
    val name: String,
    val description: String,
    var price: Float,
    val category: String,
    var image: String,
    val restaurantId: Int
)
