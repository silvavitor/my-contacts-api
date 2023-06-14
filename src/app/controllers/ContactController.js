const ContactRepository = require('../repositories/ContactRepository');
const CategoriesRepository = require('../repositories/CategoriesRepository');
const isValidUUID = require('../utils/isValidUUID');

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

    if (!isValidUUID(id)) {
      return response.status(400).json({ error: 'Invalid contact id' });
    }

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

    if (email) {
      const contactExists = await ContactRepository.findByEmail(email);

      if (contactExists) {
        return response.status(400).json({ error: 'email already in use!' });
      }
    }

    if (category_id) {

      if (!isValidUUID(category_id)) {
        return response.status(400).json({ error: 'Invalid category' });
      }

      const category = await CategoriesRepository.findById(category_id);

      if (!category) {
        return response.status(404).json({ error: 'Category not found!' });
      }
    }

    const newContact = await ContactRepository.create({
      name,
      email: email || null,
      phone,
      category_id: category_id || null,
    });

    response.status(201).json(newContact);
  }

  // Editar um registro
  async update(request, response) {
    const { id } = request.params;
    const {
      name, email, phone, category_id,
    } = request.body;

    if (!isValidUUID(id)) {
      return response.status(400).json({ error: 'Invalid contact id' });
    }

    if (!name) {
      return response.status(400).json({ error: 'name is required!' });
    }

    if (category_id) {
      if (!isValidUUID(category_id)) {
        return response.status(400).json({ error: 'Invalid category' });
      }

      const category = await CategoriesRepository.findById(category_id);

      if (!category) {
        return response.status(404).json({ error: 'Category not found!' });
      }
    }

    const contactExists = await ContactRepository.findById(id);

    if (!contactExists) {
      return response.status(404).json({ error: 'Contact not exists!' });
    }

    if (email) {
      const contactByEmail = await ContactRepository.findByEmail(email);

      if (contactByEmail && contactByEmail.id !== id) {
        return response.status(400).json({ error: 'email already in use!' });
      }
    }

    const contact = await ContactRepository.update(id, {
      name,
      email: email || null,
      phone,
      category_id: category_id || null,
    });

    response.json(contact);
  }

  // Deletar um registro
  async delete(request, response) {
    const { id } = request.params;

    await ContactRepository.delete(id);

    response.sendStatus(204);
  }
}

module.exports = new ContactController();
