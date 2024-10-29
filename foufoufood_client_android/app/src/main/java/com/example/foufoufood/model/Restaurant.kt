package com.example.foufoufood.model

class Restaurant(
    val id: Int,
    val name: String,
    val address: String,
    val cuisine: String,
    var phone: String,
    var openingHours: String,
    val menu: List<Int>,
    var rating: Float,
    val reviews: List<String>
)


