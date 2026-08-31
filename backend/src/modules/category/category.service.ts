import { appDataSource } from "../../config/db.js";
import { Category } from "./category.entity.js";
import { AppError, HTTP_STATUS } from "../../utils/error.js";

const categoryRepo = appDataSource.getRepository(Category);

export async function generateSlug(name: string) {
  const slug = name.toLowerCase().replace(/\s+/g, "-");
  return slug;
}

export async function createCategory(name: string) {
  if (!name)
    throw new AppError("name can't be empty!", HTTP_STATUS.BAD_REQUEST);

  const categoryExist = await categoryRepo.findOneBy({ name: name });
  if (categoryExist) {
    throw new AppError("category exist", HTTP_STATUS.CONFLICT);
  }

  const slug = await generateSlug(name);

  const category = new Category();
  category.name = name;
  category.slug = slug;
  await categoryRepo.save(category);

  return { data: category };
}

export async function updateCategory(id: string, name: string) {
  const category = await categoryRepo.findOneBy({ id });
  if (!category) {
    throw new AppError("category not found", HTTP_STATUS.NOT_FOUND);
  }

  const slug = await generateSlug(name);
  category.name = name;
  category.slug = slug;
  await categoryRepo.save(category);

  return { data: category };
}

export async function deleteCategory(id: string) {
  const category = await categoryRepo.findOneBy({ id });
  if (!category) {
    throw new AppError("Category not found", HTTP_STATUS.NOT_FOUND);
  }
  await categoryRepo.delete(id);
  return;
}

export async function findAllCategories() {
  const category = await categoryRepo.find();
  if (category.length === 0) {
    throw new AppError("Category not found", HTTP_STATUS.NOT_FOUND);
  }

  return { data: category };
}

export async function findCategoryById(id: string) {
  const category = await categoryRepo.findOneBy({ id });
  if (!category) {
    throw new AppError("category not found", HTTP_STATUS.NOT_FOUND);
  }
  return { data: category };
}
