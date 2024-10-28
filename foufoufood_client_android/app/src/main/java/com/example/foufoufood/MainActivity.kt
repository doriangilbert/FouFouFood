package com.example.foufoufood

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier

import android.content.Intent
import androidx.activity.viewModels
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Divider
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.runtime.livedata.observeAsState

class MainActivity : ComponentActivity() {
    private val restaurantViewModel: RestaurantViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            RestaurantListScreen(restaurantViewModel) { restaurantId ->
                val intent = Intent(this, RestaurantDetailView::class.java).apply {
                    putExtra("restaurantId", restaurantId)
                }
                startActivity(intent)
            }
        }
    }
}

@Composable
fun RestaurantListScreen(viewModel: RestaurantViewModel, onRestaurantClick: (Int) -> Unit) {
    val restaurants by viewModel.restaurants.observeAsState(emptyList())

    LazyColumn(modifier = Modifier.fillMaxSize()) {
        items(restaurants) { restaurant ->
            RestaurantItem(restaurant = restaurant, onRestaurantClick = onRestaurantClick)
            Divider(modifier = Modifier.padding(horizontal = 16.dp))
        }
    }
}

@Composable
fun RestaurantItem(restaurant: Restaurant, onRestaurantClick: (Int) -> Unit) {
    Box(
        contentAlignment = Alignment.Center,
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp)
            .clickable { onRestaurantClick(restaurant.id) }
    ) {
        Text(text = restaurant.name, fontSize = 20.sp)
    }
}


/*@Composable
fun Greeting(name: String, modifier: Modifier = Modifier) {
    Text(
        text = "Hello, World!",
        fontSize = 24.sp,
        color = Color.Blue,
        modifier = modifier
    )
}

@Composable
fun MyLayout() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(40.dp)
            .background(Color.LightGray),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    )  {
        Text(text = "Top", fontWeight = FontWeight.Bold, fontSize = 32.sp)
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(32.dp)
                .background(Color.White),
            horizontalArrangement = Arrangement.SpaceEvenly,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(text = "Left", fontSize = 24.sp)
            Text(text = "Right", fontSize = 24.sp)
        }
        Text(text = "Bottom", fontSize = 32.sp, fontWeight = FontWeight.Light)
    }
}

@Preview(showBackground = true)
@Composable
fun GreetingPreview() {
    FouFouFoodTheme {
        RestaurantList(restaurantViewModel)
        //Greeting("Android")
        //MyLayout()
    }
}*/