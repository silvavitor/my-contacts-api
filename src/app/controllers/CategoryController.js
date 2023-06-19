const CategoriesRepository = require('../repositories/CategoriesRepository');
const ContactRepository = require('../repositories/ContactRepository');

class CategoryController {
  async index(request, response) {
    const { orderBy } = request.query;
    const categories = await CategoriesRepository.findAll(orderBy);

    return response.json(categories);
  }

  async show(request, response) {
    const { id } = request.params;

    const category = await CategoriesRepository.findById(id);

    if (!category) {
      return response.status(404).json({ error: 'Category not found!' });
    }
    return response.json(category);
  }

  async update(request, response) {
    const { id } = request.params;
    const { name } = request.body;

    if (!name) {
      return response.status(400).json({ error: 'name is required!' });
    }

    const categoryExists = await CategoriesRepository.findById(id);

    if (!categoryExists) {
      return response.status(404).json({ error: 'Category not exists!' });
    }

    const categoryByName = await CategoriesRepository.findByName(name);

    if (categoryByName && categoryByName.id !== id) {
      return response.status(400).json({ error: 'name already in use!' });
    }

    const category = await CategoriesRepository.update(id, name);
    return response.json(category);

  }

  async store(request, response) {
    const { name } = request.body;

    if (!name) {
      return response.status(400).json({ error: 'name is required!' });
    }

    const categoryExists = await CategoriesRepository.findByName(name);

    if (categoryExists) {
      return response.status(400).json({ error: 'name already been taken!' });
    }

    const newCategory = await CategoriesRepository.store(name);
    response.status(201).json(newCategory);
  }

  async delete(request, response) {
    const { id } = request.params;

    const categoryInUse = await ContactRepository.findByCategoryId(id);

    if (categoryInUse) {
      return response.status(403).json({ error: 'category attached to contact!' });
    }

    await CategoriesRepository.delete(id);

    response.sendStatus(204);
  }
}

module.exports = new CategoryController();
