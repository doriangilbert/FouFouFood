package com.example.foufoufood.model

import com.google.gson.annotations.SerializedName

data class User(
    @SerializedName("_id") val id: String,
    val name: String,
    val email: String,
    var password: String,
    var phone: String,
    var address: String,
    var isAdmin: Boolean,
    val orders: List<String>
)
