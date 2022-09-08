import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function UnitGroup(unit_group_id: string) {
  const unit_group = await prisma.unit_groups.findFirst({
    where: { id: unit_group_id },
    select: {
      data_name: true,
      description: true,
      category_id: true,
    },
  });
  return {
    name: unit_group?.data_name,
    description: unit_group?.description,
  };
}

export default UnitGroup;
