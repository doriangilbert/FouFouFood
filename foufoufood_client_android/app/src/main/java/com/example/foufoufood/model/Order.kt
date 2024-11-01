package com.example.foufoufood.model
import java.time.LocalDate

data class Order(
    val id: String,
    val userId: String,
    val restaurantId: String,
    val items: List<String>,
    val totalPrice: Float,
    var status: String,
    val deliveryAddress: String,
    val deliveryPartner: String,
    val createdAt: LocalDate,
    var updatedAt: LocalDate
)
