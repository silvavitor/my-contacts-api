const ContactRepository = require('../repositories/ContactRepository');

class ContactController {
  // Listar todos os registros
  async index(request, response) {
    const { orderBy } = request.query;
    const contacts = await ContactRepository.findAll(orderBy);

    response.json(contacts);
  }

  // Listar um registro
  async show(request, response) {
    const { id } = request.params;

    const contact = await ContactRepository.findById(id);

    if (!contact) {
      return response.status(404).json({ error: 'Contact not found!' });
    }

    response.json(contact);
  }

  // Criar um registro
  async store(request, response) {
    const {
      name, email, phone, category_id,
    } = request.body;

    if (!name) {
      return response.status(400).json({ error: 'name is required!' });
    }

    if (!email) {
      return response.status(400).json({ error: 'email is required!' });
    }

    const contactExists = await ContactRepository.findByEmail(email);

    if (contactExists) {
      return response.status(400).json({ error: 'e-mail already been taken!' });
    }

    const newContact = await ContactRepository.create({
      name,
      email,
      phone,
      category_id,
    });

    response.status(201).json(newContact);
  }

  // Editar um registro
  async update(request, response) {
    const { id } = request.params;
    const {
      name, email, phone, category_id,
    } = request.body;

    if (!name) {
      return response.status(400).json({ error: 'name is required!' });
    }

    if (!email) {
      return response.status(400).json({ error: 'email is required!' });
    }

    const contactExists = await ContactRepository.findById(id);

    if (!contactExists) {
      return response.status(404).json({ error: 'User not exists!' });
    }

    const contactByEmail = await ContactRepository.findByEmail(email);

    if (contactByEmail && contactByEmail.id !== id) {
      return response.status(400).json({ error: 'email already in use!' });
    }

    const contact = await ContactRepository.update(id, {
      name, email, phone, category_id,
    });

    response.json(contact);
  }

  // Deletar um registro
  async delete(request, response) {
    const { id } = request.params;

    const contact = await ContactRepository.findById(id);

    if (!contact) {
      return response.status(404).json({ error: 'Contact not found!' });
    }

    await ContactRepository.delete(id);

    response.sendStatus(204);
  }
}

module.exports = new ContactController();
