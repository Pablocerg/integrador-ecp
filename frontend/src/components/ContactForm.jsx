import { useState } from 'react';
import { toast } from 'react-toastify';

export default function ContactForm() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre.trim() || !email.trim() || !mensaje.trim()) {
      toast.error('Por favor, completa todos los campos.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/users/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, mensaje }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || '¡Mensaje enviado con éxito! Nos contactaremos pronto.');
        setNombre('');
        setEmail('');
        setMensaje('');
      } else {
        toast.error(data.message || 'Hubo un problema al enviar tu consulta.');
      }
    } catch (error) {
      console.error('Error al enviar consulta:', error);
      toast.error('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contacto" className="bg-black py-20 px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row"> 
        <div className="md:w-2/5 bg-[#6A8E23] p-12 text-white flex flex-col justify-center">
          <h2 className="text-4xl font-bold mb-6">Hacé Tu Consulta</h2>
          <p className="opacity-90">¿Tenés alguna pregunta? Completá el formulario y nos pondremos en contacto pronto.</p>
        </div>
        <form onSubmit={handleSubmit} className="md:w-3/5 p-12 space-y-4">
          <input 
            type="text" 
            placeholder="Nombre Completo" 
            className="w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-[#6A8E23]"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <input 
            type="email" 
            placeholder="Email" 
            className="w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-[#6A8E23]" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <textarea 
            placeholder="Mensaje" 
            rows="4" 
            className="w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-[#6A8E23]"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            required
          ></textarea>
          <button 
            disabled={loading}
            className="w-full bg-[#6A8E23] text-white py-4 rounded-xl font-bold text-lg hover:bg-zinc-800 transition-colors disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Enviar Mensaje'}
          </button>
        </form>
      </div>
    </section>
  );
}