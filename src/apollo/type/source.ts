import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function Source(source_id: string) {
  const source = await prisma.sources.findFirst({
    where: { id: source_id },
    select: {
      data_name: true,
      description: true,
      year: true,
      text_reference: true,
      url: true,
      // for child
      category_id: true,
    },
  });
  return {
    name: source?.data_name,
    description: source?.description,
    year: source?.year,
    text_reference: source?.text_reference,
    url: source?.url,
  };
}

export default Source;
