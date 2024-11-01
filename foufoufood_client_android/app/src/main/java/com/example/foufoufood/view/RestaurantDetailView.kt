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
import androidx.compose.material3.BottomAppBar
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
import com.example.foufoufood.model.MenuItem
import com.example.foufoufood.viewmodel.RestaurantDetailViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RestaurantDetailView(viewModel: RestaurantDetailViewModel, navController: NavController, restaurantId: String) {

    viewModel.fetchRestaurant(restaurantId)

    val restaurant by viewModel.restaurant.collectAsState()

    viewModel.fetchMenuItems(restaurantId)

    val menuItems by viewModel.menuItems.collectAsState()
    var searchQuery by remember { mutableStateOf(TextFieldValue("")) }

    restaurant?.let { detail ->
        Scaffold(
            //Pour la barre de navigation en haut
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
            //Pour la barre de navigation en bas
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
                                    placeholder = { Text("Rechercher un menu") },
                                    modifier = Modifier
                                        .weight(1f)
                                        .padding(end = 8.dp),
                                    colors = TextFieldDefaults.textFieldColors(
                                        containerColor = Color.White
                                    )
                                )
                                IconButton(onClick = { /* Logique de recherche pour les menus */ }) {
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
                    .padding(horizontal = 16.dp)
            ) {
                MenuList(menuItems, navController)
            }
        }
    }
}

@Composable
fun MenuList(menus: List<MenuItem>, navController: NavController) {
    LazyColumn(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally // Centre les éléments
    ) {
        items(menus) { menuItem ->
            MenuObjet(menuItem) {
                navController.navigate("RestaurantDetailView/${menuItem.restaurantId}/MenuItemsDetailView/${menuItem.id}")
            }
            Divider(modifier = Modifier.padding(vertical = 8.dp))
        }
    }
}

@Composable
fun MenuObjet(menuItem: MenuItem, onClick: () -> Unit) {
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
                text = menuItem.name,
                style = MaterialTheme.typography.titleLarge,
                color = Color(0xFF4CAF50),
                textAlign = TextAlign.Center
            )
            Text(
                text = "${menuItem.price}$",
                style = MaterialTheme.typography.bodyLarge,
                textAlign = TextAlign.Center
            )
            Text(
                text = menuItem.description,
                style = MaterialTheme.typography.bodyLarge,
                textAlign = TextAlign.Center
            )
        }
    }
}


        /*) { padding ->
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding)
                    .padding(horizontal = 16.dp)
            ) {
                Text(
                    text = "Cuisine: ${detail.cuisine}",
                    style = MaterialTheme.typography.bodyLarge,
                    modifier = Modifier.padding(vertical = 8.dp)
                )
                Text(
                    text = "Adresse: ${detail.address}",
                    style = MaterialTheme.typography.bodyMedium,
                    modifier = Modifier.padding(vertical = 8.dp)
                )
                Text(
                    text = "Téléphone: ${detail.phone}",
                    style = MaterialTheme.typography.bodyMedium,
                    modifier = Modifier.padding(vertical = 8.dp)
                )
                Text(
                    text = "Heures d'ouverture: ${detail.openingHours}",
                    style = MaterialTheme.typography.bodyMedium,
                    modifier = Modifier.padding(vertical = 8.dp)
                )
                Text(
                    text = "Note: ${detail.rating}",
                    style = MaterialTheme.typography.bodyMedium,
                    modifier = Modifier.padding(vertical = 8.dp)
                )
                Text(
                    text = "Avis:",
                    style = MaterialTheme.typography.bodyMedium,
                    modifier = Modifier.padding(vertical = 8.dp)
                )
                detail.reviews.forEach { review ->
                    Text(
                        text = "- $review",
                        style = MaterialTheme.typography.bodySmall,
                        //modifier = Modifier.padding(start = 16.dp, vertical = 2.dp)
                    )
                }
            }
        }
    } ?: run {
        // Afficher un message de chargement ou une erreur si le restaurant est null
        Text("Chargement des détails du restaurant...", style = MaterialTheme.typography.bodyLarge)
    }
}*/