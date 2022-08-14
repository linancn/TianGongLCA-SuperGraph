import { PrismaClient, Prisma, categories } from '@prisma/client';
import { Context } from 'apollo-server-core';

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
}
const prisma = new PrismaClient();
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
      flow_properties:true
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
    resultJson_flows.push(result);
  });
  return resultJson_flows;
}

interface Iresult_categories {
  // id:string;
  category_name:string;
  category_subclass:string;
  category_class:string[];
  // id:string;
}
async function Category(category_id:string) {
  // Data form database
  const categories = await prisma.categories.findMany({
    // where: {
    //   id:category_id,
    // },
    select: {
      data_name:true,
      category_name:true,
      category_path:true,
    }

  });
  // Defining the new json array schema
  let resultJson_categories: any [] = [];
  // Fill in the data
  categories?.forEach(item => {
    // Defining json item
    let result: Iresult_categories = {
      category_name: '',
      category_subclass: '',
      category_class: [''],
      // category_id: '',
    };
    result.category_name = item?.data_name;
    result.category_subclass = item?.category_name;
    // result.category_id = item?.id;
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


const resolvers = {
  Query: {
    allFlows:() => {return flow()},
    allCategories: ()=>{return Category()}
  },
  // Flow:{
  //   flow_categories: (parent,_args,context:Context)=>{
  //     return 
  //     Category({category_id:parent?.flow_category_id})

  //   }
  // },
}
  // flow_category:{
  //   ()=>{return categories(parent.flow_category_id)}
  // }
  // flow_category:{
  //   allFlows(parent){return categories(parent.flow_category_id)},
  // },
  // Flow:{allFlows(parent){return categories(parent.flow_category_id)},},

export default resolvers;
