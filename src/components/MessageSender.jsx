import { useState, useRef } from 'react';
import './MessageSender.css';
import 'react-phone-input-2/lib/style.css';
import PhoneInput from 'react-phone-input-2';

const MessageSender = ({ isConnected, onMessageSent }) => {
  const [formData, setFormData] = useState({
    telefono: '',
    templateOption: 'cita_gratis',
    nombre: '',
    fecha: '',
    hora: '',
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

  // Obtener fecha mínima (hoy)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Generar preview del mensaje en tiempo real
    if (name === 'templateOption' || name === 'nombre' || name === 'fecha' || name === 'hora') {
      generateMessagePreview({
        ...formData,
        [name]: value
      });
    }
  };

  // Generar preview del mensaje de texto
  const generateMessagePreview = (data) => {
    if (!data.templateOption || !data.nombre || !data.fecha || !data.hora) {
      setMessagePreview('');
      return;
    }

    const templates = {
      cita_gratis: `¡Hola 👋

✅ Tu primera cita GRATUITA ha sido confirmada:

📅 Fecha: ${data.fecha}
🕐 Hora: ${data.hora}
👨‍⚕️ Psicólogo: ${data.nombre}

🎉 ¡Recuerda que tu primera consulta es completamente GRATIS!

Si tienes alguna consulta, no dudes en contactarnos.

¡Te esperamos! 🌟`,

      cita_pagada: `¡Hola 👋

✅ Tu cita ha sido confirmada:

📅 Fecha: ${data.fecha}
🕐 Hora: ${data.hora}
👨‍⚕️ Psicólogo: ${data.nombre}

Por favor, realiza el pago antes de la consulta para confirmar tu reserva.

Si tienes dudas, contáctanos.

¡Gracias por confiar en nosotros!`,

      recordatorio_cita: `¡Hola 👋

⏰ Te recordamos tu cita próxima:

📅 Fecha: ${data.fecha}
🕐 Hora: ${data.hora}
👨‍⚕️ Psicólogo: ${data.nombre}

Por favor, confirma tu asistencia respondiendo a este mensaje.

¡Nos vemos pronto!`,

      confirmacion_asistencia: `¡Hola 👋

✅ Hemos recibido tu confirmación de asistencia para la cita:

📅 Fecha: ${data.fecha}
🕐 Hora: ${data.hora}
👨‍⚕️ Psicólogo: ${data.nombre}

¡Gracias por avisarnos!`
    };

    setMessagePreview(templates[data.templateOption] || '');
  };

  // Manejar cambio de archivo
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
      setError('El nombre del psicólogo es requerido');
      return false;
    }

    if (!formData.fecha) {
      setError('La fecha es requerida');
      return false;
    }

    if (!formData.hora) {
      setError('La hora es requerida');
      return false;
    }

    // Validar formato de teléfono
    const cleantelefono = formData.telefono.replace(/\D/g, '');
    if (cleantelefono.length < 10 || cleantelefono.length > 15) {
      setError('El número de teléfono debe tener entre 10 y 15 dígitos');
      return false;
    }

    // Validar que la fecha no sea pasada
    const selectedDate = new Date(formData.fecha);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      setError('La fecha no puede ser en el pasado');
      return false;
    }

    if (!file) {
      setError('Debes seleccionar una imagen');
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

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Usamos FormData para enviar texto + archivo
      const bodyToSend = new FormData();
      bodyToSend.append('telefono', formData.telefono);
      bodyToSend.append('templateOption', formData.templateOption);
      bodyToSend.append('nombre', formData.nombre);
      bodyToSend.append('fecha', formData.fecha);
      bodyToSend.append('hora', formData.hora);

      // Si hay archivo, lo añadimos
      if (file) {
        bodyToSend.append('image', file); // Cambia 'flyer' a 'image' si tu back-end lo espera así
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
        templateOption: 'cita_gratis',
        nombre: '',
        fecha: '',
        hora: '',
      });
      setFile(null);
      setPreview(null);
      setMessagePreview('');
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Limpiar input file
      }

      if (onMessageSent) {
        onMessageSent(data);
      }

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
      <h2>📱 Enviar Mensaje WhatsApp con Imagen</h2>
      
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
            <option value="cita_gratis">Cita gratis</option>
            <option value="cita_pagada">Cita pagada</option>
            <option value="recordatorio_cita">Recordatorio cita</option>
            <option value="confirmacion_asistencia">Confirmacion asistencia</option>
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
            placeholder="Nombre completo del psicólogo"
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
            required={!preview} // Solo requerido si no hay preview
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

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="fecha">📅 Fecha *</label>
            <input
              type="date"
              id="fecha"
              name="fecha"
              value={formData.fecha}
              onChange={handleInputChange}
              min={getMinDate()}
              disabled={loading || !isConnected}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="hora">🕐 Hora *</label>
            <input
              type="time"
              id="hora"
              name="hora"
              value={formData.hora}
              onChange={handleInputChange}
              disabled={loading || !isConnected}
              required
            />
          </div>
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
