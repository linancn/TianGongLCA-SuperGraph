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
  name:string;
  exchange_dq_system_id:string;
  description:string;
  type:string;
  allocation_method:string;
  allocation_factors:string;
  exchanged_flows:string;
  parameters:string;
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
      name:'',
      description:'',
      type:'',
      allocation_method:'',
      allocation_factors:'',
      exchanged_flows:'',
      parameters:'',
      database:'',
    };
    result.id = item?.id;
    result.category_id = item?.category_id;
    result.location_id = item?.location_id;
    result.exchange_dq_system_id = item?.exchange_dq_system_id;
    result.name = item?.data_name;
    result.description = item?.description;
    result.type = item?.process_type;
    result.database = item?.database;
    result.allocation_method = item?.default_allocation_method;
    result.allocation_factors = JSON.stringify(item?.allocation_factors);
    result.exchanged_flows = JSON.stringify(item?.exchanges);
    result.parameters = JSON.stringify(item?.parameters);
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

interface Iresult_lcia_method {
  name:string;
  description:string;
  category_id:string;
  impact_categories_id:[];
  normalization_and_weighting_sets:string;
}
async function lcia_method(){
  const method = await prisma.lcia_methods.findMany({
    take:10,
    select:{
      data_name:true,
      description:true,
      impact_categories:true,
      nw_sets:true,
      // for child
      category_id:true
    }
  })
  let resultJson_lcia_method: any[] = [];
  method?.forEach(item => {
    let result: Iresult_lcia_method = {
      name:'',
      description:'',
      impact_categories_id:[],
      normalization_and_weighting_sets:'',
      category_id : '',
    };
    result.name = item?.data_name;
    result.description = item?.description;
    result.category_id = item?.category_id;
    // console.log(result.category_id)
    // result.impact_categories_id = JSON.parse(JSON.stringify(item?.impact_categories)).map((i)=>{
    //   return JSON.stringify(lcia_impact_category(i['@id']).toString())
    // })
    result.impact_categories_id = JSON.parse(JSON.stringify(item?.impact_categories)).map((i)=>i['@id'])
    // result.impact_categories_id = JSON.parse(JSON.stringify(item?.impact_categories)).map((i)=> {lcia_impact_category(i['@id'])})
    result.normalization_and_weighting_sets = JSON.stringify(item?.nw_sets);
    resultJson_lcia_method.push(result);
  });
  return resultJson_lcia_method;
}

interface Iresult_lcia_impact_category {
  name:string;
  description:string;
  reference_unit_name:string;
  impact_factors:string;
  id:string;
}
async function lcia_impact_category(ids:any[]) {
  // console.log(typeof ids)
  // console.log('!')
  const impact_categories = await prisma.lcia_categories.findMany({
    // take:10,
    select:{data_name:true,description:true,reference_unit_name:true,impact_factors:true,id:true},
  })
  let resultJson_impact_categories : any[] = [];
  // console.log('......')
  // console.log('!!')
  impact_categories?.forEach(item => {
    if (ids.includes(item?.id)){
      let result: Iresult_lcia_impact_category = {
        name:'',
        description:'',
        reference_unit_name:'',
        impact_factors:'',
        id:'',
      };
      result.name = item?.data_name,
      result.description = item?.description,
      result.reference_unit_name = item?.reference_unit_name,
      result.impact_factors = JSON.stringify(item?.impact_factors),
      result.id = item?.id,
      resultJson_impact_categories.push(result)
    }
  });
  // console.log(result2)
  // console.log(resultJson_impact_categories)
  // console.log('!!!')
  return resultJson_impact_categories;
  // return result2;
}

async function category(category_id:string) {
  // Data form database
  const categories = await prisma.categories.findFirst({
    where:{id:category_id},
    select:{data_name:true,category_name:true,category_path:true,},
  });
  // Defining the new json array schema
  const category_class_list  = categories.category_path as Prisma.JsonArray ;
  let bufferArray: string []=[];
  category_class_list?.forEach(item=>{bufferArray.push(item?.toString());})
  return {'category_name':categories.data_name,'category_subclass':categories.category_name,'category_class':bufferArray}
}

async function actor(actor_id:string) {
  // Data form database
  const actor = await prisma.actors.findFirst({
    where:{id : actor_id},
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
}

async function source(source_id:string){
  const source = await prisma.sources.findFirst({
    where:{id:source_id},
    select:{
      data_name:true,
      description:true,
      year:true,
      text_reference:true,
      url:true,
      // for child
      category_id:true,
    }
  })
  return {
    'name' : source.data_name,
    'description':source.description,
    'year':source.year,
    'text_reference':source.text_reference,
    'url':source.url,
    }
}

async function location(location_id:string){
  const location = await prisma.locations.findFirst({ 
  where: {id: location_id}, 
  select:{
    data_name:true,
    description:true,
    longitude:true,
    latitude:true,
    code:true,
    geometry_type:true,
    geometry_geometries:true}
  })
  return {
    'name':location.data_name,
    'code':location.code,
    'description':location.description,
    'longitude':location.longitude,
    'latitude':location.latitude,
    'geometry_type':location.geometry_type,
    'geometry_geometries':JSON.stringify(location.geometry_geometries)
  }
}

const resolvers = {
  Query: {
    Flows() {return flow()},
    Processes() {return process()},
    FlowProperties(){return flow_property()},
    LCIAMethods() {return lcia_method()},
    // test() {return lcia_impact_category()}
    // LCIA_Impact_Categories() {return lcia_impact_category()}
    // Locations() {return Location()}
  },
  Flow:{
    async categories(parent){return category(parent.category_id)},
    async locations(parent){ return location(parent.location_id)},
  },
  Process:{
    async categories(parent){return category(parent.category_id)},
    async locations(parent){ return location(parent.location_id)},
    async valid_period(parent){
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
    async publication(parent) {return source(parent.process_documentation_publication_id)},
    async documentor(parent) {return actor(parent.process_documentation_data_documentor_id)},
    async generator(parent) {return actor(parent.process_documentation_data_generator_id)},
    async owner(parent) {return actor(parent.process_documentation_data_set_owner_id)},
    async reviewer(parent) {return actor(parent.process_documentation_reviewer_id)},
  },
  DataQualitySystem:{
    async source(parent){return source(parent.source_id)},
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
  },
  LCIA_Method:{
    async category(parent){return category(parent.category_id)},
    async impact_categories(parent){
      var array:any[] = parent.impact_categories_id;
      return lcia_impact_category(array)}
  }
}

export default resolvers;
