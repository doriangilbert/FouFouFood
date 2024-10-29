package com.example.foufoufood.view

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.foufoufood.model.Restaurant
import com.example.foufoufood.viewmodel.RestaurantViewModel

class RestaurantDetailView : ComponentActivity() {
    private val viewModel: RestaurantViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val restaurantId = intent.getIntExtra("restaurantId", -1)

        setContent {
            val restaurant = viewModel.getRestaurantById(restaurantId)
            if (restaurant != null) {
                RestaurantDetailContent(restaurant)
            } else {
                Text(text = "Restaurant non trouvé", modifier = Modifier.padding(16.dp))
            }
        }
    }
}

@Composable
fun RestaurantDetailContent(restaurant: Restaurant) {
    Column(modifier = Modifier.padding(16.dp)) {
        Text(text = restaurant.name, fontSize = 28.sp)
        Text(text = "Adresse: ${restaurant.address}", fontSize = 16.sp, modifier = Modifier.padding(top = 8.dp))
        Text(text = "Cuisine: ${restaurant.cuisine}", fontSize = 16.sp, modifier = Modifier.padding(top = 8.dp))
        Text(text = "Téléphone: ${restaurant.phone}", fontSize = 16.sp, modifier = Modifier.padding(top = 8.dp))
        Text(text = "Horaires: ${restaurant.openingHours}", fontSize = 16.sp, modifier = Modifier.padding(top = 8.dp))
        Text(text = "Note: ${restaurant.rating}", fontSize = 16.sp, modifier = Modifier.padding(top = 8.dp))
        Text(text = "Avis:", fontSize = 16.sp, modifier = Modifier.padding(top = 8.dp))
        restaurant.reviews.forEach { review ->
            Text(text = "- $review", fontSize = 14.sp, modifier = Modifier.padding(start = 16.dp, top = 4.dp))
        }
    }
}