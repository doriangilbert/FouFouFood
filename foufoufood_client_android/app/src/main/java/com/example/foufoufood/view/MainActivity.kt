package com.example.foufoufood.view

import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge

import androidx.compose.material3.MaterialTheme
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.foufoufood.model.RestaurantRepository
import com.example.foufoufood.viewmodel.RestaurantViewModel
import com.example.foufoufood.viewmodel.RestaurantDetailViewModel


class MainActivity : ComponentActivity() {
    // Initialisation du ViewModel pour l'activité
    private val restaurantRepository = RestaurantRepository()
    private val restaurantViewModel = RestaurantViewModel(restaurantRepository)
    private val restaurantDetailViewModel = RestaurantDetailViewModel(restaurantRepository)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MaterialTheme {
                val navController = rememberNavController()

                //On renseigne tous les chemins pour naviguer de page en page.
                //On commence par aller à la page d'accueil, ou il y a la liste des restaurants.
                NavHost(navController, startDestination = "MainScreen") {
                    composable("MainScreen") {
                        MainScreen(viewModel = restaurantViewModel, navController = navController)
                    }
                    composable("RestaurantDetailView/{restaurantId}") { backStackEntry ->
                        val restaurantId = backStackEntry.arguments?.getString("restaurantId")
                        if (restaurantId != null) {
                            RestaurantDetailView(viewModel = restaurantDetailViewModel, navController = navController, restaurantId = restaurantId)
                        } else {
                            Log.d("RestaurantList", "Navigating to RestaurantDetailView with ID: $restaurantId")
                        }

                    /*composable("Login") {
                        LoginScreen(navController)
                    }*/
                    // Ajoutez d'autres destinations si nécessaire
                    }
                }
            }
        }
    }
}