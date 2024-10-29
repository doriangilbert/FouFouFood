package com.example.foufoufood.model
import java.time.LocalDate

data class Order(
    val id: Int,
    val userId: Int,
    val restaurantId: Int,
    val items: List<Int>,
    val totalPrice: Float,
    var status: String,
    val deliveryAddress: String,
    val deliveryPartner: Int,
    val createdAt: LocalDate,
    var updatedAt: LocalDate
)
