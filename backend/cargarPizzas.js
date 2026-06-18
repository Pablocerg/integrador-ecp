// cargarPizzas.js
const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');
const User = require('./models/User'); 

const pizzasNuevas = [
    { 
        nombre: "Pizza Margherita", 
        descripcion: "Salsa de tomate casera, muzzarella, tomate cherry y albahaca.", 
        precio: 9500, 
        stock: 25, 
        imagenUrl: "http://localhost:5000/images/pizza-margherita.jpeg", 
        categoria: "Pizzas" 
    },
    { 
        nombre: "Pizza Muzzarella Especial", 
        descripcion: "Muzzarella fundida y aceitunas verdes.", 
        precio: 8500, 
        stock: 25, 
        imagenUrl: "http://localhost:5000/images/pizza-muzzarella.jpeg", 
        categoria: "Pizzas" 
    },
    { 
        nombre: "Pizza Napolitana", 
        descripcion: "Tomate fresco, provolone, ajo y perejil.", 
        precio: 10000, 
        stock: 25, 
        imagenUrl: "http://localhost:5000/images/pizza-napolitana.jpeg", 
        categoria: "Pizzas" 
    },
    { 
        nombre: "Pizza Rúcula y Jamón Crudo", 
        descripcion: "Jamón crudo, rúcula y parmesano.", 
        precio: 12500, 
        stock: 25, 
        imagenUrl: "http://localhost:5000/images/pizza-rucula.jpeg", 
        categoria: "Pizzas" 
    },
    { 
        nombre: "Milanesa a la Napolitana", 
        descripcion: "Con jamón, queso y papas fritas.", 
        precio: 13000, 
        stock: 15, 
        imagenUrl: "http://localhost:5000/images/milanesa-napolitana.jpeg", 
        categoria: "Pizzas" 
    }
];

const importar = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        await Product.deleteMany({}); 
        
        await Product.insertMany(pizzasNuevas);
        
        // Crear usuario admin si no existe
        const adminExists = await User.findOne({ email: 'admin@pizeriakone.com' });
        if (!adminExists) {
            const admin = new User({
                nombre: 'Admin',
                email: 'admin@pizeriakone.com',
                password: 'admin123',
                rol: 'admin'
            });
            await admin.save();
            console.log("Usuario admin creado: admin@pizeriakone.com / admin123");
        }
        
        console.log(" Base de datos actualizada con los 5 productos reales");
        process.exit();
    } catch (e) { console.error(e); process.exit(1); }
};
importar();