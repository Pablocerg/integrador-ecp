import React from 'react';

const Contact = () => {
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                
                <div className="col-md-5">
                    
                    <div className="card pizza-card shadow-lg p-4">
                        <h2 className="text-center text-light fw-bold mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                            📍 Contacto
                        </h2>

                        
                        <div className="mb-4 text-center border-bottom border-secondary pb-3">
                            <p className="text-white small mb-1"><strong>DIRECCIÓN:</strong> Concepción del Uruguay, Entre Ríos</p>
                            <p className="text-white small mb-1"><strong>TELÉFONO:</strong> 03442-123456</p>
                            <p className="text-white small mb-0"><strong>HORARIOS:</strong> Martes a Domingos de 20:00 a 00:00</p>
                        </div>

                        <form>
                            <div className="mb-3">
                                <label className="form-label text-white small text-uppercase">Tu Correo Electrónico</label>
                                <input 
                                    type="email" 
                                    className="form-control bg-dark text-light border-secondary py-2" 
                                    placeholder="nombre@ejemplo.com" 
                                    required 
                                />
                            </div>
                            <div className="mb-4">
                                <label className="form-label text-white small text-uppercase">Mensaje o Pedido Especial</label>
                                <textarea 
                                    className="form-control bg-dark text-light border-secondary py-2" 
                                    rows="4" 
                                    placeholder="Escribe aquí tu consulta..."
                                    required
                                ></textarea>
                            </div>
                          
                            <button type="submit" className="btn btn-marca w-100 py-3 fw-bold">
                                ENVIAR CONSULTA
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;