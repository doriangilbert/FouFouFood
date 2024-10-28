package com.example.foufoufood

data class User(
    val id: Int,
    val name: String,
    val email: String,
    var password: String,
    var phone: String,
    var address: String,
    var isAdmin: Boolean,
    val orders: List<Int>
)
