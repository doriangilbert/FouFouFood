package com.example.foufoufood.model

data class DeliveryPartner(
    val id: Int,
    val name: String,
    var vehicle: String,
    var location: List<Double>,
    var status: String
)