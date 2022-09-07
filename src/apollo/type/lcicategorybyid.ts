import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Iresult_lcia_impact_category {
  name: string;
  description: string;
  reference_unit_name: string;
  impact_factors: string;
  // id:string;
}
async function LCIACategorybyId(ids: any[]) {
  const impact_categories = await prisma.lcia_categories.findMany({
    select: { data_name: true, description: true, reference_unit_name: true, impact_factors: true },
    where: { id: { in: ids } },
  });
  const resultJson_impact_categories: any[] = [];
  impact_categories?.forEach(item => {
    // if (ids.includes(item?.id)){
    const result: Iresult_lcia_impact_category = {
      name: '',
      description: '',
      reference_unit_name: '',
      impact_factors: '',
      // id:'',
    };
    (result.name = item?.data_name),
      (result.description = item?.description),
      (result.reference_unit_name = item?.reference_unit_name),
      (result.impact_factors = JSON.stringify(item?.impact_factors)),
      // result.id = item?.id,
      resultJson_impact_categories.push(result);
    // }
  });
  return resultJson_impact_categories;
}

export default LCIACategorybyId;
