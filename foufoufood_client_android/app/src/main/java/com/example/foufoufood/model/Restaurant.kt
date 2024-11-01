package com.example.foufoufood.model

import com.google.gson.annotations.SerializedName

class Restaurant(
    @SerializedName("_id") val id: String,
    val name: String,
    val address: String,
    val cuisine: String,
    var phone: String,
    var openingHours: String,
    val menu: List<String>,
    var rating: Float,
    val reviews: List<String>
)


