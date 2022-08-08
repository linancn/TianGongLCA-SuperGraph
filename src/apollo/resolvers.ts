import { PrismaClient, Prisma } from '@prisma/client';

interface Iresult {
  cas: string;
  category_name: string;
  category_path: string[];
}

const prisma = new PrismaClient();

async function flows() {
  // Data form database
  const flows = await prisma.flows.findMany({
    // where: {
    //   cas: '7429-90-5',
    // },
    take:88,
    select: {
      cas: true,
      category_name: true,
      category_path: true,
    },
  });

  // Defining the new json array schema
  let resultJson: any[] = [];

  // Fill in the data
  flows?.forEach(item => {
    // Defining json item
    let result: Iresult = {
      cas: '',
      category_name: '',
      category_path: [''],
    };
    result.cas = item?.cas;
    result.category_name = item?.category_name;
    const category_path_list = item?.category_path as Prisma.JsonArray;
    let bufferArray: string[] = [];
    category_path_list?.forEach(item => {
      bufferArray.push(item?.toString());
    });
    result.category_path = bufferArray;
    resultJson.push(result);
  });

  return resultJson;
}

const resolvers = {
  Query: {
    allFlows: () => {
      return flows();
    },
    flowProperties: () => {
      return prisma.flow_properties.findMany({
        select: {
          id: true,
          data_name: true,
        },
      });
    },
  },
};

export default resolvers;
