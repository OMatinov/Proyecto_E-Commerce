
export const getContactos = () => {
  const stored = localStorage.getItem('grwu_contactos');
  return stored ? JSON.parse(stored) : [];
};

const saveContactos = (contactos) => {
  localStorage.setItem('grwu_contactos', JSON.stringify(contactos));
};

export const createContacto = (contacto) => {
  const contactos = getContactos();
  const nuevo = { 
    ...contacto, 
    id: Date.now(), 
    fecha: new Date().toISOString(), 
    leido: false 
  };
  const updated = [nuevo, ...contactos]; 
  saveContactos(updated);
  return nuevo;
};

export const marcarLeido = (id) => {
  const contactos = getContactos();
  const updated = contactos.map(c => c.id === id ? { ...c, leido: true } : c);
  saveContactos(updated);
};

export const deleteContacto = (id) => {
  const contactos = getContactos();
  const filtered = contactos.filter(c => c.id !== id);
  saveContactos(filtered);
};