package com.example.foufoufood.view

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent

import androidx.compose.foundation.layout.*


class MainActivity : ComponentActivity() {
    // Initialisation du ViewModel pour l'activité
    private val eventRepository = EventRepository()
    private val eventViewModel = EventViewModel(eventRepository)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            EventAppTheme {
                MainScreen(eventViewModel)
            }
        }
    }
}

/*
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
}*/


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