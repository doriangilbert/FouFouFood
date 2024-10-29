package com.example.foufoufood.view

@Composable
fun MainScreen(viewModel: EventViewModel) {
    val events by viewModel.events.collectAsState()

    Column(modifier = Modifier.fillMaxSize().padding(32.dp)) {
        EventList(events)
        Spacer(modifier = Modifier.height(16.dp))
        EventForm { event -> viewModel.addEvent(event) }
    }
}

@Composable
fun EventList(events: List<Event>) {
    LazyColumn {
        items(events) { event ->
            EventItem(event)
            HorizontalDivider()
        }
    }
}

@Composable
fun EventItem(event: Event) {
    Column(modifier = Modifier.padding(vertical = 8.dp)) {
        Text(text = "Titre: ${event.title}", style = MaterialTheme.typography.titleLarge)
        Text(text = "Description: ${event.description}")
    }
}

@Composable
fun EventForm(onSubmit: (Event) -> Unit) {
    var title by remember { mutableStateOf("") }
    var description by remember { mutableStateOf("") }

    Column {
        TextField(
            value = title,
            onValueChange = { title = it },
            placeholder = {Text("Titre")},
            modifier = Modifier.fillMaxWidth().padding(8.dp)
        )
        TextField(
            value = description,
            onValueChange = { description = it },
            placeholder = {Text("Description")},
            modifier = Modifier.fillMaxWidth().padding(8.dp)
        )
        Button(onClick = {
            val event = Event("", title, description, "", "", emptyList())
            onSubmit(event)
        }) {
            Text("Ajouter un événement")
        }
    }
}