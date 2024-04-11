// Se importan los módulos express, fs (File System) y body-parser. Express es un marco de aplicación web de 
// Node.js, fs se utiliza para leer y escribir archivos y body-parser para analizar el cuerpo de las solicitudes 
// HTTP.

import express from "express";
import fs from "fs";
import bodyParser from "body-parser";

// Se inicializa la aplicación Express y se configura para que utilice body-parser para analizar el cuerpo de las 
// solicitudes en formato JSON.

const app = express();
app.use(bodyParser.json());

// readData: Lee los datos del archivo db.json y los analiza como un objeto JavaScript.
// writeData: Escribe datos en el archivo db.json después de convertirlos a formato JSON.

const readData = () => {
  try {
    const data = fs.readFileSync("./db.json");
    return JSON.parse(data);
  } catch (error) {
    console.log(error);
  }
};

const writeData = (data) => {
  try {
    fs.writeFileSync("./db.json", JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
};

// Esta ruta devuelve un mensaje de bienvenida cuando se accede a la raíz del servidor.


app.get("/", (req, res) => {
  res.send("Welcome to my first API with Node js!");
});

// Esta ruta devuelve todos los libros almacenados en el archivo JSON.

app.get("/books", (req, res) => {
  const data = readData();
  res.json(data.books);
});

// Esta ruta devuelve un libro específico según su ID proporcionado en la URL.

app.get("/books/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const book = data.books.find((book) => book.id === id);
  res.json(book);
});

// Esta ruta permite agregar un nuevo libro al archivo JSON.

app.post("/books", (req, res) => {
  const data = readData();
  const body = req.body;
  const newBook = {
    id: data.books.length + 1,
    ...body,
  };
  data.books.push(newBook);
  writeData(data);
  res.json(newBook);
});

// Esta ruta actualiza un libro existente según su ID proporcionado en la URL.

app.put("/books/:id", (req, res) => {
  const data = readData();
  const body = req.body;
  const id = parseInt(req.params.id);
  const bookIndex = data.books.findIndex((book) => book.id === id);
  data.books[bookIndex] = {
    ...data.books[bookIndex],
    ...body,
  };
  writeData(data);
  res.json({ message: "Book updated successfully" });
});

// Esta ruta elimina un libro existente según su ID proporcionado en la URL.

app.delete("/books/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const bookIndex = data.books.findIndex((book) => book.id === id);
  data.books.splice(bookIndex, 1);
  writeData(data);
  res.json({ message: "Book deleted successfully" });
});

// El servidor comienza a escuchar en el puerto 3000. Cuando se inicia correctamente, imprime un mensaje en la consola.
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});