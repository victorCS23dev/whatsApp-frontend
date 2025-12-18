import { useState, useRef } from 'react';
import './MessageSender.css';
import 'react-phone-input-2/lib/style.css';
import PhoneInput from 'react-phone-input-2';

const MessageSender = ({ isConnected, onMessageSent }) => {
  const [formData, setFormData] = useState({
    telefono: '',
    templateOption: '1',
    nombre: '',
  });

  const [file, setFile] = useState(null);       // imagen seleccionada
  const [preview, setPreview] = useState(null); // url de previsualización
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [messagePreview, setMessagePreview] = useState(''); // preview del mensaje de texto

  const apiBaseUrl = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:5111';
  const token = localStorage.getItem('token');

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const updatedData = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedData);

    if (name === 'nombre' || name === 'templateOption') {
      generateMessagePreview(
        updatedData.templateOption,
        updatedData.nombre
      );
    }
  };


  // Generar preview del mensaje de texto
  const generateMessagePreview = (option, nombre) => {
  if (!option || !nombre) {
    setMessagePreview('');
    return;
  }

  const templates = {
    '1': `¡Hola ${nombre}!👋
Gracias por contactarnos. Soy un encargado de DIGIMEDIA 🚀

¿Sabías que el 75% de usuarios juzga la credibilidad de tu negocio por tu sitio web?
✅ Sin una web profesional, pierdes clientes antes de que te conozcan
✅ Un diseño optimizado convierte visitas en ventas reales 💰

💬 Cuéntame: ¿Cual es tu negocio?¿ya tienes web o necesitas crear una desde cero? 👇`,

    '2': `¡Hola ${nombre}!👋
Gracias por contactarnos. Soy un encargado de DIGIMEDIA 🚀

¿Sabías que el 73% de las empresas que gestionan bien sus redes duplican sus ventas en menos de 6 meses ?💰
⚠️Tu competencia podría estar captando a TU próximo cliente ahora mismo 

💬 Cuéntame: ¿cuál es tu negocio y cuál es tu mayor desafío con tus redes ahora mismo? 👇`,

    '3': `¡Hola ${nombre}!👋
Gracias por contactarnos. Soy un encargado de DIGIMEDIA 🚀

¿Sabías que el 68% de empresas invierte en digital pero solo el 22% ve resultados reales? 📊
La diferencia está en la ESTRATEGIA, no solo en estar presente 🎯

💬Cuéntame, ¿Cual es tu negocio y cómo están funcionando tus campañas digitales? 👇`,

    '4': `Hola ${nombre}👋
Gracias por contactarnos. Soy un encargado de DIGIMEDIA 🚀

¿Sabías que el 77% de consumidores compra por marcas que reconoce visualmente?🎨✨
⚠️ Si tu marca no te representa, pierdes CONEXIÓN Y VENTAS 📉
🔥 Tu identidad visual es tu carta de presentación. Cuando funciona, vende sola

💬 Cuéntame: ¿Cual es tu negocio?¿quieres crear tu branding desde cero o renovarlo? 👇`,
  };

  setMessagePreview(templates[option] || '');
};


  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile)); // genera la URL de preview
    } else {
      setFile(null);
      setPreview(null);
    }
  };

  // Validar formulario
  const validateForm = () => {
    if (!formData.telefono.trim()) {
      setError('El número de teléfono es requerido');
      return false;
    }

    if (!formData.nombre.trim()) {
      setError('El nombre del cliente es requerido');
      return false;
    }

    // Validar formato de teléfono
    const cleanPhone = formData.telefono.replace(/\D/g, '');
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      setError('El número de teléfono debe tener entre 10 y 15 dígitos');
      return false;
    }

    return true;
  };

  // Enviar mensaje
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isConnected) {
      setError('Debes estar conectado a WhatsApp para enviar mensajes');
      return;
    }

    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Usamos FormData para enviar texto + archivo
      const bodyToSend = new FormData();
      bodyToSend.append('telefono', formData.telefono);
      bodyToSend.append('templateOption', formData.templateOption);
      bodyToSend.append('nombre', formData.nombre);

      // Si hay archivo, lo añadimos
      if (file) {
        bodyToSend.append('image', file);
      }

      const response = await fetch(`${apiBaseUrl}/api/send-message-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}` // No poner content-type aquí
        },
        body: bodyToSend
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const errorMessages = data.errors.map(err => `${err.field}: ${err.message}`).join(', ');
          throw new Error(errorMessages);
        }
        throw new Error(data.message || 'Error al enviar mensaje');
      }

      setSuccess(`Mensaje enviado exitosamente a ${formData.telefono}`);
      
      // Limpiar formulario
      setFormData({
        telefono: '',
        templateOption: '1',
        nombre: '',
      });

      setFile(null);
      setPreview(null);
      setMessagePreview('');
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Limpiar input file
      }

      onMessageSent?.(data);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Limpiar mensajes
  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  return (
    <div className="message-sender">
      <h2>📱 Enviar Mensaje WhatsApp</h2>

      {!isConnected && (
        <div className="warning-message">
          ⚠️ Debes estar conectado a WhatsApp para enviar mensajes
        </div>
      )}

      {error && (
        <div className="error-message" onClick={clearMessages}>
          ❌ {error}
          <span className="close-btn">×</span>
        </div>
      )}

      {success && (
        <div className="success-message" onClick={clearMessages}>
          ✅ {success}
          <span className="close-btn">×</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="message-form">
        <div className="form-group">
          <label htmlFor="telefono">📞 Número de Teléfono *</label>

          <PhoneInput
            country={'pe'}
            value={formData.telefono}
            onChange={(value) =>
              setFormData({ ...formData, telefono: value })
            }
            inputProps={{
              name: 'telefono',
              required: true,
              disabled: loading || !isConnected,
            }}
            enableSearch={true}
            containerClass="phone-input-container"
            inputClass="phone-input"
            buttonClass="phone-flag"
          />

          <small>Selecciona país y escribe solo números</small>
        </div>

        <div className="form-group">
          <label htmlFor="templateOption">📝Tipo de mensaje *</label>
          <select
            id="templateOption"
            name="templateOption"
            value={formData.templateOption}
            onChange={handleInputChange}
            disabled={loading || !isConnected}
            required
          >
            <option value="1">DISEÑO Y DESARROLLO WEB</option>
            <option value="2">GESTIÓN DE REDES SOCIALES</option>
            <option value="3">MARKETING Y GESTIÓN DIGITAL</option>
            <option value="4">BRANDING Y DISEÑO</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="nombre">👨‍⚕️ Nombre del Cliente *</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            placeholder="Nombre completo del Cliente"
            disabled={loading || !isConnected}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">🖼️ Subir Imagen *</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            disabled={loading || !isConnected}
            ref={fileInputRef}
          />

          {/* Preview con botón X */}
          {preview && (
            <div className="image-preview" style={{ position: 'relative', display: 'inline-block' }}>
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setPreview(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = ''; // Limpiar input file
                  }
                }}
                style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  lineHeight: '22px',
                  textAlign: 'center'
                }}
              >
                ✖
              </button>
              <img
                src={preview}
                alt="Vista previa de la imagen"
                style={{
                  maxWidth: '250px',
                  margin: '10px auto',
                  borderRadius: '8px',
                  display: 'block',
                }}
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !isConnected}
        >
          {loading ? '⏳ Enviando...' : '📤 Enviar Mensaje'}
        </button>
      </form>

      {messagePreview && (
        <div className="message-preview">
          <h3>👀 Vista Previa del Mensaje</h3>
          <div className="preview-content">
            <pre>{messagePreview}</pre>
          </div>
          <div className="preview-info">
            <span>📱 Destinatario: {formData.telefono || 'No especificado'}</span>
            <span>📊 Caracteres: {messagePreview.length}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageSender;
