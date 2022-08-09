import { PrismaClient, Prisma } from '@prisma/client';

interface Iresult_flows {
  flow_name:string;
  flow_description:string;
  flow_cas: string;
  flow_synonyms:string;
  flow_type:string;
  database:string;
  // category_name: string;
  // category_path: string[];
  // category_id:string;
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
      data_name:true,
      description:true,
      cas: true,
      synonyms:true,
      flow_type:true,
      database:true,
      // category_id:true,
    },
  });
  // Defining the new json array schema
  let resultJson: any[] = [];
  // Fill in the data
  flows?.forEach(item => {
    // Defining json item
    let result: Iresult_flows = {
      flow_name:'',
      flow_description: '',
      flow_cas:'',
      flow_synonyms:'',
      flow_type:'',
      database:'',
      // category_id:'',
      // category_name: '',
      // category_path: [''],
    };
    result.flow_name = item?.data_name;
    result.flow_cas = item?.cas;
    result.flow_description = item?.description;
    result.flow_synonyms = item?.synonyms;
    result.flow_type = item?.flow_type;
    result.database = item?.database;
    // result.category_id=item?.category_id;
    // result.category_name = item?.category_name;
    // const category_path_list = item?.category_path as Prisma.JsonArray;
    // let bufferArray: string[] = [];
    // category_path_list?.forEach(item => {
    //   bufferArray.push(item?.toString());
    // });
    // result.category_path = bufferArray;
    resultJson.push(result);
  });

  return resultJson;
}


interface Iresult_flow_properties {
  flow_property_name:string;
  flow_property_description:string;
  flow_property_type:string;
  // flow_property_category:Categories
}
async function flow_properties() {
  // Data form database
  const flow_properties = await prisma.flow_properties.findMany({
    // take:88,
    select: {
      data_name:true,
      description:true,
      flow_property_type:true,
    },
  });
  // Defining the new json array schema
  let resultJson_flow_properties: any[] = [];
  // Fill in the data
  flow_properties?.forEach(item => {
    // Defining json item
    let result: Iresult_flow_properties = {
      flow_property_name: '',
      flow_property_description:'',
      flow_property_type:'',
    };
    result.flow_property_name = item?.data_name;
    result.flow_property_description = item?.description;
    result.flow_property_type = item?.flow_property_type;
    resultJson_flow_properties.push(result);
  });
  return resultJson_flow_properties;
}

interface Iresult_categories {
  category_name:string;
  category_subclass:string;
  category_class:string[];
  id:string;
}
async function categories() {
  // Data form database
  const categories = await prisma.categories.findMany({
    take:88,
    select: {
      data_name:true,
      category_name:true,
      category_path:true,
    },
    // where:{
    //   id:true,
    // }
  });
  // Defining the new json array schema
  let resultJson_categories: any[] = [];
  // Fill in the data
  categories?.forEach(item => {
    // Defining json item
    let result: Iresult_categories = {
      category_name: '',
      category_subclass:'',
      category_class:[''],
      id:'',
    };
    result.category_name = item?.data_name;
    result.category_subclass = item?.category_name;
    const category_class_list = item?.category_path as Prisma.JsonArray;
    let bufferArray: string[] = [];
    category_class_list?.forEach(item => {
      bufferArray.push(item?.toString());
    });
    result.category_class = bufferArray;
    resultJson_categories.push(result);
  });
  return resultJson_categories;
}

interface Iresult_processes {
  process_name:string;
  process_description:string;
  process_type:string;
  process_allocation_method_default:string;
  process_allocation_factors:string[];
  process_exchanged_flows:string[];
  process_parameters:string[];
  database:string;
}

// async function processes() {
//   // Data form database
//   const processes = await prisma.processes.findMany({
//     take:88,
//     // where:{
//     //   '':,

//     // },
//     select: {
//       data_name:true,
//       category_name:true,
//       category_path:true,
//     },
//   });
//   // Defining the new json array schema
//   let resultJson_categories: any[] = [];
//   // Fill in the data
//   categories?.forEach(item => {
//     // Defining json item
//     let result: Iresult_categories = {
//       category_name: '',
//       category_subclass:'',
//       category_class:[''],
//     };
//     result.category_name = item?.data_name;
//     result.category_subclass = item?.category_name;
//     const category_class_list = item?.category_path as Prisma.JsonArray;
//     let bufferArray: string[] = [];
//     category_class_list?.forEach(item => {
//       bufferArray.push(item?.toString());
//     });
//     result.category_class = bufferArray;
//     resultJson_categories.push(result);
//   });
//   return resultJson_categories;
// }


const resolvers = {
  Query: {
    allFlows: () => {return flows();},
    allFlowProperties: () => {return flow_properties();},
    allCategories:() => {return categories();},
  },
};

export default resolvers;
