import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Iresult_lcia_method {
  name: string;
  description: string;
  category_id: string;
  impact_categories_id: [];
  normalization_and_weighting_sets: string;
}
async function LCIAMethod() {
  const method = await prisma.lcia_methods.findMany({
    take: 10,
    select: {
      data_name: true,
      description: true,
      impact_categories: true,
      nw_sets: true,
      // for child
      category_id: true,
    },
  });
  const resultJson_lcia_method: any[] = [];
  method?.forEach(item => {
    const result: Iresult_lcia_method = {
      name: '',
      description: '',
      impact_categories_id: [],
      normalization_and_weighting_sets: '',
      category_id: '',
    };
    result.name = item?.data_name;
    result.description = item?.description;
    result.category_id = item?.category_id;
    result.impact_categories_id = JSON.parse(JSON.stringify(item?.impact_categories)).map(i => i['@id']);
    result.normalization_and_weighting_sets = JSON.stringify(item?.nw_sets);
    resultJson_lcia_method.push(result);
  });
  return resultJson_lcia_method;
}

export default LCIAMethod;
