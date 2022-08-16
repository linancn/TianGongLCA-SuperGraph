import { PrismaClient, Prisma, categories } from '@prisma/client';




const prisma = new PrismaClient();
interface Context {prisma: PrismaClient};
const context: Context = {prisma: prisma,};
interface Iresult_flow {
  name:string;
  description:string;
  cas_number: string;
  formula:string;
  synonyms:string;
  type:string;
  database:string;
  properties:string;
  flow_category_id:string;
  // flow_category_name:string;
  location_id:string;
  // location_name:string;
}
async function flow() {
  // Data form database
  const flows = await prisma.flows.findMany({
    take:88,
    select: {
      data_name:true,
      description:true,
      formula:true,
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
      name:'',
      description: '',
      cas_number:'',
      formula:'',
      synonyms:'',
      type:'',
      database:'',
      flow_category_id:'',
      // flow_category_name:'',
      properties:'',
      location_id:'',
      // location_name:'',
    };
    result.name = item?.data_name;
    result.formula = item?.formula;
    result.cas_number = item?.cas;
    result.description = item?.description;
    result.synonyms = item?.synonyms;
    result.type = item?.flow_type;
    result.database = item?.database;
    result.flow_category_id = item?.category_id;
    // result.flow_category_name = item?.category_name;
    result.properties = JSON.stringify(item?.flow_properties)
    result.location_id = item?.location_id;
    // result.location_name = item?.location_name;
    resultJson_flow.push(result);
  });
  return resultJson_flow;
}

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

interface Iresult_flow_property {
  name:string;
  description:string;
  type:string;
  category_id:string;
  unit_group_id:string;
}
async function flow_property() {
  // Data form database
  const flows = await prisma.flow_properties.findMany({
    take:88,
    select: {
      data_name:true,
      description:true,
      flow_property_type: true,
      category_id:true,
      unit_group_id:true
    },
  });
  // Defining the new json array schema
  let resultJson_flow_property: any[] = [];
  // Fill in the data
  flows?.forEach(item => {
    // Defining json item
    let result: Iresult_flow_property = {
      name:'',
      description: '',
      type:'',
      category_id:'',
      unit_group_id:'',
    };
    result.name = item?.data_name;
    result.description = item?.description;
    result.type = item?.flow_property_type;
    result.category_id = item?.category_id;
    result.unit_group_id = item?.unit_group_id;
    resultJson_flow_property.push(result);
  });
  return resultJson_flow_property;
}

interface Iresult_categories{
  category_name:string,
  category_subclass:string,
  category_class:string[],
}

async function category(category_id:string) {
  // Data form database
  const categories = await prisma.categories.findFirst({
    where:{id:category_id  },
    select:{data_name:true,category_name:true,category_path:true,},
  });
  // Defining the new json array schema
  const category_class_list  = categories.category_path as Prisma.JsonArray ;
  let bufferArray: string []=[];
  category_class_list?.forEach(item=>{bufferArray.push(item?.toString());})
  return {'category_name':categories.data_name,'category_subclass':categories.category_name,'category_class':bufferArray}
}

