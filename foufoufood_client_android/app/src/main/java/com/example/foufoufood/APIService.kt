package com.example.foufoufood

import com.example.foufoufood.model.LoginRequest
import com.example.foufoufood.model.Restaurant
import com.example.foufoufood.model.User
import retrofit2.http.*

interface ApiService {
    @GET("restaurants")
    suspend fun getAllEvents(): List<Restaurant>

    @GET("restaurants/{id}")
    suspend fun getEventById(@Path("id") eventId: String): Restaurant

    @POST("restaurants")
    suspend fun createEvent(@Body event: Restaurant): Restaurant

    @PUT("restaurants/{id}")
    suspend fun updateEvent(@Path("id") eventId: String, @Body event: Restaurant): Restaurant

    @DELETE("events/{id}")
    suspend fun deleteEvent(@Path("id") eventId: String): Void

    @GET("users")
    suspend fun getAllUsers(): List<User>

    @POST("login")
    suspend fun login(@Body loginRequest: LoginRequest): User
}