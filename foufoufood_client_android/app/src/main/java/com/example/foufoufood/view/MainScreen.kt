package com.example.foufoufood.view

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.BottomAppBar
import androidx.compose.material3.Button
import androidx.compose.material3.Divider
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.input.TextFieldValue
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.example.foufoufood.model.Restaurant
import com.example.foufoufood.viewmodel.RestaurantViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainScreen(viewModel: RestaurantViewModel, navController: NavController) {
    val restaurants by viewModel.restaurants.collectAsState()
    var searchQuery by remember { mutableStateOf(TextFieldValue("")) }
    var filteredRestaurants by remember { mutableStateOf(restaurants) } // Initialise avec tous les restaurants
    var showDialog by remember { mutableStateOf(false) }

    // Afficher le pop-up d'alerte si nécessaire
    if (showDialog) {
        AlertDialog(
            onDismissRequest = { showDialog = false },
            title = { Text("Alerte") },
            text = { Text("Le restaurant cherché n'existe pas dans l'application.") },
            confirmButton = {
                Button(onClick = { showDialog = false }) {
                    Text("OK")
                }
            }
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Color(0xFF4CAF50)
                ),
                title = {
                    Text(
                        text = "foufoufood",
                        color = Color.White,
                        style = MaterialTheme.typography.titleLarge
                    )
                },
                actions = {
                    IconButton(onClick = { /* Action pour le panier */ }) {
                        Icon(
                            Icons.Default.ShoppingCart,
                            contentDescription = "Panier",
                            tint = Color.White,
                            modifier = Modifier.size(28.dp)
                        )
                    }
                }
            )
        },
        bottomBar = {
            BottomAppBar(
                content = {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 8.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        IconButton(onClick = { navController.navigate("MainScreen") }) {
                            Icon(
                                Icons.Default.Home,
                                contentDescription = "Accueil",
                                tint = Color.Black,
                                modifier = Modifier.size(28.dp)
                            )
                        }

                        Row(
                            modifier = Modifier.weight(1f),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.Center
                        ) {
                            TextField(
                                value = searchQuery,
                                onValueChange = { searchQuery = it },
                                placeholder = { Text("Rechercher un restaurant") },
                                modifier = Modifier
                                    .weight(1f)
                                    .padding(end = 8.dp),
                                colors = TextFieldDefaults.textFieldColors(
                                    containerColor = Color.White
                                )
                            )
                            IconButton(onClick = {
                                // Filtre les restaurants en fonction de la requête de recherche
                                filteredRestaurants = restaurants.filter { restaurant ->
                                    restaurant.name.contains(searchQuery.text, ignoreCase = true)
                                }
                                // Affiche le pop-up si aucun résultat n'est trouvé
                                if (filteredRestaurants.isEmpty()) {
                                    showDialog = true
                                }
                            }) {
                                Icon(
                                    Icons.Default.Search,
                                    contentDescription = "Rechercher",
                                    tint = Color.Black,
                                    modifier = Modifier.size(28.dp)
                                )
                            }
                        }

                        IconButton(onClick = { navController.navigate("Login") }) {
                            Icon(
                                Icons.Default.Person,
                                contentDescription = "Compte",
                                tint = Color.Black,
                                modifier = Modifier.size(28.dp)
                            )
                        }
                    }
                }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 16.dp),
                horizontalAlignment = Alignment.CenterHorizontally
        ) {

            Text(
                text = "Liste des restaurants:",
                style = MaterialTheme.typography.titleLarge,
                modifier = Modifier.padding(vertical = 16.dp),
                textAlign = TextAlign.Center,
            )
            //RestaurantList(filteredRestaurants, navController) // Affiche la liste filtrée
            RestaurantList(restaurants, navController) // Affiche la liste filtrée
        }
    }
}

@Composable
fun RestaurantList(restaurants: List<Restaurant>, navController: NavController) {
    LazyColumn(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        items(restaurants) { restaurant ->
            RestaurantItem(restaurant) {
                navController.navigate("RestaurantDetailView/${restaurant.id}")
            }
            Divider(modifier = Modifier.padding(vertical = 8.dp))
        }
    }
}

@Composable
fun RestaurantItem(restaurant: Restaurant, onClick: () -> Unit) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() }
            .padding(vertical = 8.dp)
            .padding(horizontal = 16.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(modifier = Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
            Text(
                text = restaurant.name,
                style = MaterialTheme.typography.titleLarge,
                color = Color(0xFF4CAF50),
            )
            Text(
                text = "Cuisine: ${restaurant.cuisine}",
                style = MaterialTheme.typography.bodyLarge,
            )
        }
    }
}