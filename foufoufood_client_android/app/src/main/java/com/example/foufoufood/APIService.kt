package com.example.foufoufood

import com.example.foufoufood.model.*
import retrofit2.http.*

interface ApiService {
    @GET("/restaurants")
    suspend fun getAllRestaurants(@Header("Authorization") token: String): List<Restaurant>

    @GET("restaurants/{id}")
    suspend fun getRestaurantById(@Header("Authorization") token: String, @Path("id") restaurantId: String): Restaurant

    @GET("restaurants/{name}")
    suspend fun getRestaurantByName(@Header("Authorization") token: String, @Path("id") restaurantName: String): Restaurant

    @GET("restaurants/{id}/menuItems")
    suspend fun getAllMenuItems(@Header("Authorization") token: String, @Path("id") restaurantId: String): List<MenuItem>

    @GET("restaurants/{id}/menuItems/{idmenu}")
    suspend fun getMenuItemById(@Header("Authorization") token: String, @Path("id") restaurantId: String, @Path("idmenu") menuItemId: String): MenuItem

    /*@GET("restaurants/{id}/menuItems/{idmenu}")
    suspend fun getMenuItem(@Header("Authorization") token: String, @Path("id") restaurantId: String, @Path("idmenu") menuItemId: String): List<MenuItem>

    @GET("restaurants/{id}/menuItems/{idmenu}")
    suspend fun getMenuItem(@Header("Authorization") token: String, @Path("id") restaurantId: String, @Path("idmenu") menuItemId: String): List<MenuItem>

    @POST("restaurants")
    suspend fun createRestaurant(@Body restaurant: Restaurant): Restaurant

    @PUT("restaurants/{id}")
    suspend fun updateRestaurant(@Path("id") restaurantId: String, @Body restaurant: Restaurant): Restaurant

    @DELETE("restaurants/{id}")
    suspend fun deleteRestaurant(@Path("id") restaurantId: String): Void

    @GET("users")
    suspend fun getAllUsers(): List<User>

    @POST("login")
    suspend fun login(@Body loginRequest: LoginRequest): User*/
}