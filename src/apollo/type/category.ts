import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function Category(category_id: string) {
  // Data form database
  const categories = await prisma.categories.findFirst({
    where: { id: category_id },
    select: { data_name: true, category_name: true, category_path: true },
  });
  // Defining the new json array schema
  const category_class_list = categories.category_path as Prisma.JsonArray;
  const bufferArray: string[] = [];
  category_class_list?.forEach(item => {
    bufferArray.push(item?.toString());
  });
  return { name: categories.data_name, subclass: categories.category_name, class: bufferArray };
}

export default Category;
