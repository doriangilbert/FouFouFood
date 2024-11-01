package com.example.foufoufood.model

import com.google.gson.annotations.SerializedName

data class MenuItem(
    @SerializedName("_id") val id: String,
    val name: String,
    val description: String,
    var price: Float,
    val category: String,
    var image: String,
    val restaurantId: String
)
