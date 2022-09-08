import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function Unit(unit_id: string) {
  const unit = await prisma.units.findFirst({
    where: { id: unit_id },
    select: {
      data_name: true,
      description: true,
      synonyms: true,
      conversion_factor: true,
      reference_unit: true,
      unit_groups_id: true,
    },
  });
  return {
    name: unit?.data_name,
    description: unit?.description,
    synonyms: unit?.synonyms,
    conversion_factor: unit?.conversion_factor,
    reference_unit: unit?.reference_unit,
  };
}

export default Unit;
