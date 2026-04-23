import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const Register = () => {// Hook para navegar programáticamente después del registro exitoso
    const navigate = useNavigate(); 
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        telefono: ''
    });
    const [mensaje, setMensaje] = useState('');//

    const handleChange = (e) => {// Actualiza el estado del formulario con los valores ingresados por el usuario
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {// Evita que el formulario se envíe de forma tradicional
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5001/api/usuarios', formData);
            setMensaje(`¡Usuario ${res.data.nombre} registrado con éxito! Redirigiendo...`);
            
            setTimeout(() => {
                navigate('/');
            }, 2000);
            
        } catch (error) {
            setMensaje("Error al registrar: " + (error.response?.data?.mensaje || "Error del servidor"));
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card pizza-card shadow-lg p-4">
                        <h2 className="text-center text-light fw-bold mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                            Únete a la Familia
                        </h2>
                        
                        {mensaje && <div className="alert alert-info bg-dark text-light border-secondary text-center small">{mensaje}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label text-white small text-uppercase">Nombre</label>
                                <input type="text" name="nombre" className="form-control bg-dark text-light border-secondary py-2" value={formData.nombre} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-white small text-uppercase">Apellido</label>
                                <input type="text" name="apellido" className="form-control bg-dark text-light border-secondary py-2" value={formData.apellido} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-white small text-uppercase">Correo Electrónico</label>
                                <input type="email" name="email" className="form-control bg-dark text-light border-secondary py-2" value={formData.email} onChange={handleChange} required />
                            </div>
                            <div className="mb-4">
                                <label className="form-label text-white small text-uppercase">Teléfono de Contacto</label>
                                <input type="text" name="telefono" className="form-control bg-dark text-light border-secondary py-2" value={formData.telefono} onChange={handleChange} />
                            </div>
                            <button type="submit" className="btn btn-marca w-100 py-3 fw-bold">
                                CREAR CUENTA
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;