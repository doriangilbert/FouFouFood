package com.example.foufoufood.view

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.sizeIn
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material3.BottomAppBar
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
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.android.volley.toolbox.ImageRequest
import com.example.foufoufood.viewmodel.MenuItemDetailViewModel
import java.io.File

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MenuItemDetailView(viewModel: MenuItemDetailViewModel, navController: NavController, restaurantId: String, menuItemId: String) {
    viewModel.fetchMenuItem(restaurantId, menuItemId)
    val menuItem by viewModel.menuItem.collectAsState()

    var bitmap by remember { mutableStateOf<Bitmap?>(null) }

    LaunchedEffect(menuItem?.image) {
        menuItem?.image?.let { path ->
            val file = File(path)
            if (file.exists()) {
                bitmap = BitmapFactory.decodeFile(path)
            }
        }
    }

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
                    IconButton(onClick = { navController.navigate("CartView") }) {
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
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 8.dp)
                    .padding(horizontal = 16.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(modifier = Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
                    bitmap?.let {
                        Image(
                            bitmap = it.asImageBitmap(),
                            contentDescription = "Image de ${menuItem?.name}",
                            modifier = Modifier
                                .sizeIn(maxWidth = 200.dp, maxHeight = 200.dp)
                                .aspectRatio(1f)
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                    }

                    menuItem?.let {
                        Text(
                            text = it.name,
                            style = MaterialTheme.typography.titleLarge,
                        )
                        Text(
                            text = "${menuItem?.price}",
                            style = MaterialTheme.typography.bodyLarge,
                        )
                        Text(
                            text = "${menuItem?.description}",
                            style = MaterialTheme.typography.bodyLarge,
                        )
                        }
                }
            }
            //Mettre les éléments à afficher ici
        }
    }
}