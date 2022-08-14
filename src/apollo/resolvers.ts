import { PrismaClient, Prisma, categories } from '@prisma/client';




const prisma = new PrismaClient();
interface Context {prisma: PrismaClient};
const context: Context = {prisma: prisma,};
interface Iresult_flows {
  flow_name:string;
  flow_description:string;
  flow_cas: string;
  flow_synonyms:string;
  flow_type:string;
  database:string;
  flow_category_id:string;
  flow_category_name:string;
  flow_properties:string;
  location_id:string;
  location_name:string;
}
async function flow() {
  // Data form database
  const flows = await prisma.flows.findMany({
    take:88,
    select: {
      data_name:true,
      description:true,
      cas: true,
      synonyms:true,
      flow_type:true,
      database:true,
      category_id:true,
      category_name:true,
      flow_properties:true,
      location_id:true,
      location_name:true,
    },
  });
  // Defining the new json array schema
  let resultJson_flows: any[] = [];
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
      flow_category_id:'',
      flow_category_name:'',
      flow_properties:'',
      location_id:'',
      location_name:'',
    };
    result.flow_name = item?.data_name;
    result.flow_cas = item?.cas;
    result.flow_description = item?.description;
    result.flow_synonyms = item?.synonyms;
    result.flow_type = item?.flow_type;
    result.database = item?.database;
    result.flow_category_id = item?.category_id;
    result.flow_category_name = item?.category_name;
    result.flow_properties = JSON.stringify(item?.flow_properties)
    result.location_id = item?.location_id;
    result.location_name = item?.location_name;
    resultJson_flows.push(result);
  });
  return resultJson_flows;
}

// interface Iresult_categories {
//   // id:string;
//   category_id:string;
//   category_name:string;
//   category_subclass:string;
//   category_class:string[];
//   // id:string;
// }
// async function Categories() {
//   // Data form database
//   const categories = await prisma.categories.findMany({
//     // where: {
//     //   id:category_id,
//     // },
//     select: {
//       id:true,
//       data_name:true,
//       category_name:true,
//       category_path:true,
//     }
//   });
//   // Defining the new json array schema
//   let resultJson_categories: any [] = [];
//   // Fill in the data
//   categories?.forEach(item => {
//     // Defining json item
//     let result: Iresult_categories = {
//       category_name: '',
//       category_subclass: '',
//       category_class: [''],
//       // category_id: '',
//     };
//     result.category_name = item?.data_name;
//     result.category_subclass = item?.category_name;
//     // result.category_id = item?.id;
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

interface Iresult_locations {
  name:string
}

async function Location() {
  // Data form database
  const locations = await prisma.locations.findMany({
    take:88,
    select: {
      data_name:true,
    },
  });
  // Defining the new json array schema
  let resultJson_locations: any[] = [];
  // Fill in the data
  locations?.forEach(item => {
    // Defining json item
    let result: Iresult_locations = {
      name:'',
    };
    result.name = item?.data_name;
    resultJson_locations.push(result);
  });
  return resultJson_locations;
}



const resolvers = {
  Query: {
    Flows() {return flow()},
    Locations() {return Location()}
  },
  Flow:{
    async flow_categories(parent){
      // const categories = await prisma.categories.findFirst({ where: {data_name: parent.flow_category_name,category_type:'Flow'}, select: {category_name: true,category_path:true} })
      const categories = await prisma.categories.findFirst({ where: { id: parent.flow_category_id??'Null'}, select:{data_name:true,category_name: true,category_path:true}})
      const category_class_list  = categories.category_path as Prisma.JsonArray ;
      let bufferArray: string []=[];
      category_class_list?.forEach(item=>{
        bufferArray.push(item?.toString());
      })
      return {'category_name':categories.data_name,'category_subclass':categories.category_name,'category_class':bufferArray}
    },
    async flow_locations(parent){
      const location = await prisma.locations.findFirst({ 
        where: {data_name: parent.location_name??'Null'}, 
        // where: {id: parent.location_id??'Null'}, 
      select:{data_name:true,description:true,longitude:true,latitude:true,code:true,geometry_type:true,geometry_geometries:true}})
      // select:{data_name:true}})
      return {'name':location.data_name,'code':location.code,'description':location.description,'longitude':location.longitude,'latitude':location.latitude,'geometry_type':location.geometry_type,'geometry_geometries':JSON.stringify(location.geometry_geometries)}
      // return {'name':location.data_name}
    },
  }
}

export default resolvers;
