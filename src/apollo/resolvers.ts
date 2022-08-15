import { PrismaClient, Prisma, categories } from '@prisma/client';




const prisma = new PrismaClient();
interface Context {prisma: PrismaClient};
const context: Context = {prisma: prisma,};
interface Iresult_flow {
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
  let resultJson_flow: any[] = [];
  // Fill in the data
  flows?.forEach(item => {
    // Defining json item
    let result: Iresult_flow = {
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
    resultJson_flow.push(result);
  });
  return resultJson_flow;
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

interface Iresult_process {
  id:string;
  category_id:string;
  location_id:string;
  process_name:string;
  exchange_dq_system_id:string;
  process_description:string;
  process_type:string;
  process_allocation_method_default:string;
  process_allocation_factors:string;
  process_exchanged_flows:string;
  process_parameters:string;
  database:string;
}
async function process() {
  // Data form database
  const process = await prisma.processes.findMany({
    take:88,
    select: {
      id:true,
      category_id:true,
      location_id:true,
      exchange_dq_system_id:true,
      data_name:true,
      description:true,
      process_type:true,
      default_allocation_method:true,
      allocation_factors:true,
      exchanges:true,
      parameters:true,
      database:true, 
    },
  });
  // Defining the new json array schema
  let Iresult_process: any[] = [];
  // Fill in the data
  process?.forEach(item => {
    // Defining json item
    let result: Iresult_process = {
      id:'',
      category_id:'',
      location_id:'',
      exchange_dq_system_id:'',
      process_name:'',
      process_description:'',
      process_type:'',
      process_allocation_method_default:'',
      process_allocation_factors:'',
      process_exchanged_flows:'',
      process_parameters:'',
      database:'',
    };
    result.id = item?.id;
    result.category_id = item?.category_id;
    result.location_id = item?.location_id;
    result.exchange_dq_system_id = item?.exchange_dq_system_id;
    result.process_name = item?.data_name;
    result.process_description = item?.description;
    result.process_type = item?.process_type;
    result.database = item?.database;
    result.process_allocation_method_default = item?.default_allocation_method;
    result.process_allocation_factors = JSON.stringify(item?.allocation_factors);
    result.process_exchanged_flows = JSON.stringify(item?.exchanges);
    result.process_parameters = JSON.stringify(item?.parameters);
    Iresult_process.push(result);
  });
  return Iresult_process;
}



const resolvers = {
  Query: {
    Flows() {return flow()},
    Processes() {return process()}
    // Locations() {return Location()}
  },
  Flow:{
    async flow_categories(parent){
      // const categories = await prisma.categories.findFirst({ where: {data_name: parent.flow_category_name,category_type:'Flow'}, select: {category_name: true,category_path:true} })
      const categories = await prisma.categories.findFirst({ where: { id: parent.category_id??'Null'}, select:{data_name:true,category_name: true,category_path:true}})
      const category_class_list  = categories.category_path as Prisma.JsonArray ;
      let bufferArray: string []=[];
      category_class_list?.forEach(item=>{
        bufferArray.push(item?.toString());
      })
      return {'category_name':categories.data_name,'category_subclass':categories.category_name,'category_class':bufferArray}
    },
    async flow_locations(parent){
      const location = await prisma.locations.findFirst({ 
        // where: {data_name: parent.location_name??'Null'}, 
      where: {id: parent.location_id??'Null'}, 
      select:{data_name:true,description:true,longitude:true,latitude:true,code:true,geometry_type:true,geometry_geometries:true}})
      // select:{data_name:true}})
      return {'name':location.data_name,'code':location.code,'description':location.description,'longitude':location.longitude,'latitude':location.latitude,'geometry_type':location.geometry_type,'geometry_geometries':JSON.stringify(location.geometry_geometries)}
      // return {'name':location.data_name}
    },
  },
  Process:{
    async process_categories(parent){
      const categories = await prisma.categories.findFirst({ where: { id: parent.category_id??'Null'}, select:{data_name:true,category_name: true,category_path:true}})
      const category_class_list  = categories.category_path as Prisma.JsonArray ;
      let bufferArray: string []=[];
      category_class_list?.forEach(item=>{
        bufferArray.push(item?.toString());
      })
      return {'category_name':categories.data_name,'category_subclass':categories.category_name,'category_class':bufferArray}
    },
    async process_locations(parent){
      const location = await prisma.locations.findFirst({ 
        // where: {data_name: parent.location_name??'Null'}, 
      where: {id: parent.location_id??'Null'}, 
      select:{data_name:true,description:true,longitude:true,latitude:true,code:true,geometry_type:true,geometry_geometries:true}})
      // select:{data_name:true}})
      return {'name':location.data_name,'code':location.code,'description':location.description,'longitude':location.longitude,'latitude':location.latitude,'geometry_type':location.geometry_type,'geometry_geometries':JSON.stringify(location.geometry_geometries)}
      // return {'name':location.data_name}
    },
    async process_valid_period(parent){
      const period = await prisma.processes.findFirst({
        where:{id:parent.id??'Null'},
        select:{
          process_documentation_valid_from:true,
          process_documentation_valid_until:true,
        }
      })
      return {'time_from':JSON.stringify(period.process_documentation_valid_from),'time_until':JSON.stringify(period.process_documentation_valid_until)}
    },
    async documentations(parent){
      const documentation = await prisma.processes.findFirst({
        where:{ id : parent.id??'Null'},
        select:{
          process_documentation_time_description:true,
          process_documentation_technology_description:true,
          process_documentation_geography_description:true,
          process_documentation_project_description:true,
          process_documentation_inventory_method_description:true,
          process_documentation_modeling_constants_description:true,
          process_documentation_intended_application:true,
          process_documentation_restrictions_description:true,
          process_documentation_copyright:true,
          process_documentation_creation_date:true,
          process_documentation_review_details:true,
          process_documentation_sources:true,
          // for child
          process_documentation_data_documentor_id:true,
          process_documentation_data_generator_id:true,
          process_documentation_data_set_owner_id:true,
          process_documentation_reviewer_id:true,
          process_documentation_publication_id:true,
        },
      })
      return {
        'time':documentation.process_documentation_time_description,
        'technology':documentation.process_documentation_technology_description,
        'geography':documentation.process_documentation_geography_description,
        'project':documentation.process_documentation_project_description,
        'inventory_method':documentation.process_documentation_inventory_method_description,
        'modeling_constants':documentation.process_documentation_modeling_constants_description,
        'intended_applications':documentation.process_documentation_intended_application,
        'restrictions':documentation.process_documentation_restrictions_description,
        'copyright':documentation.process_documentation_copyright,
        'creation_date':JSON.stringify(documentation.process_documentation_creation_date),
        'review_details':documentation.process_documentation_review_details,
        'sources':JSON.stringify(documentation.process_documentation_sources),
      }
    },
    async data_quality_systems(parent){
      const dq_system = await prisma.dq_systems.findFirst({
        where:{id:parent.exchange_dq_system_id},
        select:{data_name:true,description:true,has_uncertainties:true,indicators:true,source_id:true}
      })
      return {'data_quality_system_name':dq_system.data_name,'data_quality_system_description':dq_system.description,'data_quality_system_has_uncertainty':dq_system.has_uncertainties,'data_quality_system_indicators':dq_system.indicators}
    },
    async data_descriptions(parent){
      const data_description = await prisma.processes.findFirst({
        where:{ id : parent.id??'Null'},
        select:{
          process_documentation_data_collection_description:true,
          process_documentation_data_selection_description:true,
          process_documentation_data_treatment_description:true,
          process_documentation_completeness_description:true,
          process_documentation_sampling_description:true,
        }})
        return {
          'collection':data_description.process_documentation_data_collection_description,
          'selection':data_description.process_documentation_data_selection_description,
          'treatment':data_description.process_documentation_data_treatment_description,
          'sampling':data_description.process_documentation_sampling_description,
          'completeness':data_description.process_documentation_completeness_description,
        }
    },
  },
//   Publication{
//     async (parent){
//     const source = await prisma.sources.findFirst({
//       where:{
//         id:parent.process_documentation_publication_id
//       },
//       select:{
//         data_name:true,
//         description:true,
//         year:true,
//         text_reference:true,
//         url:true,
//         category_id:true,
//       },
//       })
//       return {
//       'name' : source.data_name,
//       'description':source.description,
//       'year':source.year,
//       'text_reference':source.text_reference,
//       'url':source.url,
//       }
//   },
// },
}

export default resolvers;