const resolvers = {
  Query: {
    Flows() {return flow()},
    Processes() {return process()},
    FlowProperties(){return flow_property()}
    // Locations() {return Location()}
  },
  Flow:{
    async categories(parent){return category(parent.category_id)},
    async locations(parent){
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
    async categories(parent){return category(parent.category_id)},
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
  Documentation:{
    async publication(parent) {
        const source = await prisma.sources.findFirst({
          where:{
            id:parent.process_documentation_publication_id
          },
          select:{
            data_name:true,
            description:true,
            year:true,
            text_reference:true,
            url:true,
            // for child
            category_id:true,
          },
          })
          return {
          'name' : source.data_name,
          'description':source.description,
          'year':source.year,
          'text_reference':source.text_reference,
          'url':source.url,
          }
    },
    async documentor(parent) {
      const actor = await prisma.actors.findFirst({
        where:{id : parent.process_documentation_data_documentor_id},
        select:{
          data_name:true,
          description:true,
          telefax:true,
          website:true,
          address:true,
          email:true,
          telephone:true,
          country:true,
          city:true,
          zip_code:true,
          // for child
          category_id:true,
        }
      })
      return {
        'name':actor.data_name,
        'description':actor.description,
        'telefax':actor.telefax,
        'website':actor.website,
        'address':actor.address,
        'email':actor.email,
        'telephone':actor.telephone,
        'country':actor.country,
        'city':actor.city,
        'zip_code':actor.zip_code,
      }
    },
    async generator(parent) {
      const actor = await prisma.actors.findFirst({
        where:{id : parent.process_documentation_data_generator_id},
        select:{
          data_name:true,
          description:true,
          telefax:true,
          website:true,
          address:true,
          email:true,
          telephone:true,
          country:true,
          city:true,
          zip_code:true,
          // for child
          category_id:true,
        }
      })
      return {
        'name':actor.data_name,
        'description':actor.description,
        'telefax':actor.telefax,
        'website':actor.website,
        'address':actor.address,
        'email':actor.email,
        'telephone':actor.telephone,
        'country':actor.country,
        'city':actor.city,
        'zip_code':actor.zip_code,
      }
    },
    async owner(parent) {
      const actor = await prisma.actors.findFirst({
        where:{id : parent.process_documentation_data_set_owner_id},
        select:{
          data_name:true,
          description:true,
          telefax:true,
          website:true,
          address:true,
          email:true,
          telephone:true,
          country:true,
          city:true,
          zip_code:true,
          // for child
          category_id:true,
        }
      })
      return {
        'name':actor.data_name,
        'description':actor.description,
        'telefax':actor.telefax,
        'website':actor.website,
        'address':actor.address,
        'email':actor.email,
        'telephone':actor.telephone,
        'country':actor.country,
        'city':actor.city,
        'zip_code':actor.zip_code,
      }
    },
    async reviewer(parent) {
      const actor = await prisma.actors.findFirst({
        where:{id : parent.process_documentation_reviewer_id},
        select:{
          data_name:true,
          description:true,
          telefax:true,
          website:true,
          address:true,
          email:true,
          telephone:true,
          country:true,
          city:true,
          zip_code:true,
          // for child
          category_id:true,
        }
      })
      return {
        'name':actor.data_name,
        'description':actor.description,
        'telefax':actor.telefax,
        'website':actor.website,
        'address':actor.address,
        'email':actor.email,
        'telephone':actor.telephone,
        'country':actor.country,
        'city':actor.city,
        'zip_code':actor.zip_code,
      }
    },
  },
  DataQualitySystem:{
    async source(parent){
      const source = await prisma.sources.findFirst({
        where:{id : parent.source_id},
        select:{
          data_name:true,
          description:true,
          year:true,
          text_reference:true,
          url:true,
          category_id:true,
        },
      })
      return{
        'name':source.data_name,
        'description':source.description,
        'year':source.year,
        'text_reference':source.text_reference,
        'url':source.url,
      }
    }
  },
  Source:{
    async categories(parent){return category(parent.category_id)},
  },
  Actor:{
    async categories(parent){return category(parent.category_id)},
  },
  FlowProperty:{
    async categories(parent){return category(parent.category_id)},
    async unit(parent){
      const unit_groups = await prisma.unit_groups.findFirst({
        where:{id:parent.unit_group_id},
        select:{
          units:true,
          data_name:true,
          description:true,
          category_id:true,
        }
      })
      return {
        'unit':JSON.stringify(unit_groups?.units),
        'group_name':unit_groups.data_name,
        'group_description':unit_groups.description
      }
    }
  },
  UnitGroup:{
    async categories(parent){return category(parent.category_id)},
  }
}

export default resolvers;
