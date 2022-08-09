import { PrismaClient, Prisma } from '@prisma/client';

interface Iresult {
  cas: string;
  data_name:string;
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
      data_name:true,
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
      data_name:'',
      cas: '',
      category_name: '',
      category_path: [''],
    };
    result.data_name = item?.data_name;
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


interface Iresult1 {
  data_name:string;
  description:string;
}
async function flow_properties() {
  // Data form database
  const flow_properties = await prisma.flow_properties.findMany({
    take:88,
    select: {
      data_name:true,
      description:true,
    },
  });

  // Defining the new json array schema
  let resultJson: any[] = [];

  // Fill in the data
  flow_properties?.forEach(item => {
    // Defining json item
    let result: Iresult1 = {
      data_name:'',
      description: '',
    };
    result.data_name = item?.data_name;
    result.description = item?.description;
    resultJson.push(result);
  });

  return resultJson;
}

const resolvers = {
  Query: {
    allFlows: () => {return flows();},
    flowProperties: () => {return flow_properties();},
  },
};

export default resolvers;
